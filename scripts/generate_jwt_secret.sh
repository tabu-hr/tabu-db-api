#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Generate a secure random string using OpenSSL and remove newlines
SECRET=$(openssl rand -base64 64 | tr -d '\n')
ENV_PATH="$(dirname "$(dirname "$0")")/.env"

echo -e "\n=== JWT Secret Generator ===\n"
echo "Generated JWT_SECRET:"
echo -e "${GREEN}${SECRET}${NC}"
echo -e "\nTo use this secret, you can:"
echo -e "\n1. Add it manually to your .env file:"
echo -e "${CYAN}JWT_SECRET=${SECRET}${NC}"

# Check if .env exists
if [ -f "$ENV_PATH" ]; then
    if grep -q "^JWT_SECRET=" "$ENV_PATH"; then
        echo -e "\n${YELLOW}JWT_SECRET already exists in .env file.${NC}"
        read -p "Do you want to update it? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Remove old JWT_SECRET and add new one
            grep -v "^JWT_SECRET=" "$ENV_PATH" > "${ENV_PATH}.tmp"
            echo "JWT_SECRET=${SECRET}" >> "${ENV_PATH}.tmp"
            mv "${ENV_PATH}.tmp" "$ENV_PATH"
            echo -e "\n${GREEN}Successfully updated JWT_SECRET in .env file${NC}"
        fi
    else
        echo -e "\n${YELLOW}.env file exists but doesn't have JWT_SECRET.${NC}"
        read -p "Do you want to add it? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "JWT_SECRET=${SECRET}" >> "$ENV_PATH"
            echo -e "\n${GREEN}Successfully added JWT_SECRET to .env file${NC}"
        fi
    fi
else
    echo -e "\n${YELLOW}.env file doesn't exist.${NC}"
    read -p "Do you want to create .env with JWT_SECRET? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "JWT_SECRET=${SECRET}" > "$ENV_PATH"
        echo -e "\n${GREEN}Successfully created .env file with JWT_SECRET${NC}"
    fi
fi

echo -e "\nMake sure to:"
echo "- Keep this secret secure"
echo "- Never commit it to version control"
echo "- Use different secrets for development and production"
echo -e "- Consider rotating the secret periodically in production\n"
