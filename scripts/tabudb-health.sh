#!/bin/bash
#
# tabudb-health.sh - Comprehensive health check for tabu-db service
#
# This script checks:
# - System resources (CPU, memory, disk)
# - Service status
# - API health
# - Redis connection

# Exit on error
set -e

# Get the application name from the current directory
APP_NAME=$(basename "$(pwd)")
SERVICE_NAME="${APP_NAME}.service"

echo "========== SYSTEM HEALTH CHECK =========="
echo "Application: $APP_NAME"
echo "Date: $(date)"
echo "Server: $(hostname)"

# Check system resources
echo -e "\n== System Resources =="
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.,%nice.*//"

echo -e "\nMemory Usage:"
free -m

echo -e "\nDisk Usage:"
df -h | grep -v "tmpfs\|udev"

# Check process information
echo -e "\n== Process Information =="
APP_PID=$(pgrep -f "node.*index.js" || echo "Not running")
if [ "$APP_PID" != "Not running" ]; then
  echo "PID: $APP_PID"
  echo "Process Info:"
  ps -o pid,ppid,user,%cpu,%mem,vsz,rss,start,time,cmd -p "$APP_PID"
else
  echo "Process not running"
fi

# Check service status
echo -e "\n== Service Status =="
if systemctl is-active --quiet "$SERVICE_NAME" 2>/dev/null; then
  echo "$SERVICE_NAME: RUNNING"
  systemctl status "$SERVICE_NAME" --no-pager | grep "Active:" 
else
  echo "$SERVICE_NAME: NOT RUNNING"
fi

if systemctl is-active --quiet nginx.service 2>/dev/null; then
  echo "nginx: RUNNING"
else
  echo "nginx: NOT RUNNING"
fi

if systemctl is-active --quiet redis-server.service 2>/dev/null; then
  echo "redis: RUNNING"
else
  echo "redis: NOT RUNNING"
fi

# Get application port
PORT_ENV=$(grep "PORT=" .env 2>/dev/null | cut -d= -f2)
PORT=${PORT_ENV:-3001}

# Check if application is listening on port
echo -e "\n== Port Check =="
if ss -tuln | grep -q ":$PORT\\b"; then
  echo "Application is listening on port $PORT"
else
  echo "WARNING: No application listening on port $PORT"
fi

# Check Nginx configuration
echo -e "\n== Nginx Configuration Check =="
DOMAIN=$(grep -o 'server_name [^;]*' /etc/nginx/sites-available/*.conf 2>/dev/null | head -1 | awk '{print $2}' || echo "Not found")
if [ "$DOMAIN" != "Not found" ]; then
  echo "Domain: $DOMAIN"
  echo "Checking Nginx configuration:"
  sudo nginx -t 2>/dev/null && echo "Nginx configuration is valid" || echo "Nginx configuration has errors"
else
  echo "No Nginx configuration found or not properly configured"
fi

# Check application endpoint
echo -e "\n== API Health Check =="
if [ "$DOMAIN" != "Not found" ]; then
  echo "Checking API endpoint (http://$DOMAIN/health):"
  STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN/health" 2>/dev/null || echo "Failed")
  echo "API Status Code: $STATUS_CODE"
  
  if [ "$STATUS_CODE" = "200" ]; then
    echo "API health check: OK"
  else
    echo "API health check: FAILED"
  fi
else
  echo "Checking API endpoint (http://localhost:$PORT/health):"
  STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/health" 2>/dev/null || echo "Failed")
  echo "API Status Code: $STATUS_CODE"
  
  if [ "$STATUS_CODE" = "200" ]; then
    echo "API health check: OK"
  else
    echo "API health check: FAILED"
  fi
fi

# Check Redis connection
echo -e "\n== Redis Connection =="
if command -v redis-cli >/dev/null 2>&1; then
  REDIS_RESULT=$(redis-cli ping 2>/dev/null)
  if [ "$REDIS_RESULT" = "PONG" ]; then
    echo "Redis connection: OK"
    echo "Redis used memory: $(redis-cli info memory | grep used_memory_human | cut -d: -f2 | tr -d '[:space:]')"
    echo "Redis connected clients: $(redis-cli info clients | grep connected_clients | cut -d: -f2 | tr -d '[:space:]')"
  else
    echo "Redis connection: FAILED"
  fi
else
  echo "Redis CLI not installed"
fi

# Check for recent errors in logs
echo -e "\n== Recent Errors in Logs =="
if command -v journalctl >/dev/null 2>&1; then
  echo "Recent errors from $SERVICE_NAME (last 20 lines):"
  sudo journalctl -u "$SERVICE_NAME" --since "1 hour ago" | grep -i "error\|warn\|fail" | tail -20 || echo "No recent errors found"
else
  echo "journalctl not available, cannot check logs"
fi

echo -e "\n========== HEALTH CHECK COMPLETE =========="

