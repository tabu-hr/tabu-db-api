#!/bin/bash
#
# tabudb-backup.sh - Create regular backups of tabu database application
# 
# This script backs up:
# - Application code
# - Configuration files (.env)
# - Redis data (if using Redis persistence)
# - Nginx configurations

# Set variables
BACKUP_DIR="/var/backups/tabudb"
APP_DIR="$(pwd)"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_NAME="tabudb-backup-$TIMESTAMP"

# Check if script is run with sudo/root permissions for certain operations
if [ "$(id -u)" -ne 0 ]; then
  echo "Warning: Some operations might fail without sudo permissions."
  echo "Consider running with sudo for complete backup."
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# Backup application code and config
echo "Backing up application code and configuration..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME-app.tar.gz" \
  --exclude="node_modules" \
  --exclude=".git" \
  "$APP_DIR"

# Backup Redis data if RDB persistence is enabled
if [ -f /var/lib/redis/dump.rdb ]; then
  echo "Backing up Redis data..."
  if [ "$(id -u)" -eq 0 ]; then
    cp /var/lib/redis/dump.rdb "$BACKUP_DIR/redis-dump-$TIMESTAMP.rdb"
  else
    echo "Need sudo permissions to backup Redis data. Skipping..."
    echo "Run with sudo to backup Redis data."
  fi
else
  echo "Redis RDB file not found at default location. Skipping Redis backup."
  echo "If Redis is running with a different configuration, modify this script."
fi

# Backup Nginx configuration if exists
if [ -d /etc/nginx/sites-available ]; then
  echo "Backing up Nginx configuration..."
  if [ "$(id -u)" -eq 0 ]; then
    tar -czf "$BACKUP_DIR/nginx-config-$TIMESTAMP.tar.gz" /etc/nginx/sites-available
  else
    echo "Need sudo permissions to backup Nginx configuration. Skipping..."
    echo "Run with sudo to backup Nginx configuration."
  fi
else
  echo "Nginx configuration directory not found. Skipping Nginx backup."
fi

# Print backup summary
echo
echo "Backup completed: $BACKUP_DIR"
echo "Backup files:"
ls -lh "$BACKUP_DIR" | grep "$TIMESTAMP"
echo
echo "Total backup size:"
du -sh "$BACKUP_DIR" | cut -f1

