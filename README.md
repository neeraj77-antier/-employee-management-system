# Employee Management Platform

A full-stack Employee Management System built with **NestJS** (backend) and **React + TypeScript** (frontend), using **MySQL** as the database.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (RBAC)
- **Employee Management**: Complete CRUD operations for employee lifecycle
- **Attendance Tracking**: Clock-in/out functionality
- **Leave Management**: Request and approval workflows
- **Payroll System**: Salary generation and payslip management
- **Performance Reviews**: Rating and feedback system
- **Role-Based Dashboards**: Separate views for Admin, Manager, and Employee

## 📋 Tech Stack

### Backend

- **Framework**: NestJS
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Authentication**: Passport JWT
- **Validation**: class-validator

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **Forms**: Formik + Yup
- **HTTP Client**: Axios

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=employee_db

# Backend Configuration
BACKEND_PORT=3000
JWT_SECRET=supersecretkey123

# Frontend Configuration
FRONTEND_PORT=5173
```

### Running with Docker (Recommended)

```bash
# Start all services (MySQL, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3306

### Running Locally (Development)

#### 1. Start MySQL Database

```bash
docker-compose up mysql -d
```

#### 2. Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
/data/Test/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # Users module
│   │   ├── employees/      # Employees module
│   │   ├── departments/    # Departments module
│   │   ├── attendance/     # Attendance module
│   │   ├── leaves/         # Leave management
│   │   ├── payroll/        # Payroll module
│   │   └── performance/    # Performance reviews
│   └── Dockerfile
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── components/    # Reusable components
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── hooks/         # Custom hooks
│   │   └── constants/     # Constants & config
│   └── Dockerfile
├── docker-compose.yml
└── .env
```

## 🔐 Default Credentials

Since this is a development setup, you'll need to seed the database with a user. You can do this by:

1. Creating a user via the backend API
2. Or manually inserting into the database

Example user creation (you can use a tool like Postman or curl):

```bash
# This endpoint would need to be implemented in the backend
POST http://localhost:3000/users
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

**Note**: The password will be hashed automatically by bcrypt before storage.

## 🎨 User Roles

- **ADMIN**: Full access to all features
- **MANAGER**: Can manage team members, approve leaves, view performance
- **EMPLOYEE**: Can view own data, request leaves, clock in/out

## 📊 Database Schema

The system uses the following main entities:

- `users` - Authentication and user roles
- `employees` - Employee profile information
- `departments` - Organizational structure
- `attendance` - Daily attendance records
- `leave_requests` - Leave management
- `payroll` - Salary and payroll data
- `performance_reviews` - Performance ratings

## 🚧 Development

### Backend Development

```bash
cd backend
npm run start:dev    # Start with hot-reload
npm run build        # Build for production
npm run test         # Run tests
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📝 API Documentation

Once the backend is running, Swagger documentation will be available at:

```
http://localhost:3000/api
```

_(Note: Swagger setup needs to be completed)_

## 🔧 Troubleshooting

### Database Connection Issues

- Ensure MySQL container is running: `docker-compose ps`
- Check database credentials in `.env`
- Wait for MySQL to be fully initialized (check logs: `docker-compose logs mysql`)

### Port Conflicts

- If ports 3000, 3306, or 5173 are in use, update them in `.env` and `docker-compose.yml`

### Frontend Can't Connect to Backend

- Verify `VITE_API_URL` in `frontend/.env` points to the correct backend URL
- Check CORS settings in the backend if running on different domains

## 📄 License

This project is for educational/demonstration purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify as needed.
