# AWS EC2 Docker Deployment Guide

This guide will walk you through deploying your full-stack application (Frontend, Backend, and MySQL) to a single AWS EC2 instance using Docker Compose.

## 1. Prerequisites

- An AWS EC2 Instance (Amazon Linux 2023 or Ubuntu) is running.
- **Security Group Inbound Rules**:
  - **SSH (22)**: Your IP
  - **HTTP (80)**: Anywhere (0.0.0.0/0)
- You can SSH into the instance: `ssh -i key.pem ec2-user@your-ec2-ip`

## 2. Install Docker & Git

Run the following commands on your EC2 instance:

### For Amazon Linux 2023:

```bash
sudo yum update -y
sudo yum install -y docker git
sudo service docker start
sudo usermod -a -G docker ec2-user
# Install Docker Compose Plugin
sudo mkdir -p /usr/local/lib/docker/cli-plugins/
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
```

### For Ubuntu:

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin git
sudo usermod -aG docker $USER
```

**Important:** After running the `usermod` command, **logout and log back in** for the permission changes to take effect.

## 3. Clone Your Repository

Clone your code to the server.

```bash
git clone <YOUR_GITHUB_REPO_URL> app
cd app
```

## 4. Environment Configuration

Create a `.env` file in the root directory. This file will be used by `docker-compose.prod.yml`.

```bash
nano .env
```

Paste the following content (update the values as needed):

```ini
# Database Config
DB_USER=root
DB_PASSWORD=secure_password_here
DB_NAME=employee_db
DB_HOST=mysql
DB_PORT=3306

# Backend Config
JWT_SECRET=some_long_random_secret_string
BACKEND_PORT=3000
```

_Note: You don't need `VITE_API_URL` here because we handled it in the Dockerfile build process._

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

## 5. Deploy

Run the production docker-compose file. This will build your images and start the containers.

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

- `-f docker-compose.prod.yml`: Uses the production config we created.
- `-d`: Runs in detached mode (in the background).
- `--build`: Forces a rebuild of the images.

## 6. Verification

1.  Check if containers are running:
    ```bash
    docker compose -f docker-compose.prod.yml ps
    ```
2.  Open your browser and visit your EC2 Public IP: `http://<YOUR_EC2_PUBLIC_IP>`
3.  You should see the Frontend.
4.  Try to Login/Register. The requests will go to `http://<YOUR_EC2_PUBLIC_IP>/api/...`, which Nginx will proxy to the Backend container.

## 7. Troubleshooting

- **Cannot access site:** Check AWS Security Groups. Ensure Port 80 is open to `0.0.0.0/0`.
- **Database Connection Error:** Check logs:
  ```bash
  docker compose -f docker-compose.prod.yml logs backend
  ```
- **Re-deploying after code changes:**
  ```bash
  git pull
  docker compose -f docker-compose.prod.yml up -d --build
  ```
