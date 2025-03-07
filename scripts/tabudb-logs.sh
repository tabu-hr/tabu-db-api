#!/bin/bash
#
# tabudb-logs.sh - Show logs for the tabu-db-api service
#
# This script displays the logs for the tabu-db-api systemd service
# with options for following new logs and filtering by time.

# Default is to show last 100 lines
LINES=100

# Process command line arguments
if [ "$1" == "-f" ] || [ "$1" == "--follow" ]; then
    echo "==== Following Live tabu-db-api Service Logs ===="
    echo "Press Ctrl+C to exit"
    sudo journalctl -u tabu-db-api.service -f
    exit 0
elif [ "$1" == "-a" ] || [ "$1" == "--all" ]; then
    echo "==== All tabu-db-api Service Logs ===="
    sudo journalctl -u tabu-db-api.service
    exit 0
elif [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    echo "Usage: $0 [option]"
    echo "Options:"
    echo "  -f, --follow    Follow live logs (like tail -f)"
    echo "  -a, --all       Show all logs"
    echo "  -t, --today     Show logs from today only"
    echo "  -h, --help      Show this help message"
    echo "  <number>        Show last <number> lines (default: 100)"
    exit 0
elif [ "$1" == "-t" ] || [ "$1" == "--today" ]; then
    echo "==== Today's tabu-db-api Service Logs ===="
    sudo journalctl -u tabu-db-api.service --since today
    exit 0
elif [[ "$1" =~ ^[0-9]+$ ]]; then
    LINES=$1
    echo "==== Last $LINES Lines of tabu-db-api Service Logs ===="
else
    echo "==== Last $LINES Lines of tabu-db-api Service Logs ===="
fi

# Show last N lines of logs
sudo journalctl -u tabu-db-api.service -n $LINES

echo -e "\nFor more options, run: ./tabudb-logs.sh --help"

