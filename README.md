# DARSHI TECH - Internship & Placement Hub

DARSHI TECH is a brand new, secure, and modern educational and internship platform. It connects students to research programs, product designs, full-stack tracks, live classes, attendance checking, and digital certificates equipped with verified QR codes.

---

## 🚀 Tech Stack

### Frontend
- **React.js** (Vite build system)
- **Tailwind CSS** (Custom theme configurations, modern typography, glassmorphism UI)
- **React Router v6** (Layout routing, role protectors)
- **Lucide Icons** (UI vector indicators)

### Backend
- **Node.js** & **Express.js** (ES Modules structured)
- **Prisma ORM** (Database clients management)
- **SQLite** (Default local DB) / **PostgreSQL** (Supported)
- **JWT** (JSON Web Tokens authentication state)
- **Bcrypt.js** (Secure password hashing - 12 rounds)
- **PDFKit** (On-the-fly certificate PDF creation)
- **QRCode** (Dynamic QR generation for scan validation)

---

## 🔒 Security Architectures
DARSHI TECH incorporates multiple defensive layers to stay safe from external attacks:
- **SQL Injection Prevention**: Prisma ORM uses parameterized queries automatically, neutralising SQL injection attempts.
- **XSS (Cross-Site Scripting) Filters**: Standard Helmet security headers are mounted, alongside regex input sanitization stripping `<script>` blocks, inline javascript events, and `javascript:` URIs from request payloads.
- **Brute Force Protection**: IP-based rate limiting restricts authentication attempts (login, registration, password requests) to a maximum of 20 requests per 15 minutes.
- **Access Control Headers**: Dynamic CORS whitelisting controls API cross-origin permissions.

---

## 📁 Directory Structure
```text
darshi-tech/
├── README.md
├── backend/
│   ├── dev.db              # SQLite Database file (generated)
│   ├── prisma/
│   │   └── schema.prisma   # Database schema layouts
│   ├── src/
│   │   ├── server.js       # App entry & database seedings
│   │   ├── routes/         # Auth, Courses, Enrollments, Classes, Admin endpoints
│   │   ├── middleware/     # Rate limiter, Security, Auth filters
│   │   └── utils/          # PDF & QR helpers
│   ├── .env                # Secrets configuration
│   └── package.json
└── frontend/
    ├── index.html
    ├── vite.config.js      # Proxies API to backend
    ├── tailwind.config.js  # Styling themes
    ├── src/
    │   ├── main.jsx
    │   ├── index.css
    │   ├── App.jsx         # Routing & Auth state
    │   ├── components/     # ProtectedRoute, Left Collapsible Sidebar
    │   ├── pages/          # Catalog sections, Auth modules, Dashboards
    │   └── utils/
    │       └── api.js      # Centralized fetch client
    └── package.json
```

---

## 🛠 Setup & Running Instructions

### 1. Prerequisite Checklist
- **Node.js** (v18.0.0 or higher recommended)
- **NPM** (v9.0.0 or higher)

### 2. Backend Setup
1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database schema and client:
   ```bash
   npx prisma db push
   ```
   *(This syncs your SQLite `dev.db` database and generates the local Prisma Client).*
4. Start the backend developer server:
   ```bash
   npm run dev
   ```
   *(The server runs on **http://localhost:5000**).*

### 3. Frontend Setup
1. Open a terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *(The app will start on **http://localhost:5173**).*

---

## 🔑 Sandbox Testing & Seed Data

On initial startup, the backend automatically seeds default database values for convenient testing:

### 1. Default Admin Credentials
- **Email**: `admin@darshitech.com`
- **Password**: `AdminPassword123`
*(Allows full access to the Admin Dashboard: creating courses, scheduling live classes, issuing certificates, and checking attendanceSheets).*

### 2. Default Course Catalogs
12 courses spanning Research, Full-Stack, Product Dev, Web Dev, Workshops, and placement training are automatically seeded.

### 3. Student Flow Walkthrough
1. Go to the Registration Page, fill out credentials, and click submit.
2. The UI will show a **Sandbox Assist** panel containing your generated verification OTP.
3. Click "Auto-fill verification code" and click Verify.
4. Log in. You will land on the **Student Portal**.
5. Select a category in the sidebar (e.g., Research Projects).
6. Click **Enroll Now** on any course. A simulated Razorpay modal opens.
7. Click **Complete Mock Payment**.
8. Go to the **Student Portal** -> You will see your active enrollment.
9. Go to **Live Class Schedule** -> click **Join Live Class**. Tapping marks you *Present* in the database and opens the Meet mock link.
10. Log out, sign in as `admin@darshitech.com` / `AdminPassword123`.
11. Go to **Classes** -> click **Check Sheet** next to the live class to verify the student was marked Present. You can also toggle attendance there.
12. Go to **Enrollments** -> click **Mark Complete** to issue their completion certificate.
13. Log back in as the student.
14. Under **My Courses & Certificates**, the student will now have a **Download Certificate** button.
15. Download the PDF certificate. The PDF features a dynamic QR code pointing to `/verify-certificate/:certId`. Scan or click verify to view verification details.
