#!/bin/bash
#
# tabudb-update.sh - Safe update procedure for tabudb service
# 
# This script performs a safe update of the application:
# 1. Creates a backup
# 2. Pulls the latest code
# 3. Installs dependencies
# 4. Restarts the service
#
# Uses pwd to determine paths and service name

set -e  # Exit on error

# Determine paths and service name
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
APP_NAME="$(basename "$APP_DIR")"
SERVICE_NAME="$APP_NAME"

echo "========== PERFORMING UPDATE =========="
echo "Application directory: $APP_DIR"
echo "Service name: $SERVICE_NAME"

# Change to the application directory
cd "$APP_DIR"

# Create backup first
echo "Creating backup before update..."
if [ -f "$SCRIPT_DIR/tabudb-backup.sh" ]; then
    bash "$SCRIPT_DIR/tabudb-backup.sh"
else
    echo "Backup script not found. Creating simple backup..."
    BACKUP_DIR="$APP_DIR/backups"
    TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
    mkdir -p "$BACKUP_DIR"
    tar -czf "$BACKUP_DIR/$APP_NAME-$TIMESTAMP.tar.gz" \
        --exclude="node_modules" \
        --exclude=".git" \
        "$APP_DIR"
    echo "Simple backup created at: $BACKUP_DIR/$APP_NAME-$TIMESTAMP.tar.gz"
fi

# Pull latest changes
echo -e "\nPulling latest code..."
git pull

# Install dependencies
echo -e "\nInstalling dependencies..."
npm install

# Check if production build is needed
if [ -f "package.json" ] && grep -q "\"build\":" "package.json"; then
    echo -e "\nBuilding production assets..."
    npm run build
fi

# Restart service
echo -e "\nRestarting service..."
if command -v systemctl &> /dev/null && systemctl list-units --type=service | grep -q "$SERVICE_NAME"; then
    sudo systemctl restart "$SERVICE_NAME.service"
    
    # Check service status
    echo -e "\nChecking service status..."
    sleep 2
    sudo systemctl status "$SERVICE_NAME.service"
else
    echo "Service $SERVICE_NAME not found. If running in development mode, restart manually."
    if [ -f "$SCRIPT_DIR/tabudb-restart.sh" ]; then
        echo "You can use: $SCRIPT_DIR/tabudb-restart.sh"
    fi
fi

echo -e "\n========== UPDATE COMPLETE =========="
echo "Update completed successfully at $(date)"

