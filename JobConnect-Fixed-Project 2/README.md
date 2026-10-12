# JobConnect – Online Job Portal

**JobConnect** is an enterprise-grade, full-stack recruitment and talent acquisition platform designed to seamlessly connect ambitious job seekers with verified recruiters and companies. Built with a React 19 + TypeScript frontend and a Node.js + Express REST API backend with relational MySQL database architecture, JobConnect enforces strict role-based access control, parameterized database queries, and a transparent 5-stage application tracking lifecycle.

---

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Architecture & Database Design](#architecture--database-design)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup](#installation--setup)
6. [Database Setup & Seeding](#database-setup--seeding)
7. [Environment Configuration](#environment-configuration)
8. [Running the Application](#running-the-application)
9. [Automated Testing](#automated-testing)
10. [REST API Documentation](#rest-api-documentation)
11. [Deployment Guide](#deployment-guide)
    - [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
    - [Backend Deployment (Node.js Host)](#backend-deployment-nodejs-host)
    - [Database Hosting (Managed MySQL)](#database-hosting-managed-mysql)
12. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## Features

### For Job Seekers
- **Candidate Registration & Secure Login**: Bcrypt-hashed password storage, JWT session management, input validation.
- **Dynamic Job Search & Filters**: Search by keyword, title, location, employment type (Full-time, Part-time, Internship, Contract, Freelance), work arrangement (Remote, Hybrid, On-site), experience level, and salary range.
- **Detailed Vacancy View**: Complete responsibilities, qualifications, tech stack tags, compensation, and employer details.
- **One-Click Application**: Optional cover letter, pre-filled resume from profile, duplicate application prevention, and deadline checking.
- **Application Tracking Dashboard**: Real-time progress badges (`APPLIED`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`).
- **Profile Management**: Maintain headline, skills tags, education, previous experience, portfolio URL, LinkedIn profile, and resume link.

### For Recruiters
- **Recruiter Registration & Employer Branding**: Create and manage company profile, logo, industry, size, and website.
- **Job Vacancy Management**: Create new postings, edit existing specs, toggle active/inactive status, and delete vacancies with confirmation dialogs.
- **Candidate Evaluation Board**: View all applicants for each job listing, inspect candidate education, experience, and resumes.
- **Recruitment Status Pipeline**: Transition candidate applications through the 5 stages with immediate database persistence and strict ownership authorization (recruiters cannot view or modify other recruiters' jobs).
- **Recruitment Metrics**: Real-time counter of total vacancies, active posts, applicant volume, shortlisted, and hired candidates.

### For Administrators
- **System Governance**: Moderation console with user account suspension/reactivation, vacancy activation/deactivation, and complete application audit log.
- **Platform Analytics**: Database-backed counts of active listings, registered job seekers, verified companies, and placements.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router v7, Axios, Lucide React icons |
| **Backend** | Node.js, Express.js, TypeScript / TSX, MySQL2, JSON Web Tokens (JWT), Bcryptjs, CORS, Dotenv |
| **Database** | MySQL (`jobconnect_db`), relational constraints, foreign keys, cascade deletes, composite unique keys, indexes |
| **Testing** | Node.js native test runner (`node:test`, `node:assert`), automated API and authorization suites |
| **Deployment** | Vercel (Frontend SPA), Node.js server (Render / Railway / Cloud Run / EC2), Managed MySQL (Cloud SQL / PlanetScale / AWS RDS) |

---

## Architecture & Database Design

The relational database `jobconnect_db` contains five tables:

```
+--------------------+        1:1       +--------------------+
|       users        |<-----------------|  seeker_profiles   |
+--------------------+                  +--------------------+
| id (PK)            |
| full_name          |        1:1       +--------------------+
| email (UNIQUE)     |<-----------------|     companies      |
| password_hash      |                  +--------------------+
| role               |                  | id (PK)            |
| phone              |                  | recruiter_id (FK)  |
| is_active          |                  +--------------------+
+--------------------+                            |
          | 1:N                                   | 1:N
          v                                       v
+--------------------+        1:N       +--------------------+
|    applications    |<-----------------|        jobs        |
+--------------------+                  +--------------------+
| id (PK)            |                  | id (PK)            |
| job_id (FK)        |                  | company_id (FK)    |
| applicant_id (FK)  |                  | recruiter_id (FK)  |
| resume_path        |                  | title              |
| cover_letter (opt) |                  | employment_type    |
| status             |                  | work_arrangement   |
| applied_at         |                  | salary_min/max     |
| UNIQUE(job, appl)  |                  | deadline, status   |
+--------------------+                  +--------------------+
```

### Table Relationships & Constraints
1. **`users`**: Stores user authentication credentials. Roles: `job_seeker`, `recruiter`, `admin`.
2. **`seeker_profiles`**: Linked 1:1 to `users(id)` via Foreign Key `user_id` with `ON DELETE CASCADE`.
3. **`companies`**: Linked 1:1 to `users(id)` via Foreign Key `recruiter_id` with `ON DELETE CASCADE`.
4. **`jobs`**: Foreign keys to `companies(id)` and `users(id)`. Indexed on `status`, `title`, `location`, `employment_type`.
5. **`applications`**: Foreign keys to `jobs(id)` and `users(id)`. Contains `UNIQUE KEY unique_job_applicant (job_id, applicant_id)` preventing duplicate applications.

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **bun** / **yarn**
- **MySQL Server** (optional for dev due to built-in local persistent relational engine fallback; required for production MySQL hosting)

---

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/jobconnect.git
   cd jobconnect
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

---

## Database Setup & Seeding

### 1. Import Schema
In your MySQL instance or GUI (MySQL Workbench, phpMyAdmin, DBeaver, or terminal):
```bash
mysql -u your_database_user -p < database/schema.sql
```

### 2. Import Demonstration Seed Data (Optional)
To populate demo companies, vacancies, candidate profiles, and applications:
```bash
mysql -u your_database_user -p < database/seed.sql
```

*Note: All seed accounts use the default password: `Password123!`*

| Role | Email | Password |
| :--- | :--- | :--- |
| **Job Seeker** | `seeker@jobconnect.com` | `Password123!` |
| **Recruiter** | `recruiter@techpulse.io` | `Password123!` |
| **Recruiter** | `marcus@cloudscale.net` | `Password123!` |
| **Administrator**| `admin@jobconnect.com` | `Password123!` |

---

## Environment Configuration

Edit `.env` with your deployment variables:

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Hosted or Local MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=jobconnect_db
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password

# Authentication Secrets
JWT_SECRET=replace_with_a_long_random_secret_before_running
JWT_EXPIRES_IN=1d
```

*Note: In development environments where an external MySQL host is not yet reachable, the backend automatically logs a notice and initializes the persistent relational database engine with identical schema, constraints, and seed data located in `./data/jobconnect_db.json`. Once MySQL credentials are provided, it connects to MySQL via connection pooling.*

---

## Vercel Deployment Note

This repository contains both a Vite frontend and an Express backend. Vercel's static Vite deployment builds and serves the frontend; it does **not** automatically run `server.ts` as an API server. Deploy the backend separately to a Node.js host and configure the frontend environment variable `VITE_API_BASE_URL` to the backend origin followed by `/api` (for example, `https://your-backend.example.com/api`). Also set the backend `CLIENT_URL` to the exact deployed frontend origin and configure the backend MySQL environment variables. The `vercel.json` rewrite is for React Router SPA paths; it is not a replacement for hosting the API.

For local development, keep `VITE_API_BASE_URL=/api`; the Express/Vite development server serves the API and frontend on the same origin.

## Running the Application

### Development Mode (Full-stack with Vite & Express)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## Automated Testing

Run the automated integration test suite validating authentication, job creation, search/filtering, duplicate application rejection, and recruiter authorization checks:

```bash
npm test
```

Test results output:
```text
ok 1 - GET /api/health should return 200 with healthy status
ok 2 - POST /api/auth/register should register a new job seeker
ok 3 - POST /api/auth/register should reject duplicate email
ok 4 - POST /api/auth/login should authenticate seed user and reject invalid password
ok 5 - GET /api/jobs should return paginated list of active jobs
ok 6 - GET /api/jobs with search query should filter by keywords
ok 7 - GET /api/dashboard/stats should return real database-backed platform metrics
ok 8 - Recruiter flow: create job, edit job, seeker apply, duplicate reject, update status
```

---

## REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create user (`job_seeker` or `recruiter`).
- `POST /api/auth/login` - Authenticate credentials and receive JWT.
- `POST /api/auth/logout` - Invalidate session.
- `GET  /api/auth/me` - Retrieve authenticated user session and role profile.

### Candidate Profile (`/api/profile`)
- `GET  /api/profile` - Get authenticated seeker profile.
- `PUT  /api/profile` - Update headline, skills, education, experience, portfolio, resume.
- `GET  /api/profile/:userId` - View applicant public profile (recruiter review).

### Companies (`/api/companies`)
- `GET  /api/companies` - List verified employers.
- `GET  /api/companies/:id` - Get company overview and active jobs.
- `GET  /api/companies/me/profile` - Get logged-in recruiter company profile.
- `POST /api/companies` - Create or update recruiter company profile.

### Jobs (`/api/jobs`)
- `GET    /api/jobs` - Search and filter jobs with pagination (`query`, `location`, `employment_type`, `work_arrangement`, `experience_level`, `min_salary`, `sort_by`, `page`, `limit`).
- `GET    /api/jobs/:id` - Detailed job specifications and applicant count.
- `GET    /api/jobs/recruiter/my` - Recruiter's own job listings.
- `POST   /api/jobs` - Post a new vacancy (Recruiter only).
- `PUT    /api/jobs/:id` - Edit job specs (Recruiter/Admin).
- `DELETE /api/jobs/:id` - Delete job listing (Recruiter/Admin).
- `PATCH  /api/jobs/:id/status` - Toggle `active`/`inactive` status.
- `GET    /api/jobs/:jobId/applications` - List applicants for job (Recruiter owner only).

### Applications (`/api/applications`)
- `POST  /api/applications` - Apply for vacancy (Job Seeker only).
- `GET   /api/applications/my` - View candidate submitted applications.
- `PATCH /api/applications/:id/status` - Transition application status (`APPLIED`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`).

### Dashboards & Admin
- `GET /api/dashboard/stats` - Public platform metrics.
- `GET /api/dashboard/seeker` - Candidate application stage counts.
- `GET /api/dashboard/recruiter` - Employer recruitment pipeline counts.
- `GET /api/admin/overview` - Administrator global metrics and tables.
- `PATCH /api/admin/users/:id/status` - Suspend or activate user accounts.
- `PATCH /api/admin/jobs/:id/status` - Deactivate or activate listings.

---

## Deployment Guide

### Frontend Deployment (Vercel)
The included `vercel.json` configures Vite SPA client routing:
1. Connect your GitHub repository to Vercel.
2. Select **Vite** preset.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. If deploying backend separately, set environment variable `VITE_API_URL` to point to your backend API.

### Backend Deployment (Node.js Host)
Deploy to Render, Railway, Google Cloud Run, AWS ECS, or DigitalOcean:
1. Set start command: `npm start`
2. Provide environment variables (`NODE_ENV=production`, `PORT=3000`, `JWT_SECRET=...`, `DB_HOST=...`, `DB_USER=...`, `DB_PASSWORD=...`, `DB_NAME=jobconnect_db`).
3. Set CORS origin in `CLIENT_URL` to your Vercel frontend URL.

### Database Hosting (Managed MySQL)
Provision a managed MySQL 8 instance on AWS RDS, PlanetScale, Google Cloud SQL, or Aiven:
1. Create database: `CREATE DATABASE jobconnect_db;`
2. Execute `database/schema.sql`.
3. Provide connection credentials to the backend via `.env`.

---

## Troubleshooting & FAQs

- **Q: Duplicate application error (409 Conflict)?**
  - *A:* JobConnect enforces a unique constraint (`unique_job_applicant`) on `(job_id, applicant_id)`. Each candidate can apply once per job listing.
- **Q: Recruiter cannot view another company's applicants?**
  - *A:* Access to applicant details is strictly validated against the authenticated recruiter's ID on the backend. Attempting to view or change another recruiter's candidates returns `403 Forbidden`.
- **Q: Why is cover letter optional?**
  - *A:* By recruitment design, cover letters are optional to reduce candidate drop-off while still allowing applicants to share an introduction if they choose.
