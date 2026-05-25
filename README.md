# Employee Management System

A complete full-stack Employee Management System built with **React.js** (frontend) and **Spring Boot** (backend), using **JWT authentication**, **role-based access control**, and **MySQL** for data persistence.

---

## Project Overview

This system provides two distinct user roles:

| Role | Capabilities |
|------|-------------|
| **Admin** | Login, create tasks, assign tasks to employees, view all employees, monitor task statuses, view analytics |
| **Employee** | Login, view assigned tasks, accept tasks, reject tasks, mark tasks as completed |

---

## Features

- **JWT Authentication** — Stateless login with Bearer tokens
- **BCrypt Password Hashing** — Plain-text passwords are never stored
- **Role-Based Access Control** — `@PreAuthorize("hasRole('ADMIN')")` guards Admin endpoints
- **CORS Configured** — React (port 3000) ↔ Spring Boot (port 8080)
- **Global Error Handling** — `@ControllerAdvice` returns structured JSON errors
- **Task Lifecycle** — NEW → ACCEPTED → COMPLETED / REJECTED
- **Responsive UI** — Mobile-friendly dark dashboard
- **RESTful APIs** — Clean layered architecture (Controller → Service → Repository)

---

## Tech Stack

**Frontend**
- React.js 18
- Tailwind CSS 3
- Axios (HTTP client)
- React Router v6
- React Hooks (`useState`, `useEffect`)
- Recharts (analytics charts)
- React Hot Toast (notifications)
- Lucide React (icons)

**Backend**
- Spring Boot 3.2
- Spring Security
- JWT (jjwt 0.11.5)
- Spring Data JPA / Hibernate
- MySQL 8
- Lombok
- BCryptPasswordEncoder
- `@ControllerAdvice` global error handling
- `@Valid` request validation

---

## Architecture

```
┌─────────────────────────────────────────┐
│              React Frontend              │
│  Login → JWT stored → Axios sends token  │
│  Role check → Admin/Employee Dashboard   │
└──────────────────┬──────────────────────┘
                   │ REST API (HTTP + Bearer JWT)
┌──────────────────▼──────────────────────┐
│           Spring Boot Backend            │
│  Controller → Service → Repository       │
│  Spring Security → JWT Filter            │
│  BCrypt password hashing                 │
└──────────────────┬──────────────────────┘
                   │ JPA / Hibernate
┌──────────────────▼──────────────────────┐
│               MySQL Database             │
│  Tables: users, tasks                    │
└─────────────────────────────────────────┘
```

---

## JWT Authentication Flow

1. User submits email + password via React login form
2. React sends `POST /api/auth/login` using Axios
3. Spring Boot validates credentials against MySQL (BCrypt compare)
4. If valid → generates signed JWT token with user's role inside
5. React stores token in `localStorage`
6. Every subsequent request includes: `Authorization: Bearer <token>`
7. `JwtAuthFilter` validates token on every request
8. Valid token → proceeds. Invalid/expired → **401 Unauthorized**
9. `@PreAuthorize("hasRole('ADMIN')")` blocks unauthorized role access → **403 Forbidden**

> **Tamper-proof:** JWT is signed with a server-side secret key. Any modification breaks the signature and Spring Security rejects it.

---

## Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | Auto-increment |
| name | VARCHAR(100) | |
| email | VARCHAR(150) | Unique |
| password | VARCHAR(255) | BCrypt hashed |
| role | ENUM | ADMIN or EMPLOYEE |
| created_at | DATETIME | Auto-set |

### tasks
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | Auto-increment |
| title | VARCHAR(255) | |
| description | TEXT | Optional |
| due_date | DATE | Optional |
| status | ENUM | NEW / ACCEPTED / REJECTED / COMPLETED |
| assigned_to | BIGINT FK | → users.id |
| created_at | DATETIME | Auto-set |

---

## API Documentation

### Auth Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, receive JWT |

### User Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/employees` | Admin | Get all employees |
| GET | `/api/users/{id}` | Authenticated | Get user by ID |

### Task Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/tasks` | Admin | Create task |
| GET | `/api/tasks` | Authenticated | Get all tasks |
| GET | `/api/tasks/{id}` | Authenticated | Get task by ID |
| GET | `/api/tasks/employee/{userId}` | Authenticated | Get tasks by employee |
| PUT | `/api/tasks/{id}/status` | Authenticated | Update task status |
| DELETE | `/api/tasks/{id}` | Admin | Delete task |
| GET | `/api/tasks/stats` | Admin | Get task statistics |

---

## Installation & Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+

### Step 1 — Database Setup

```sql
CREATE DATABASE employee_management_db;
```

Then run the seed script:
```bash
mysql -u root -p employee_management_db < backend/schema.sql
```

### Step 2 — Configure Backend

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_management_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 3 — Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`

### Step 4 — Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@empms.com` | `admin123` |
| Employee | `emp@empms.com` | `emp123` |

---

## GitHub Push Commands

```bash
git init
git add .
git commit -m "Initial Commit — Employee Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/employee-management-system.git
git push -u origin main
```

---

## Key Interview Answers

**Q: How does frontend talk to backend?**
> React sends HTTP requests using Axios to Spring Boot REST API endpoints. For example, Admin creates a task → React sends `POST /api/tasks` with JSON → Spring Boot saves to MySQL → returns success response → React updates UI without page reload.

**Q: How is security implemented?**
> Spring Security with JWT. User logs in → BCrypt validates password → JWT signed with server-side secret → React sends it as `Authorization: Bearer <token>` → `JwtAuthFilter` validates on every request.

**Q: Can users tamper with their JWT role?**
> No. JWT is signed with a server-side secret key. If anyone modifies the token, the signature breaks and Spring Security rejects it with 401 Unauthorized.

**Q: What about scalability?**
> Since JWT is stateless, no sessions are stored on the server. Spring Boot can handle many concurrent users. HikariCP connection pooling manages DB connections efficiently.

---

## Future Improvements

- Real-time notifications via WebSockets (employees get instant alerts on task assignment)
- Email notifications using Spring Mail
- Task priority levels (HIGH / MEDIUM / LOW)
- File attachments on tasks
- Cloud deployment (React → Vercel, Spring Boot → Render, MySQL → Railway)
- Pagination for large task lists
- Task comments and activity log
- Admin analytics with date range filters

---

## Deployment Guide

**Frontend (Vercel):**
```bash
cd frontend
npm run build
# Upload dist/ to Vercel or connect GitHub repo
```

**Backend (Render / Railway):**
1. Create a MySQL instance on Railway
2. Update `application.properties` with cloud DB URL
3. Build: `mvn clean package -DskipTests`
4. Deploy the generated `target/*.jar` to Render

---

## Project Structure

```
employee-management-system/
├── backend/
│   ├── src/main/java/com/empms/
│   │   ├── controller/          # REST API controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # JPA interfaces (DB queries)
│   │   ├── entity/              # JPA entities (User, Task)
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── security/            # JWT filter, UserDetailsService
│   │   ├── config/              # SecurityConfig (CORS, filter chain)
│   │   └── exception/           # GlobalExceptionHandler
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── schema.sql
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/          # Loader, StatusBadge, StatCard, ProtectedRoute
    │   │   ├── layout/          # Sidebar, Navbar
    │   │   └── task/            # TaskCard, TaskTable, CreateTaskModal
    │   ├── pages/
    │   │   ├── auth/            # Login, Register
    │   │   ├── admin/           # AdminDashboard, AdminTasks, AdminEmployees
    │   │   ├── employee/        # EmployeeDashboard, EmployeeTasks
    │   │   └── Profile.jsx
    │   ├── context/             # AuthContext (user state, JWT)
    │   ├── services/            # api.js (Axios instance + all services)
    │   ├── layouts/             # DashboardLayout
    │   └── App.jsx              # Routes
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```
