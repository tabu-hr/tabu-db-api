#!/bin/bash
#
# tabudb-nginx-setup.sh - Set up Nginx proxy for tabu-db-api application
#
# This script:
# 1. Checks if Nginx is installed and installs it if needed
# 2. Creates an Nginx site configuration for the specified domain
# 3. Configures Nginx to proxy requests to the local tabu-db-api application
# 4. Enables the site, checks syntax, and reloads Nginx
#
# Usage: sudo ./scripts/tabudb-nginx-setup.sh <domain> [port]
#   <domain> - Domain name for the site (e.g., api.example.com)
#   [port]   - Optional: Port where the local application is running (default: 3001)
#

# Check if running as root or with sudo
if [ "$(id -u)" -ne 0 ]; then
  echo "This script needs to be run with sudo."
  echo "Please run: sudo $0 $*"
  exit 1
fi

# Exit on error
set -e

# Default application port
DEFAULT_PORT=3001

# Function to display usage information
usage() {
  echo "Usage: sudo $0 <domain> [port]"
  echo "  <domain> - Domain name for the site (e.g., api.example.com)"
  echo "  [port]   - Optional: Port where the local application is running (default: $DEFAULT_PORT)"
  echo ""
  echo "Example: sudo $0 api.example.com 3001"
  exit 1
}

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if domain argument is provided
if [ -z "$1" ]; then
  echo "Error: Domain name is required"
  usage
fi

DOMAIN="$1"

# Use provided port or default
PORT="${2:-$DEFAULT_PORT}"

echo "=========================================================="
echo "  Nginx Setup for tabu-db-api on $DOMAIN (port $PORT)"
echo "=========================================================="

# Check if Nginx is installed
echo "Checking if Nginx is installed..."
if ! command_exists nginx; then
  echo "Nginx not found. Installing Nginx..."
  
  # Detect package manager and install Nginx
  if command_exists apt-get; then
    apt-get update && apt-get install -y nginx
  elif command_exists dnf; then
    dnf install -y nginx
  elif command_exists yum; then
    yum install -y nginx
  elif command_exists pacman; then
    pacman -Sy --noconfirm nginx
  else
    echo "Error: Unable to install Nginx. Please install it manually and run this script again."
    exit 1
  fi
  
  echo "Nginx installed successfully."
else
  echo "Nginx is already installed."
fi

# Create Nginx site configuration directory if it doesn't exist
SITES_AVAILABLE="/etc/nginx/sites-available"
SITES_ENABLED="/etc/nginx/sites-enabled"

if [ ! -d "$SITES_AVAILABLE" ]; then
  echo "Creating $SITES_AVAILABLE directory..."
  mkdir -p "$SITES_AVAILABLE"
fi

if [ ! -d "$SITES_ENABLED" ]; then
  echo "Creating $SITES_ENABLED directory..."
  mkdir -p "$SITES_ENABLED"
fi

# Check if the sites-enabled directory is included in the main Nginx config
NGINX_CONF="/etc/nginx/nginx.conf"
if ! grep -q "sites-enabled" "$NGINX_CONF"; then
  echo "Adding sites-enabled to Nginx configuration..."
  # Check if http block exists
  if grep -q "http {" "$NGINX_CONF"; then
    # Add include directive before the end of http block
    sed -i '/http {/,/}/{s/}/    include \/etc\/nginx\/sites-enabled\/*;\n}/}' "$NGINX_CONF"
  else
    echo "Error: Cannot find 'http {}' block in Nginx configuration."
    exit 1
  fi
fi

# Create Nginx site configuration
CONFIG_FILE="$SITES_AVAILABLE/$DOMAIN.conf"
echo "Creating Nginx site configuration: $CONFIG_FILE"

cat > "$CONFIG_FILE" << EOF
# Nginx configuration for $DOMAIN
# Proxies to tabu-db-api application on port $PORT
# Created by tabudb-nginx-setup.sh on $(date)

server {
    listen 80;
    listen [::]:80;
    
    server_name $DOMAIN;
    
    access_log /var/log/nginx/$DOMAIN-access.log;
    error_log /var/log/nginx/$DOMAIN-error.log;
    
    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

echo "Configuration file created successfully."

# Create symbolic link to enable the site
ENABLED_LINK="$SITES_ENABLED/$DOMAIN.conf"
if [ -L "$ENABLED_LINK" ]; then
  echo "Removing existing symbolic link..."
  rm "$ENABLED_LINK"
fi

echo "Enabling site by creating symbolic link..."
ln -s "$CONFIG_FILE" "$ENABLED_LINK"

# Check Nginx configuration syntax
echo "Checking Nginx configuration syntax..."
nginx -t

# Reload Nginx to apply the new configuration
echo "Reloading Nginx..."
if command_exists systemctl; then
  systemctl reload nginx
else
  service nginx reload
fi

echo "=========================================================="
echo "  Setup completed successfully!"
echo "=========================================================="
echo "Your tabu-db-api application is now accessible via: http://$DOMAIN"
echo "The application is proxied from port $PORT"
echo ""
echo "Nginx site configuration: $CONFIG_FILE"
echo "Nginx access logs: /var/log/nginx/$DOMAIN-access.log"
echo "Nginx error logs: /var/log/nginx/$DOMAIN-error.log"
echo ""
echo "If you're using a public domain, make sure it points to this server."
echo "For local testing, add an entry to your hosts file:"
echo "  127.0.0.1 $DOMAIN"
echo "=========================================================="

