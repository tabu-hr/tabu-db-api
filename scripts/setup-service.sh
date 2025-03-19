#!/bin/bash

# Script to set up a systemd service for the current directory
# This script reads environment variables from .env (optional), 
# falls back to .env.example (also optional), creates a systemd service,
# and then enables and starts it.

set -e

# Check if script is run with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo"
  exit 1
fi

# Get current non-root user
if [ -n "$SUDO_USER" ]; then
  CURRENT_USER="$SUDO_USER"
else
  echo "Error: Unable to determine the current user. Please run this script with sudo."
  exit 1
fi

# Get user's primary group
CURRENT_GROUP=$(id -gn "$CURRENT_USER")

echo "Using user: $CURRENT_USER and group: $CURRENT_GROUP for the service"

# Define paths - use current directory as project dir
PROJECT_DIR="$(pwd)"
ENV_FILE="$PROJECT_DIR/.env"
ENV_EXAMPLE_FILE="$PROJECT_DIR/.env.example"

# Get base folder name for service name
FOLDER_NAME=$(basename "$PROJECT_DIR")
SERVICE_NAME="${FOLDER_NAME}.service"
SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME"

echo "Using project directory: $PROJECT_DIR"
echo "Service will be named: $SERVICE_NAME"

# Load environment variables from .env and .env.example
declare -A ENV_VARS

# First load defaults from .env.example if it exists
if [ -f "$ENV_EXAMPLE_FILE" ]; then
  echo "Loading default environment variables from .env.example..."
  while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    if [[ ! "$line" =~ ^# && -n "$line" ]]; then
      key=$(echo "$line" | cut -d= -f1)
      value=$(echo "$line" | cut -d= -f2-)
      ENV_VARS["$key"]="$value"
    fi
  done < "$ENV_EXAMPLE_FILE"
else
  echo "No .env.example file found. Continuing without default environment variables."
fi

# Then override with values from .env if it exists
if [ -f "$ENV_FILE" ]; then
  echo "Loading environment variables from .env..."
  while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    if [[ ! "$line" =~ ^# && -n "$line" ]]; then
      key=$(echo "$line" | cut -d= -f1)
      value=$(echo "$line" | cut -d= -f2-)
      ENV_VARS["$key"]="$value"
    fi
  done < "$ENV_FILE"
else
  echo "No .env file found. Using values from .env.example if available."
fi

# Create service file
echo "Creating systemd service file at $SERVICE_FILE..."

cat > "$SERVICE_FILE" << EOL
[Unit]
Description=$FOLDER_NAME Service

[Service]
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/npm start
Restart=always
User=$CURRENT_USER
Group=$CURRENT_GROUP
Environment=PATH=/usr/bin:/usr/local/bin
EOL

# Add all environment variables to service file
if [ ${#ENV_VARS[@]} -eq 0 ]; then
  echo "No environment variables found. Creating service without environment configuration."
else
  echo "Adding ${#ENV_VARS[@]} environment variables to service..."
  for key in "${!ENV_VARS[@]}"; do
    value="${ENV_VARS[$key]}"
    # If value contains spaces, wrap it in quotes
    if [[ "$value" == *" "* ]]; then
      echo "Environment=\"$key=$value\"" >> "$SERVICE_FILE"
    else
      echo "Environment=$key=$value" >> "$SERVICE_FILE"
    fi
  done
fi

# Add Install section
cat >> "$SERVICE_FILE" << EOL

[Install]
WantedBy=multi-user.target
EOL

# Set proper permissions
chmod 644 "$SERVICE_FILE"

# Reload systemd to recognize the new service
echo "Reloading systemd daemon..."
systemctl daemon-reload

# Enable the service to start on boot
echo "Enabling $SERVICE_NAME..."
systemctl enable "$SERVICE_NAME"

# Start the service
echo "Starting $SERVICE_NAME..."
systemctl start "$SERVICE_NAME"

# Check service status
echo "Service status:"
systemctl status "$SERVICE_NAME" --no-pager

echo "Done! The $SERVICE_NAME has been created, enabled, and started."
echo "To check logs, run: sudo journalctl -u $SERVICE_NAME -f"

