# TabuDB Server Management Scripts

This document provides detailed information about the server management scripts available for the TabuDB API application. These scripts help automate common server administration tasks.

## Table of Contents

1. [Overview](#overview)
2. [tabudb-backup.sh](#tabudb-backupsh)
3. [tabudb-restore.sh](#tabudb-restoresh)
4. [tabudb-health.sh](#tabudb-healthsh)
5. [tabudb-security-audit.sh](#tabudb-security-auditsh)
6. [tabudb-update.sh](#tabudb-updatesh)
7. [tabudb-nginx-setup.sh](#tabudb-nginx-setupsh)
8. [tabudb-ssl-setup.sh](#tabudb-ssl-setupsh)
9. [tabudb-status.sh](#tabudb-statussh)
10. [tabudb-restart.sh](#tabudb-restartsh)
11. [tabudb-logs.sh](#tabudb-logssh)

## Overview

These scripts are designed to help with various aspects of server management for the TabuDB API application. They automate common tasks such as:

- Creating backups of application code and data
- Creating and restoring backups of application code and data
- Monitoring system health
- Auditing security configurations
- Setting up SSL certificates
- Managing the application service
- Configuring Nginx as a reverse proxy

All scripts are located in the `scripts/` directory and are executable. Most scripts include built-in help information that can be accessed by running the script with the `-h` or `--help` flag.

## tabudb-backup.sh

### Purpose
Creates comprehensive backups of the application code, configuration, Redis data, and Nginx configuration.

### Usage
```bash
sudo ./scripts/tabudb-backup.sh [options]
```

### Options
- `-d, --directory DIR`: Specify a custom backup directory (default: `/var/backups/tabudb`)
- `-r, --redis-only`: Backup only Redis data
- `-c, --code-only`: Backup only application code and configuration
- `-n, --nginx-only`: Backup only Nginx configuration
- `-h, --help`: Display help information

### Examples

#### Create a full backup
```bash
sudo ./scripts/tabudb-backup.sh
```

Output:
```
Creating backup directory: /var/backups/tabudb
Backing up application code and configuration...
Excluding node_modules and .git directories
Backup saved to: /var/backups/tabudb/tabudb-app-20230525-143022.tar.gz (5.2MB)

Backing up Redis data...
Redis dump copied to: /var/backups/tabudb/redis-dump-20230525-143022.rdb (2.1MB)

Backing up Nginx configuration...
Nginx config saved to: /var/backups/tabudb/nginx-config-20230525-143022.tar.gz (4.3KB)

Backup completed: /var/backups/tabudb
Files:
-rw-r--r-- 1 root root 5.2M May 25 14:30 tabudb-app-20230525-143022.tar.gz
-rw-r--r-- 1 root root 4.3K May 25 14:30 nginx-config-20230525-143022.tar.gz
-rw-r--r-- 1 root root 2.1M May 25 14:30 redis-dump-20230525-143022.rdb
```

#### Create only a Redis backup
```bash
sudo ./scripts/tabudb-backup.sh --redis-only
```

Output:
```
Creating backup directory: /var/backups/tabudb
Backing up Redis data...
Redis dump copied to: /var/backups/tabudb/redis-dump-20230525-143522.rdb (2.1MB)

Backup completed: /var/backups/tabudb
Files:
-rw-r--r-- 1 root root 2.1M May 25 14:35 redis-dump-20230525-143522.rdb
```

## tabudb-restore.sh

### Purpose
Restores the application, Redis data, and/or Nginx configuration from backups created by tabudb-backup.sh.

### Usage
```bash
sudo ./scripts/tabudb-restore.sh [options] [backup-file]
```

### Arguments
- `backup-file`: (Optional) Specific backup file to restore. If not provided, the script will list available backups.

### Options
- `-a, --app`: Restore application code and configuration
- `-r, --redis`: Restore Redis data
- `-n, --nginx`: Restore Nginx configuration
- `-l, --list`: List available backups without restoring
- `-d, --directory DIR`: Specify a custom backup directory (default: `/var/backups/tabudb`)
- `-f, --force`: Skip confirmation prompts
- `-h, --help`: Display help information

### Examples

#### List available backups
```bash
sudo ./scripts/tabudb-restore.sh --list
```

Output:
```
======== TABUDB RESTORE UTILITY ========

Available backups in /var/backups/tabudb:

Application backups:
1. tabudb-app-20230525-143022.tar.gz (5.2MB) - Created on: May 25, 2023 14:30:22
2. tabudb-app-20230526-091544.tar.gz (5.3MB) - Created on: May 26, 2023 09:15:44

Redis backups:
1. redis-dump-20230525-143022.rdb (2.1MB) - Created on: May 25, 2023 14:30:22
2. redis-dump-20230525-143522.rdb (2.1MB) - Created on: May 25, 2023 14:35:22
3. redis-dump-20230526-091544.rdb (2.2MB) - Created on: May 26, 2023 09:15:44

Nginx configuration backups:
1. nginx-config-20230525-143022.tar.gz (4.3KB) - Created on: May 25, 2023 14:30:22
2. nginx-config-20230526-091544.tar.gz (4.3KB) - Created on: May 26, 2023 09:15:44

To restore a backup, use:
sudo ./scripts/tabudb-restore.sh [--app|--redis|--nginx] <backup-file>
```

#### Restore application code
```bash
sudo ./scripts/tabudb-restore.sh --app tabudb-app-20230526-091544.tar.gz
```

Output:
```
======== TABUDB RESTORE UTILITY ========

Selected backup: tabudb-app-20230526-091544.tar.gz

WARNING: This will replace your current application code and configuration files.
All local changes will be lost.

Do you want to continue? [y/N]: y

Stopping tabu-db-api service...
Service stopped.

Creating backup of current application...
Current application backed up to: /var/backups/tabudb/tabudb-app-current-20230526-101522.tar.gz

Extracting application backup...
Restore completed successfully!

Starting tabu-db-api service...
Service started.

Checking service status...
● tabu-db-api.service - Tabu DB API Service
     Loaded: loaded (/etc/systemd/system/tabu-db-api.service; enabled; preset: enabled)
     Active: active (running) since Fri 2023-05-26 10:15:45 UTC; 2s ago
   Main PID: 4256 (npm)
      Tasks: 12 (limit: 4578)
     Memory: 68.5M
        CPU: 1.234s

Application has been successfully restored!
```

#### Restore Redis data
```bash
sudo ./scripts/tabudb-restore.sh --redis redis-dump-20230526-091544.rdb
```

Output:
```
======== TABUDB RESTORE UTILITY ========

Selected backup: redis-dump-20230526-091544.rdb

WARNING: This will replace all data in Redis.
Do you want to continue? [y/N]: y

Stopping redis-server service...
Service stopped.

Creating backup of current Redis data...
Current Redis data backed up to: /var/backups/tabudb/redis-dump-current-20230526-102025.rdb

Restoring Redis data...
Redis data restored successfully!

Starting redis-server service...
Service started.

Checking Redis service status...
● redis-server.service - Advanced key-value store
     Loaded: loaded (/lib/systemd/system/redis-server.service; enabled; preset: enabled)
     Active: active (running) since Fri 2023-05-26 10:20:45 UTC; 2s ago
   Main PID: 4356 (redis-server)
      Tasks: 5 (limit: 4578)
     Memory: 8.2M
        CPU: 245ms

Testing Redis connection...
PONG
Redis connection successful!

Redis data has been successfully restored!
```

#### Restore multiple components at once
```bash
sudo ./scripts/tabudb-restore.sh --app tabudb-app-20230526-091544.tar.gz --nginx nginx-config-20230526-091544.tar.gz
```

Output:
```
======== TABUDB RESTORE UTILITY ========

Selected application backup: tabudb-app-20230526-091544.tar.gz
Selected Nginx backup: nginx-config-20230526-091544.tar.gz

WARNING: This will replace:
1. Your current application code and configuration files
2. Your Nginx configuration

All local changes will be lost.

Do you want to continue? [y/N]: y

[Application restore details will be shown here]
[Nginx configuration restore details will be shown here]

All selected components have been successfully restored!
```

## tabudb-health.sh

### Purpose
Checks the overall health of the system, including system resources, service status, API health, and Redis connectivity.

### Usage
```bash
./scripts/tabudb-health.sh [options]
```

### Options
- `-s, --services-only`: Show only services status
- `-r, --resources-only`: Show only system resources
- `-a, --api-only`: Check only API health
- `-h, --help`: Display help information

### Examples

#### Perform a full health check
```bash
./scripts/tabudb-health.sh
```

Output:
```
========== SYSTEM HEALTH CHECK ==========

== System Resources ==
CPU Usage:
%Cpu(s):  3.5 us,  1.2 sy,  0.0 ni, 94.8 id,  0.5 wa

Memory Usage:
              total        used        free      shared  buff/cache   available
Mem:          15905        4298        8234         542        3372       10709
Swap:          2047           0        2047

Disk Usage:
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       230G   34G  185G  16% /

== Service Status ==
tabu-db-api: RUNNING
nginx: RUNNING
redis: RUNNING

== API Health Check ==
Domain: api.example.com
API Status Code: 200

== Redis Connection ==
PONG
Redis connection: OK

========== HEALTH CHECK COMPLETE ==========
```

#### Check only services status
```bash
./scripts/tabudb-health.sh --services-only
```

Output:
```
== Service Status ==
tabu-db-api: RUNNING
nginx: RUNNING
redis: RUNNING
```

## tabudb-security-audit.sh

### Purpose
Performs a basic security audit of the application, checking for open ports, failed login attempts, Nginx security headers, and file permissions.

### Usage
```bash
sudo ./scripts/tabudb-security-audit.sh [options]
```

### Options
- `-p, --ports-only`: Show only open ports
- `-l, --login-only`: Show only failed login attempts
- `-f, --files-only`: Check only file permissions
- `-h, --help`: Display help information

### Examples

#### Perform a full security audit
```bash
sudo ./scripts/tabudb-security-audit.sh
```

Output:
```
========== SECURITY AUDIT ==========

== Open Ports ==
tcp   LISTEN 0      511          0.0.0.0:80        0.0.0.0:*    users:(("nginx",pid=1234,fd=6))
tcp   LISTEN 0      511          0.0.0.0:443       0.0.0.0:*    users:(("nginx",pid=1234,fd=7))
tcp   LISTEN 0      128          0.0.0.0:22        0.0.0.0:*    users:(("sshd",pid=956,fd=3))
tcp   LISTEN 0      128        127.0.0.1:3001      0.0.0.0:*    users:(("node",pid=2345,fd=17))
tcp   LISTEN 0      128        127.0.0.1:6379      0.0.0.0:*    users:(("redis-server",pid=1045,fd=6))

== Failed Login Attempts ==
May 24 08:45:12 server sshd[3344]: Failed password for invalid user admin from 192.168.1.10 port 57390 ssh2
May 24 09:12:33 server sshd[3346]: Failed password for invalid user root from 192.168.1.10 port 57532 ssh2

== Nginx Security Headers ==
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options SAMEORIGIN;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

== File Permissions ==
Checking .env file permissions:
-rw------- 1 nim nim 873 May 23 15:45 .env
-rw-r--r-- 1 nim nim 642 May 23 15:42 .env.example

Checking SSL certificates:
drwx------ 2 root root 4096 May 20 10:15 api.example.com

========== AUDIT COMPLETE ==========
```

#### Check only file permissions
```bash
sudo ./scripts/tabudb-security-audit.sh --files-only
```

Output:
```
== File Permissions ==
Checking .env file permissions:
-rw------- 1 nim nim 873 May 23 15:45 .env
-rw-r--r-- 1 nim nim 642 May 23 15:42 .env.example

Checking SSL certificates:
drwx------ 2 root root 4096 May 20 10:15 api.example.com
```

## tabudb-update.sh

### Purpose
Safely updates the application by creating a backup first, then pulling the latest code, installing dependencies, and restarting the service.

### Usage
```bash
./scripts/tabudb-update.sh [options]
```

### Options
- `-n, --no-backup`: Skip backup before updating
- `-p, --pull-only`: Only pull latest code without restarting
- `-r, --restart-only`: Only restart the service without pulling
- `-h, --help`: Display help information

### Examples

#### Perform a full update
```bash
./scripts/tabudb-update.sh
```

Output:
```
========== PERFORMING UPDATE ==========

Creating backup before update...
[Backup details will be shown here]

Pulling latest code...
From github.com:username/tabudb-api
 * branch            main       -> FETCH_HEAD
Already up to date.

Installing dependencies...
added 15 packages, and audited 254 packages in 3s
found 0 vulnerabilities

Restarting service...
● tabu-db-api.service - Tabu DB API Service
     Loaded: loaded (/etc/systemd/system/tabu-db-api.service; enabled; preset: enabled)
     Active: active (running) since Thu 2023-05-25 15:10:45 UTC; 2s ago
   Main PID: 3456 (npm)
      Tasks: 12 (limit: 4578)
     Memory: 68.2M
        CPU: 1.027s

========== UPDATE COMPLETE ==========
```

#### Only restart the service
```bash
./scripts/tabudb-update.sh --restart-only
```

Output:
```
Restarting service...
● tabu-db-api.service - Tabu DB API Service
     Loaded: loaded (/etc/systemd/system/tabu-db-api.service; enabled; preset: enabled)
     Active: active (running) since Thu 2023-05-25 15:13:22 UTC; 2s ago
   Main PID: 3578 (npm)
      Tasks: 12 (limit: 4578)
     Memory: 68.2M
        CPU: 1.027s
```
```

## tabudb-nginx-setup.sh

### Purpose
Sets up Nginx as a reverse proxy for the TabuDB API application, allowing external access through a specified domain name.

### Usage
```bash
sudo ./scripts/tabudb-nginx-setup.sh <domain> [port]
```

### Arguments
- `domain`: The domain name to configure in Nginx (e.g., api.example.com)
- `port`: (Optional) The local port where the application is running (default: 3001)

### Options
- `-h, --help`: Display help information

### Examples

#### Set up Nginx proxy for a domain
```bash
sudo ./scripts/tabudb-nginx-setup.sh api.example.com
```

Output:
```
======== NGINX SETUP FOR TABU DB API ========

Checking if Nginx is installed...
Nginx is already installed.

Creating Nginx configuration for api.example.com -> localhost:3001
Configuration saved to: /etc/nginx/sites-available/api.example.com.conf

Creating symbolic link to enable the site...
Site enabled successfully.

Testing Nginx configuration...
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

Reloading Nginx...
Nginx reloaded successfully.

Configuration complete!
Your application is now accessible at: http://api.example.com

Remember to set up SSL for secure HTTPS access:
sudo ./scripts/tabudb-ssl-setup.sh api.example.com your@email.com

======== SETUP COMPLETE ========
```

#### Set up Nginx proxy with custom port
```bash
sudo ./scripts/tabudb-nginx-setup.sh api.example.com 3005
```

Output:
```
======== NGINX SETUP FOR TABU DB API ========

Checking if Nginx is installed...
Nginx is already installed.

Creating Nginx configuration for api.example.com -> localhost:3005
Configuration saved to: /etc/nginx/sites-available/api.example.com.conf

Creating symbolic link to enable the site...
Site enabled successfully.

Testing Nginx configuration...
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

Reloading Nginx...
Nginx reloaded successfully.

Configuration complete!
Your application is now accessible at: http://api.example.com

Remember to set up SSL for secure HTTPS access:
sudo ./scripts/tabudb-ssl-setup.sh api.example.com your@email.com

======== SETUP COMPLETE ========
```

## tabudb-ssl-setup.sh
### Purpose
Sets up SSL certificates with Let's Encrypt for your domain and configures Nginx to use HTTPS.

### Usage
```bash
sudo ./scripts/tabudb-ssl-setup.sh <domain> [email]
```

### Arguments
- `domain`: The domain name for which to obtain an SSL certificate
- `email`: (Optional) The email address for certificate notifications (default: admin@example.com)

### Options
- `-t, --test`: Use Let's Encrypt staging environment for testing
- `-h, --help`: Display help information

### Examples

#### Set up SSL for a domain
```bash
sudo ./scripts/tabudb-ssl-setup.sh api.example.com user@example.com
```

Output:
```
Checking if Nginx is installed...
Nginx is installed.

Checking if Certbot is installed...
Certbot is installed.

Obtaining SSL certificate for api.example.com...
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Requesting a certificate for api.example.com

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/api.example.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/api.example.com/privkey.pem
This certificate expires on 2023-08-23.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

Deploying certificate
Successfully deployed certificate for api.example.com to /etc/nginx/sites-available/api.example.com.conf
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-available/api.example.com.conf

Verifying SSL setup...
HTTP/2 200 
date: Thu, 25 May 2023 15:16:45 GMT
server: nginx/1.18.0
content-type: application/json; charset=utf-8
content-length: 43
strict-transport-security: max-age=31536000; includeSubDomains

SSL setup complete for api.example.com
```

## tabudb-status.sh

### Purpose
Shows the current status of the TabuDB API service, including service state, process information, and port information.

### Usage
```bash
./scripts/tabudb-status.sh [options]
```

### Options
- `-q, --quiet`: Show minimal output (only service state)
- `-j, --json`: Output in JSON format
- `-h, --help`: Display help information

### Examples

#### Check service status with full details
```bash
./scripts/tabudb-status.sh
```

Output:
```
======== TABU DB API SERVICE STATUS ========

Service State: ● active (running)
Service Name: tabu-db-api.service
Service Description: Tabu DB API Service
Service Loaded: loaded (/etc/systemd/system/tabu-db-api.service; enabled; preset: enabled)

Process Information:
Main PID: 3456 (npm)
Tasks: 12
Memory Usage: 76.8M
CPU Usage: 1.245s
Process Tree:
`- 3456 /usr/bin/npm start
   `- 3478 node /usr/bin/nodemon src/index.js
      `- 3492 /usr/bin/node src/index.js

Port Information:
Port 3001 is OPEN and LISTENING (used by PID 3492)

Environment Variables:
NODE_ENV: production
PORT: 3001
REDIS_URL: redis://localhost:6379

Service has been running since: Thu 2023-05-25 13:45:22 UTC

===========================================
```

#### Quick status check
```bash
./scripts/tabudb-status.sh --quiet
```

Output:
```
tabu-db-api.service: ACTIVE
```

## tabudb-restart.sh

### Purpose
Restarts the TabuDB API service and shows the status after restart.

### Usage
```bash
sudo ./scripts/tabudb-restart.sh [options]
```

### Options
- `-f, --force`: Force restart (stop and start)
- `-q, --quiet`: Show minimal output
- `-h, --help`: Display help information

### Examples

#### Restart service
```bash
sudo ./scripts/tabudb-restart.sh
```

Output:
```
Restarting tabu-db-api.service...
Service restarted successfully.

======== SERVICE STATUS AFTER RESTART ========

Service State: ● active (running)
Service Name: tabu-db-api.service
Process Information:
Main PID: 3678 (npm)
Tasks: 12
Memory Usage: 68.5M

Service has been running since: Thu 2023-05-25 15:20:45 UTC (5s ago)

=============

## tabudb-logs.sh

### Purpose
Displays the logs for the TabuDB API service with various filtering options.

### Usage
```bash
./scripts/tabudb-logs.sh [options] [lines]
```

### Arguments
- `lines`: Number of log lines to display (default: 100)

### Options
- `-f, --follow`: Follow logs in real-time (like tail -f)
- `-a, --all`: Show all logs (no line limit)
- `-t, --today`: Show only today's logs
- `-e, --errors`: Show only error logs
- `-h, --help`: Display help information

### Examples

#### Show the last 100 lines of logs
```bash
./scripts/tabudb-logs.sh
```

Output:
```
======== TABU DB API SERVICE LOGS ========
Showing last 100 log lines:

May 25 15:30:12 server npm[3492]: API server started on port 3001
May 25 15:30:12 server npm[3492]: Connected to Redis at localhost:6379
May 25 15:30:15 server npm[3492]: GET /api/v1/health 200 3.245 ms
May 25 15:31:22 server npm[3492]: GET /api/v1/users 200 24.532 ms
May 25 15:31:45 server npm[3492]: POST /api/v1/data 201 12.753 ms
[... more log entries ...]
```

#### Follow logs in real-time
```bash
./scripts/tabudb-logs.sh -f
```

Output:
```
======== TABU DB API SERVICE LOGS ========
Following logs in real-time. Press Ctrl+C to exit.

May 25 15:45:12 server npm[3492]: GET /api/v1/health 200 2.876 ms
May 25 15:45:34 server npm[3492]: GET /api/v1/users 200 22.143 ms
[... logs will continue to appear as they are generated ...]
```

#### Show only today's error logs
```bash
./scripts/tabudb-logs.sh -t -e
```

Output:
```
======== TABU DB API SERVICE LOGS ========
Showing today's error logs:

May 25 14:12:45 server npm[3492]: ERROR: Failed to connect to Redis - Error: connect ECONNREFUSED 127.0.0.1:6379
May 25 14:13:01 server npm[3492]: ERROR: Database query failed - Error: timeout exceeded
May 25 15:22:33 server npm[3492]: ERROR: Invalid request payload for /api/v1/data - missing required field 'name'
```

## tabudb-nginx-setup.sh

### Purpose
Sets up Nginx as a reverse proxy for the TabuDB API application, allowing external access through a specified domain name.

### Usage
```bash
sudo ./scripts/tabudb-nginx-setup.sh <domain> [port]
```

### Arguments
- `domain`: The domain name to configure in Nginx (e.g., api.example.com)
- `port`: (Optional) The local port where the application is running (default: 3001)

### Options
- `-h, --help`: Display help information

### Examples

#### Set up Nginx proxy for a domain
```bash
sudo ./scripts/tabudb-nginx-setup.sh api.example.com
```

Output:
```
======== NGINX SETUP FOR TABU DB API ========

Checking if Nginx is installed...
Nginx is already installed.

Creating Nginx configuration for api.example.com -> localhost:3001
Configuration saved to: /etc/nginx/sites-available/api.example.com.conf

Creating symbolic link to enable the site...
Site enabled successfully.

Testing Nginx configuration...
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

Reloading Nginx...
Nginx reloaded successfully.

Configuration complete!
Your application is now accessible at: http://api.example.com

Remember to set up SSL for secure HTTPS access:
sudo ./scripts/tabudb-ssl-setup.sh api.example.com your@email.com

======== SETUP COMPLETE ========
```

#### Set up Nginx proxy with custom port
```bash
sudo ./scripts/tabudb-nginx-setup.sh api.example.com 3005
```

Output:
```
======== NGINX SETUP FOR TABU DB API ========

Checking if Nginx is installed...
Nginx is already installed.

Creating Nginx configuration for api.example.com -> localhost:3005
Configuration saved to: /etc/nginx/sites-available/api.example.com.conf

Creating symbolic link to enable the site...
Site enabled successfully.

Testing Nginx configuration...
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

Reloading Nginx...
Nginx reloaded successfully.

Configuration complete!
Your application is now accessible at: http://api.example.com

Remember to set up SSL for secure HTTPS access:
sudo ./scripts/tabudb-ssl-setup.sh api.example.com your@email.com

======== SETUP COMPLETE ========
```
