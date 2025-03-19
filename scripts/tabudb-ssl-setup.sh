#!/bin/bash
#
# tabudb-ssl-setup.sh - Set up SSL with Let's Encrypt for the application
#
# This script:
# - Installs certbot if not already installed
# - Obtains SSL certificates from Let's Encrypt
# - Configures Nginx to use the SSL certificates with HTTP/2 support
# - Adds proper SSL security headers
# - Tests the SSL setup
#
# Usage: sudo ./tabudb-ssl-setup.sh <domain> [email]

set -e  # Exit immediately if a command exits with a non-zero status

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Error: This script must be run with sudo or as root."
  exit 1
fi

# Get current working directory (the application directory)
APP_DIR=$(pwd)
APP_NAME=$(basename "$APP_DIR")

# Parse command line arguments
DOMAIN=$1
EMAIL=$2

# Validate domain
if [ -z "$DOMAIN" ]; then
  echo "Usage: sudo $0 <domain> [email]"
  echo "Example: sudo $0 api.example.com admin@example.com"
  exit 1
fi

# Use default email if not provided
if [ -z "$EMAIL" ]; then
  echo "No email provided, using webmaster@$DOMAIN"
  EMAIL="webmaster@$DOMAIN"
fi

echo "===== Setting up SSL with HTTP/2 for $DOMAIN ====="
echo "Application directory: $APP_DIR"
echo "Contact email: $EMAIL"

# Check for nginx and install if needed
if ! command -v nginx &> /dev/null; then
  echo "Nginx not found. Installing..."
  
  # Detect package manager
  if command -v apt &> /dev/null; then
    apt update
    apt install -y nginx
  elif command -v dnf &> /dev/null; then
    dnf install -y nginx
  elif command -v yum &> /dev/null; then
    yum install -y nginx
  elif command -v pacman &> /dev/null; then
    pacman -Sy --noconfirm nginx
  else
    echo "Error: Unsupported package manager. Please install Nginx manually."
    exit 1
  fi
  
  echo "Nginx installed successfully."
fi

# Verify Nginx supports HTTP/2
NGINX_VERSION=$(nginx -v 2>&1 | grep -oP "nginx/\K[0-9]+\.[0-9]+\.[0-9]+")
NGINX_MAJOR=$(echo $NGINX_VERSION | cut -d. -f1)
NGINX_MINOR=$(echo $NGINX_VERSION | cut -d. -f2)

# HTTP/2 support was added in Nginx 1.9.5
if [ "$NGINX_MAJOR" -lt 1 ] || ([ "$NGINX_MAJOR" -eq 1 ] && [ "$NGINX_MINOR" -lt 9 ]); then
  echo "Warning: Your Nginx version ($NGINX_VERSION) might not support HTTP/2."
  echo "HTTP/2 requires Nginx 1.9.5 or later. Continuing without HTTP/2."
  HTTP2_SUPPORT=false
else
  echo "Nginx version $NGINX_VERSION supports HTTP/2."
  HTTP2_SUPPORT=true
fi

# Check for certbot and install if needed
if ! command -v certbot &> /dev/null; then
  echo "Certbot not found. Installing..."
  
  # Detect package manager for certbot
  if command -v apt &> /dev/null; then
    apt update
    apt install -y certbot python3-certbot-nginx
  elif command -v dnf &> /dev/null; then
    dnf install -y certbot python3-certbot-nginx
  elif command -v yum &> /dev/null; then
    yum install -y certbot python3-certbot-nginx
  elif command -v pacman &> /dev/null; then
    pacman -Sy --noconfirm certbot certbot-nginx
  else
    echo "Error: Unsupported package manager. Please install Certbot manually."
    exit 1
  fi
  
  echo "Certbot installed successfully."
fi

# Check if nginx configuration directory exists
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"

if [ ! -d "$NGINX_SITES_AVAILABLE" ]; then
  echo "Creating Nginx sites-available directory..."
  mkdir -p "$NGINX_SITES_AVAILABLE"
fi

if [ ! -d "$NGINX_SITES_ENABLED" ]; then
  echo "Creating Nginx sites-enabled directory..."
  mkdir -p "$NGINX_SITES_ENABLED"
fi

# Check if nginx.conf includes sites-enabled
if ! grep -q "include.*sites-enabled" /etc/nginx/nginx.conf; then
  echo "Adding include directive for sites-enabled to nginx.conf..."
  sed -i '/http {/a \    include /etc/nginx/sites-enabled/*.conf;' /etc/nginx/nginx.conf
fi

# Get current application port - default to 3001 if not found
APP_PORT=$(grep -oP 'PORT=\K[0-9]+' "$APP_DIR/.env" 2>/dev/null || echo "3001")
echo "Detected application port: $APP_PORT"

# Create Nginx configuration
NGINX_CONF="$NGINX_SITES_AVAILABLE/$DOMAIN.conf"
echo "Creating Nginx configuration at $NGINX_CONF..."

cat > "$NGINX_CONF" << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl$([ "$HTTP2_SUPPORT" = true ] && echo " http2");
    server_name $DOMAIN;
    
    # SSL certificates will be configured by certbot
    
    # SSL parameters
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    
    # Modern TLS configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://localhost:$APP_PORT;
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

# Enable the site
if [ -d "$NGINX_SITES_ENABLED" ]; then
    echo "Enabling site configuration..."
    ln -sf "$NGINX_CONF" "$NGINX_SITES_ENABLED/$(basename "$NGINX_CONF")"
fi

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

# Reload Nginx
echo "Reloading Nginx..."
systemctl reload nginx

# Obtain SSL certificate
echo "Obtaining SSL certificate from Let's Encrypt..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$EMAIL"

# Check if HTTP/2 configuration was preserved
if [ "$HTTP2_SUPPORT" = true ]; then
    # Ensure HTTP/2 is still enabled after certbot modifications
    if ! grep -q "listen 443 ssl http2" "$NGINX_CONF"; then
        echo "Re-enabling HTTP/2 in Nginx configuration..."
        sed -i 's/listen 443 ssl;/listen 443 ssl http2;/g' "$NGINX_CONF"
        systemctl reload nginx
    fi
fi

# Test SSL setup
echo "Testing SSL setup..."
echo "Trying to connect to https://$DOMAIN..."
if command -v curl &> /dev/null; then
    # Send a request and check HTTP status code
    echo "Checking HTTPS connection..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" || echo "Failed")
    if [[ "$STATUS" == "2"* ]]; then
        echo "✅ SSL setup completed successfully! HTTPS is working."
    else
        echo "⚠️ SSL might not be working correctly. Got HTTP status: $STATUS"
        echo "Try accessing https://$DOMAIN in your browser to verify."
    fi
    
    if [ "$HTTP2_SUPPORT" = true ]; then
        # Check if HTTP/2 is actually being used
        echo "Checking HTTP/2 protocol..."
        if curl --http2 -I "https://$DOMAIN" 2>&1 | grep -q "HTTP/2"; then
            echo "✅ HTTP/2 is enabled and working!"
        else
            echo "⚠️ HTTP/2 might not be working correctly. Check your Nginx configuration."
        fi
    fi
else
    echo "curl not found. Please check https://$DOMAIN manually."
fi

# Setup automatic renewal in crontab if not already set
if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
    echo "Setting up automatic certificate renewal..."
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook \"systemctl reload nginx\"") | crontab -
    echo "Automatic renewal has been set up (daily at 3:00 AM)."
fi

echo ""
echo "===== SSL Setup Completed ====="
echo "Domain: https://$DOMAIN"
echo "Protocol: $([ "$HTTP2_SUPPORT" = true ] && echo "HTTP/2" || echo "HTTP/1.1")"
echo "SSL Certificate: /etc/letsencrypt/live/$DOMAIN/"
echo "Nginx Configuration: $NGINX_CONF"
echo ""
echo "Your site should now be accessible via HTTPS$([ "$HTTP2_SUPPORT" = true ] && echo " with HTTP/2 support")."
echo "Certificate will automatically renew when needed."

# Print HTTP/2 benefits if enabled
if [ "$HTTP2_SUPPORT" = true ]; then
    echo ""
    echo "===== HTTP/2 Benefits ====="
    echo "✓ Multiplexed connections (multiple requests in parallel)"
    echo "✓ Header compression (reduces overhead)"
    echo "✓ Binary protocol (more efficient parsing)"
    echo "✓ Server push capability (preload resources)"
    echo "✓ Improved performance and reduced latency"
fi

