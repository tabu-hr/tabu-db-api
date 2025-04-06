#!/bin/bash
#
# tabudb-stop.sh - Stop the tabu-db-api service
#
# This script stops the tabu-db-api systemd service

echo "==== tabu-db-api Service Stop ===="
sudo systemctl stop tabu-db-api.service

# Show process information for additional context
echo -e "\n==== Process Information ===="
ps aux | grep -E "tabu-db-api|node.*index\.js" | grep -v grep

# Check if the service is listening on ports
echo -e "\n==== Port Information ===="
sudo netstat -tulpn | grep -E "node|npm" || echo "No ports found (netstat not available or no listening ports)"

echo -e "\nTo see logs, run: ./tabudb-logs.sh"

