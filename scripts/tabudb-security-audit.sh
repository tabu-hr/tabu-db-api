#!/bin/bash
#
# tabudb-security-audit.sh - Basic security audit for the application
# Uses current directory instead of hardcoded paths

set -e  # Exit on error

echo "========== SECURITY AUDIT =========="
echo "Running from: $(pwd)"
echo "Date: $(date)"
echo

# Check open ports
echo -e "\n== Open Ports =="
echo "Checking for open ports and listening services..."
ss -tulpn | grep "LISTEN"

# Check for failed login attempts
echo -e "\n== Failed Login Attempts =="
echo "Checking for failed SSH login attempts (last 10)..."
if [ -f /var/log/auth.log ]; then
  grep "Failed password" /var/log/auth.log | tail -10
elif [ -f /var/log/secure ]; then
  grep "Failed password" /var/log/secure | tail -10
else
  journalctl -u sshd | grep "Failed password" | tail -10
fi

# Check Nginx configuration for security headers
echo -e "\n== Nginx Security Headers =="
if command -v nginx > /dev/null; then
  echo "Checking Nginx configurations for security headers..."
  if [ -d /etc/nginx/sites-available ]; then
    NGINX_CONF_DIR="/etc/nginx/sites-available"
  elif [ -d /etc/nginx/conf.d ]; then
    NGINX_CONF_DIR="/etc/nginx/conf.d"
  else
    NGINX_CONF_DIR="/etc/nginx"
  fi

  if grep -q "add_header" $NGINX_CONF_DIR/* 2>/dev/null; then
    grep "add_header" $NGINX_CONF_DIR/* 2>/dev/null
  else
    echo "No security headers found in Nginx configuration"
    echo "Recommended headers to add:"
    echo "  add_header X-Content-Type-Options nosniff;"
    echo "  add_header X-Frame-Options SAMEORIGIN;"
    echo "  add_header X-XSS-Protection \"1; mode=block\";"
    echo "  add_header Content-Security-Policy \"default-src 'self'\";"
  fi
  
  # Check for SSL configuration
  echo -e "\nChecking for SSL configuration..."
  if grep -q "ssl_certificate" $NGINX_CONF_DIR/* 2>/dev/null; then
    grep "ssl_certificate" $NGINX_CONF_DIR/* 2>/dev/null
  else
    echo "No SSL configuration found in Nginx"
  fi
else
  echo "Nginx not installed"
fi

# Check file permissions
echo -e "\n== File Permissions =="
echo "Checking sensitive file permissions..."

# Check .env files
echo "Environment files (.env*):"
find "$(pwd)" -maxdepth 1 -name ".env*" -exec ls -la {} \; 2>/dev/null || echo "No .env files found"

# Check config directory
if [ -d "$(pwd)/config" ]; then
  echo -e "\nConfig directory files:"
  find "$(pwd)/config" -type f -exec ls -la {} \; 2>/dev/null
fi

# Check SSL certificates
echo -e "\nChecking SSL certificates (if any):"
if [ -d /etc/letsencrypt/live ]; then
  ls -la /etc/letsencrypt/live/ 2>/dev/null
else
  echo "No Let's Encrypt certificates found"
fi

# Check for world-writable files
echo -e "\nChecking for world-writable files in the application directory:"
find "$(pwd)" -type f -perm -002 -not -path "*/node_modules/*" -not -path "*/\.*" | head -10

# Check for unsafe permissions on script files
echo -e "\nChecking script file permissions:"
find "$(pwd)/scripts" -name "*.sh" -exec ls -la {} \; 2>/dev/null

# Redis security check
echo -e "\n== Redis Security =="
if command -v redis-cli > /dev/null; then
  echo "Checking if Redis requires authentication..."
  REDIS_AUTH=$(redis-cli config get requirepass 2>/dev/null)
  if [[ "$REDIS_AUTH" == *"\"\"" ]] || [[ -z "$REDIS_AUTH" ]]; then
    echo "WARNING: Redis does not have authentication enabled"
  else
    echo "Redis authentication is enabled"
  fi
  
  echo "Checking if Redis is bound to localhost only..."
  REDIS_BIND=$(redis-cli config get bind 2>/dev/null)
  if [[ "$REDIS_BIND" == *"127.0.0.1"* ]] || [[ "$REDIS_BIND" == *"::1"* ]]; then
    echo "Redis is properly bound to localhost"
  else
    echo "WARNING: Redis may be accessible from external networks"
  fi
else
  echo "Redis CLI not found or not accessible"
fi

echo -e "\n========== AUDIT COMPLETE =========="

