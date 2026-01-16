# Quick Start Guide

## 🚀 Getting Started

### Option 1: Docker (Recommended)

```bash
# 1. Start all services
cd /data/Test
docker-compose up -d

# 2. Wait for MySQL to initialize (check logs)
docker-compose logs -f mysql

# 3. Seed the database
docker-compose exec backend npm run seed

# 4. Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Option 2: Local Development

```bash
# 1. Start MySQL only
docker-compose up mysql -d

# 2. Backend
cd /data/Test/backend
npm install
npm run seed
npm run start:dev

# 3. Frontend (in new terminal)
cd /data/Test/frontend
npm install
npm run dev
```

## 🔐 Login Credentials

After seeding, use these credentials:

| Role     | Email                | Password    |
| -------- | -------------------- | ----------- |
| Admin    | admin@company.com    | admin123    |
| Manager  | manager@company.com  | manager123  |
| Employee | employee@company.com | employee123 |

## 📋 Testing the Application

1. **Login** as admin at http://localhost:5173/login
2. **Dashboard** - View stats and recent activity
3. **Employees** - Manage team members (Admin/Manager only)
4. **Navigation** - Use sidebar to explore features

## 🛠️ Common Commands

```bash
# View all running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Access backend shell
docker-compose exec backend sh

# Access MySQL
docker-compose exec mysql mysql -uroot -prootpassword employee_db
```

## ❓ Troubleshooting

**Frontend can't connect to backend?**

- Check `VITE_API_URL` in `/data/Test/frontend/.env`
- Ensure backend is running on port 3000

**Database connection error?**

- Wait for MySQL to fully initialize
- Check credentials in `/data/Test/.env`

**Port already in use?**

- Update ports in `.env` and `docker-compose.yml`
