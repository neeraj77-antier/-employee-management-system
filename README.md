# Employee Management Platform

A comprehensive, full-stack Employee Management System designed to handle authenticated employee workflows, attendance tracking, payroll generation, and performance reviews. Built with **NestJS** and **React**.

---

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for **Admin**, **Manager**, and **Employee**.
- **Employee Management**: Full lifecycle management (Onboarding, Editing, Removal).
- **Attendance System**: Real-time Clock-In/Clock-Out with daily logging.
- **Payroll Automation**: Monthly salary calculation, slip generation, and PDF printing.
- **Leave Management**: Request, Approve, or Reject leave applications.
- **Performance Reviews**: Periodic evaluations and feedback storage.
- **Secure Authentication**: JWT-based stateless authentication with OTP verification.

---

## 🛠️ Tech Stack

### Backend

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Authentication**: Passport.js + JWT
- **Language**: TypeScript

### Frontend

- **Framework**: [React](https://reactjs.org/) (Vite)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + SCSS
- **Forms**: Formik + Yup
- **HTTP Client**: Axios

### DevOps

- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx (Production)

---

## 📋 Assumptions & Key Configurations

1.  **Static OTP**:
    - For demonstration and ease of testing, the OTP (One-Time Password) is **static**.
    - **Value**: `123456`
    - This is handled in the backend (`AuthService`) and is required for both Registration and Login.
2.  **Default Roles**:
    - The system supports `ADMIN`, `MANAGER`, and `EMPLOYEE`.
    - New self-registered users prefer the `EMPLOYEE` role by default unless changed in the database.
3.  **Database**:
    - The system expects a MySQL database.
    - Default port in Docker: `3306`.
    - Default local port: `3306` (or `3307` if configured in `.env`).

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or v20)
- Docker & Docker Compose (optional, but recommended)
- MySQL (if running locally without Docker)

---

### Option 1: Run with Docker (Recommended)

This method ensures consistency across environments.

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Set up Environment Variables:**
    Create a `.env` file in the root directory:

    ```ini
    # Database
    DB_HOST=mysql
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=rootpassword
    DB_NAME=employee_db

    # Backend
    BACKEND_PORT=3000
    JWT_SECRET=supersecretkey123

    # Frontend
    FRONTEND_PORT=5173
    ```

3.  **Run the production build:**

    ```bash
    docker compose -f docker-compose.prod.yml up -d
    ```

4.  **Access the Application:**
    - **Frontend**: http://localhost
    - **Backend API**: http://localhost/api

---

### Option 2: Run Locally (Development)

If you prefer to run services individually without Docker Compose.

#### 1. Database Setup

Ensure you have a MySQL instance running. You can use the provided `docker-compose.yml` just for the database:

```bash
docker compose up mysql -d
```

_Note: This maps MySQL to localhost:3306 (or check docker-compose.yml for mapped port)._

#### 2. Backend Setup

1.  Navigate to `backend`:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure `backend/.env` (ensure DB_HOST is `localhost`):
    ```ini
    DB_HOST=localhost
    DB_PORT=3306
    ...
    ```
4.  Start server:
    ```bash
    npm run start:dev
    ```
    Server runs at: `http://localhost:3000`

#### 3. Frontend Setup

1.  Navigate to `frontend`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start dev server:
    ```bash
    npm run dev
    ```
    App runs at: `http://localhost:5173`

---

## ☁️ Deployment (AWS EC2)

For deploying this application to an AWS EC2 instance, we have prepared a specific guide.

**👉 [Read the AWS Deployment Guide](./DEPLOY_GUIDE_AWS.md)**

This guide covers:

- Setting up an Amazon Linux 2023 instance
- Installing Docker
- Configuring Security Groups
- Deploying the `docker-compose.prod.yml` stack

---

## 📁 Project Structure

```bash
├── backend/                # NestJS Application
│   ├── src/
│   │   ├── auth/           # Login/Register & 123456 OTP Logic
│   │   ├── employees/      # CRUD for Employee profiles
│   │   ├── attendance/     # Check-in/Check-out logic
│   │   ├── payroll/        # Salary processing
│   │   └── ...
│   └── Dockerfile.prod     # Production Dockerfile
├── frontend/               # React Application
│   ├── src/
│   │   ├── pages/          # Screens (Login, Dashboard, Payroll, etc.)
│   │   ├── components/     # Reusable UI components
│   │   ├── store/          # Redux Global State
│   │   └── services/       # API call handlers
│   ├── nginx.conf          # Nginx Proxy Config
│   └── Dockerfile.prod     # Production Dockerfile
├── docker-compose.yml      # Local Dev Orchestration
├── docker-compose.prod.yml # Production Orchestration
└── DEPLOY_GUIDE_AWS.md     # AWS Deployment Instructions
```

## 🔐 Default Credentials & Seeding

**To create an optional ADMIN user initially:**

You can manually insert a user into the `users` table or use the Registration page and then manually update the role in the database to `ADMIN`.

**Default Login Flow:**

1.  Enter Email/Password.
2.  System validates credentials.
3.  Enter OTP: **123456**.
4.  Access Dashboard.
