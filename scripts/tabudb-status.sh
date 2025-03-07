#!/bin/bash
#
# tabudb-status.sh - Check the status of tabu-db-api service
#
# This script displays the current status of the tabu-db-api systemd service
# including whether it's running, uptime, and basic service details.

echo "==== tabu-db-api Service Status ===="
sudo systemctl status tabu-db-api.service

# Show process information for additional context
echo -e "\n==== Process Information ===="
ps aux | grep -E "tabu-db-api|node.*index\.js" | grep -v grep

# Check if the service is listening on ports
echo -e "\n==== Port Information ===="
sudo netstat -tulpn | grep -E "node|npm" || echo "No ports found (netstat not available or no listening ports)"

echo -e "\nTo see logs, run: ./tabudb-logs.sh"

