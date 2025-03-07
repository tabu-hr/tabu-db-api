#!/bin/bash
#
# tabudb-restart.sh - Restart the tabu-db-api service
#
# This script restarts the tabu-db-api systemd service and shows
# the current status after restarting.

echo "==== Restarting tabu-db-api Service ===="
sudo systemctl restart tabu-db-api.service

# Check if restart was successful
if [ $? -eq 0 ]; then
    echo -e "\n✅ Service restart command executed successfully."
else
    echo -e "\n❌ Service restart command failed with error code $?."
fi

# Show current status after restart
echo -e "\n==== Current Service Status ===="
sudo systemctl status tabu-db-api.service

echo -e "\nTo see logs, run: ./tabudb-logs.sh"

