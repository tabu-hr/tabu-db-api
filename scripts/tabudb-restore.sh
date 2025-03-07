#!/bin/bash
#
# tabudb-restore.sh - Restore from backups created by tabudb-backup.sh
#
# This script allows restoring:
# - Application code
# - Redis data
# - Nginx configuration
#
# Usage: ./scripts/tabudb-restore.sh [options]
#
# Author: System Administrator
# Created: $(date +%Y-%m-%d)

set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default settings
BACKUP_DIR="/var/backups/tabudb"
APP_DIR="$(pwd)"
SERVICE_NAME="tabu-db-api"
RESTORE_APP=false
RESTORE_REDIS=false
RESTORE_NGINX=false
SPECIFIC_BACKUP=""
DRY_RUN=false
BACKUP_FILE=""

# Print usage information
usage() {
    echo -e "${BLUE}Usage:${NC} $0 [options]"
    echo
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -a, --app               Restore application code"
    echo "  -r, --redis             Restore Redis data"
    echo "  -n, --nginx             Restore Nginx configuration"
    echo "  -b, --backup FILE       Specify backup file to restore from"
    echo "  -d, --backup-dir DIR    Specify backup directory (default: $BACKUP_DIR)"
    echo "  --dry-run               Show what would be done without making changes"
    echo "  --all                   Restore everything (app, Redis, Nginx)"
    echo "  --list                  List available backups"
    echo
    echo "Examples:"
    echo "  $0 --list                           # List available backups"
    echo "  $0 --app --redis                    # Restore app code and Redis data"
    echo "  $0 --backup tabudb-app-20230101.tar.gz --app  # Restore specific backup"
    echo "  $0 --all                            # Restore everything"
    echo
    exit 1
}

# Check if running as root when needed
check_root() {
    if [ "$RESTORE_REDIS" = true ] || [ "$RESTORE_NGINX" = true ]; then
        if [ "$(id -u)" -ne 0 ]; then
            echo -e "${RED}Error:${NC} This script needs to be run with sudo for Redis or Nginx restoration."
            exit 1
        fi
    fi
}

# Function to list available backups
list_backups() {
    echo -e "${BLUE}Available backups in ${BACKUP_DIR}:${NC}"
    
    # Check if there are app backups
    APP_BACKUPS=$(find "$BACKUP_DIR" -name "tabudb-app-*.tar.gz" 2>/dev/null | sort -r)
    if [ -n "$APP_BACKUPS" ]; then
        echo -e "${GREEN}Application backups:${NC}"
        find "$BACKUP_DIR" -name "tabudb-app-*.tar.gz" -printf "%T@ %TY-%Tm-%Td %TH:%TM:%TS %p\n" 2>/dev/null | sort -nr | cut -d' ' -f2- | sed 's|'"$BACKUP_DIR/"'||g'
    else
        echo -e "${YELLOW}No application backups found.${NC}"
    fi
    
    # Check if there are Redis backups
    REDIS_BACKUPS=$(find "$BACKUP_DIR" -name "redis-dump-*.rdb" 2>/dev/null | sort -r)
    if [ -n "$REDIS_BACKUPS" ]; then
        echo -e "\n${GREEN}Redis backups:${NC}"
        find "$BACKUP_DIR" -name "redis-dump-*.rdb" -printf "%T@ %TY-%Tm-%Td %TH:%TM:%TS %p\n" 2>/dev/null | sort -nr | cut -d' ' -f2- | sed 's|'"$BACKUP_DIR/"'||g'
    else
        echo -e "${YELLOW}No Redis backups found.${NC}"
    fi
    
    # Check if there are Nginx backups
    NGINX_BACKUPS=$(find "$BACKUP_DIR" -name "nginx-config-*.tar.gz" 2>/dev/null | sort -r)
    if [ -n "$NGINX_BACKUPS" ]; then
        echo -e "\n${GREEN}Nginx configuration backups:${NC}"
        find "$BACKUP_DIR" -name "nginx-config-*.tar.gz" -printf "%T@ %TY-%Tm-%Td %TH:%TM:%TS %p\n" 2>/dev/null | sort -nr | cut -d' ' -f2- | sed 's|'"$BACKUP_DIR/"'||g'
    else
        echo -e "${YELLOW}No Nginx configuration backups found.${NC}"
    fi
    
    exit 0
}

# Find the most recent backup of a given type
find_latest_backup() {
    local pattern="$1"
    local latest=$(find "$BACKUP_DIR" -name "$pattern" -printf "%T@ %p\n" 2>/dev/null | sort -nr | head -1 | cut -d' ' -f2-)
    
    if [ -z "$latest" ]; then
        echo ""
    else
        echo "$latest"
    fi
}

# Function to restore application code
restore_app() {
    echo -e "${BLUE}Restoring application code...${NC}"
    
    local backup_file="$1"
    if [ -z "$backup_file" ]; then
        backup_file=$(find_latest_backup "tabudb-app-*.tar.gz")
        if [ -z "$backup_file" ]; then
            echo -e "${RED}Error:${NC} No application backup found."
            return 1
        fi
    fi
    
    echo -e "Using backup: ${GREEN}$(basename "$backup_file")${NC}"
    
    # Ask for confirmation
    if [ "$DRY_RUN" = false ]; then
        read -p "This will overwrite the current application code. Are you sure? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Restoration cancelled.${NC}"
            return 0
        fi
        
        # Stop the service before restoration
        if systemctl is-active --quiet "$SERVICE_NAME"; then
            echo "Stopping $SERVICE_NAME service..."
            systemctl stop "$SERVICE_NAME"
        fi
        
        # Create a temporary directory for restoration
        local temp_dir=$(mktemp -d)
        echo "Extracting backup to temporary location..."
        tar -xzf "$backup_file" -C "$temp_dir"
        
        # Preserve .env files and node_modules
        if [ -f "$APP_DIR/.env" ]; then
            echo "Preserving .env file..."
            cp "$APP_DIR/.env" "$temp_dir/.env.preserve"
        fi
        
        if [ -d "$APP_DIR/node_modules" ]; then
            echo "Preserving node_modules directory..."
            mv "$APP_DIR/node_modules" "$temp_dir/node_modules"
        fi
        
        # Clear destination directory except for certain files/dirs
        echo "Clearing destination directory..."
        find "$APP_DIR" -mindepth 1 -not -path "*/\.*" -not -path "*/node_modules*" -delete
        
        # Move files from temp directory to destination
        echo "Restoring files..."
        find "$temp_dir" -mindepth 1 -maxdepth 1 -not -name "node_modules" -not -name ".env.preserve" -exec mv {} "$APP_DIR/" \;
        
        # Restore preserved files
        if [ -f "$temp_dir/.env.preserve" ]; then
            echo "Restoring preserved .env file..."
            mv "$temp_dir/.env.preserve" "$APP_DIR/.env"
        fi
        
        if [ -d "$temp_dir/node_modules" ]; then
            echo "Restoring preserved node_modules directory..."
            mv "$temp_dir/node_modules" "$APP_DIR/"
        fi
        
        # Clean up
        rm -rf "$temp_dir"
        
        # Restart the service
        echo "Starting $SERVICE_NAME service..."
        systemctl start "$SERVICE_NAME"
        
        echo -e "${GREEN}Application code restored successfully!${NC}"
    else
        echo -e "${YELLOW}DRY RUN:${NC} Would restore application code from $backup_file"
    fi
}

# Function to restore Redis data
restore_redis() {
    echo -e "${BLUE}Restoring Redis data...${NC}"
    
    local backup_file="$1"
    if [ -z "$backup_file" ]; then
        backup_file=$(find_latest_backup "redis-dump-*.rdb")
        if [ -z "$backup_file" ]; then
            echo -e "${RED}Error:${NC} No Redis backup found."
            return 1
        fi
    fi
    
    echo -e "Using backup: ${GREEN}$(basename "$backup_file")${NC}"
    
    # Ask for confirmation
    if [ "$DRY_RUN" = false ]; then
        read -p "This will overwrite the current Redis data. Are you sure? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Restoration cancelled.${NC}"
            return 0
        fi
        
        # Stop Redis service
        echo "Stopping Redis service..."
        systemctl stop redis-server || systemctl stop redis
        
        # Backup current Redis dump just in case
        if [ -f "/var/lib/redis/dump.rdb" ]; then
            echo "Creating a backup of the current Redis data..."
            cp "/var/lib/redis/dump.rdb" "/var/lib/redis/dump.rdb.before-restore-$(date +%Y%m%d-%H%M%S)"
        fi
        
        # Copy the backup to Redis data directory
        echo "Copying the backup to Redis data directory..."
        cp "$backup_file" "/var/lib/redis/dump.rdb"
        
        # Set proper ownership
        echo "Setting proper ownership..."
        chown redis:redis "/var/lib/redis/dump.rdb"
        
        # Start Redis service
        echo "Starting Redis service..."
        systemctl start redis-server || systemctl start redis
        
        echo -e "${GREEN}Redis data restored successfully!${NC}"
    else
        echo -e "${YELLOW}DRY RUN:${NC} Would restore Redis data from $backup_file"
    fi
}

# Function to restore Nginx configuration
restore_nginx() {
    echo -e "${BLUE}Restoring Nginx configuration...${NC}"
    
    local backup_file="$1"
    if [ -z "$backup_file" ]; then
        backup_file=$(find_latest_backup "nginx-config-*.tar.gz")
        if [ -z "$backup_file" ]; then
            echo -e "${RED}Error:${NC} No Nginx configuration backup found."
            return 1
        fi
    fi
    
    echo -e "Using backup: ${GREEN}$(basename "$backup_file")${NC}"
    
    # Ask for confirmation
    if [ "$DRY_RUN" = false ]; then
        read -p "This will overwrite the current Nginx configuration. Are you sure? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Restoration cancelled.${NC}"
            return 0
        fi
        
        # Backup current Nginx configuration
        echo "Backing up current Nginx configuration..."
        tar -czf "/tmp/nginx-config-before-restore-$(date +%Y%m%d-%H%M%S).tar.gz" /etc/nginx/sites-available /etc/nginx/sites-enabled
        
        # Extract the backup
        echo "Extracting the backup..."
        local temp_dir=$(mktemp -d)
        tar -xzf "$backup_file" -C "$temp_dir"
        
        # Copy the configuration files
        echo "Copying configuration files..."
        cp -r "$temp_dir/etc/nginx/sites-available/"* /etc/nginx/sites-available/
        
        # Recreate symbolic links in sites-enabled
        echo "Setting up sites-enabled..."
        rm -f /etc/nginx/sites-enabled/*
        for config in /etc/nginx/sites-available/*; do
            ln -sf "$config" "/etc/nginx/sites-enabled/$(basename "$config")"
        done
        
        # Clean up
        rm -rf "$temp_dir"
        
        # Test Nginx configuration
        echo "Testing Nginx configuration..."
        if nginx -t; then
            # Reload Nginx
            echo "Reloading Nginx..."
            systemctl reload nginx
            echo -e "${GREEN}Nginx configuration restored successfully!${NC}"
        else
            echo -e "${RED}Error:${NC} Nginx configuration test failed. Reverting changes..."
            # Revert to the backup made earlier
            tar -xzf "/tmp/nginx-config-before-restore-$(date +%Y%m%d-%H%M%S).tar.gz" -C /
            systemctl reload nginx
            echo -e "${YELLOW}Reverted to previous Nginx configuration.${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}DRY RUN:${NC} Would restore Nginx configuration from $backup_file"
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        -a|--app)
            RESTORE_APP=true
            shift
            ;;
        -r|--redis)
            RESTORE_REDIS=true
            shift
            ;;
        -n|--nginx)
            RESTORE_NGINX=true
            shift
            ;;
        -b|--backup)
            BACKUP_FILE="$2"
            shift 2
            ;;
        -d|--backup-dir)
            BACKUP_DIR="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --all)
            RESTORE_APP=true
            RESTORE_REDIS=true
            RESTORE_NGINX=true
            shift
            ;;
        --list)
            list_backups
            ;;
        *)
            echo -e "${RED}Error:${NC} Unknown option: $1"
            usage
            ;;
    esac
done

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}Error:${NC} Backup directory '$BACKUP_DIR' does not exist."
    exit 1
fi

# Check if at least one restore option is specified
if [ "$RESTORE_APP" = false ] && [ "$RESTORE_REDIS" = false ] && [ "$RESTORE_NGINX" = false ]; then
    echo -e "${RED}Error:${NC} Please specify what to restore. Use --help for options."
    exit 1
fi

# Check if running as root when needed
check_root

