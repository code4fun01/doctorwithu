# DoctorWithU – Doctor Appointment Booking Platform

Full-stack doctor appointment booking application with **Patient**, **Doctor**, and **Admin** roles.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  

## Project Structure

```
doctorBooking/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── index.html
│   └── package.json
└── README.md
```

## Setup Instructions

### 1. Environment (Backend)

1. Go to `backend/` and copy `.env.example` to `.env` if you haven’t already.
2. Set in `backend/.env`:
   - `MONGO_URI` – your MongoDB connection URL (you’ll add this later).
   - `JWT_SECRET` – a strong secret for JWT (change in production).
   - `PORT` – optional; defaults to `5000`.

Example:

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/doctorwithu
JWT_SECRET=your_super_secret_jwt_key
```

### 2. Backend

```bash
cd backend
npm install
```

Then start the server:

```bash
npm run dev
```

Server runs at **http://localhost:5000**.

### 3. Seed Data (after setting MONGO_URI)

Create an admin user (optional; for first-time setup):

```bash
cd backend
npm run seed:admin
```

Default admin: `admin@doctorwithu.com` / `Admin@123` (override with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` in `.env`).

Seed doctors (40+ across 4 categories):

```bash
npm run seed
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:3000** and uses the backend via Vite proxy (`/api` → `http://localhost:5000`).

## Run Commands Summary

| Command        | Where   | Description              |
|----------------|---------|--------------------------|
| `npm install`  | backend | Install backend deps     |
| `npm install`  | frontend| Install frontend deps    |
| `npm run dev`  | backend | Start API (nodemon)      |
| `npm run dev`  | frontend| Start React app (Vite)   |
| `npm run seed` | backend | Seed doctors             |
| `npm run seed:admin` | backend | Create admin user |

## API Endpoints

### Auth
- `POST /api/auth/signup` – Register (patient)
- `POST /api/auth/login` – Login
- `POST /api/auth/verify-otp` – Verify OTP
- `POST /api/auth/resend-otp` – Resend OTP
- `GET /api/auth/me` – Current user (Bearer token)

### Doctors
- `GET /api/doctors` – List doctors (optional `?category=`)
- `GET /api/doctors/:id` – Doctor by ID
- `GET /api/doctors/me/profile` – Doctor profile (doctor only)
- `PATCH /api/doctors/me/availability` – Update availability (doctor only)
- `PATCH /api/doctors/me/consultation-fee` – Update fee (doctor only)

### Appointments
- `POST /api/appointments` – Book (patient only)
- `GET /api/appointments/my` – My appointments (patient only)
- `PATCH /api/appointments/:id/cancel` – Cancel (patient only)
- `GET /api/appointments/doctor/upcoming` – Upcoming (doctor only)

### Admin
- `GET /api/admin/users` – All users
- `GET /api/admin/appointments` – All appointments
- `POST /api/admin/doctors` – Add doctor
- `DELETE /api/admin/doctors/:id` – Delete doctor

## Features

- **Auth:** Signup, Login, OTP verification (simulated via console log), JWT, bcrypt.
- **Patient:** List/filter doctors, view profile, book/cancel appointments.
- **Doctor:** Upcoming appointments, manage availability and consultation fee.
- **Admin:** Add/delete doctors, view all users and appointments.
- **Doctor categories:** Cardiologist, Orthopaedic, ENT, General Physician (10+ doctors each, Indian names).
- **UI:** White + medical green theme; Navbar, Footer, Doctor Card, Appointment Card, Booking Modal; responsive.

## Default Logins (after seed)

- **Admin:** `admin@doctorwithu.com` / `Admin@123` (after `npm run seed:admin`).
- **Doctors:** Seeded doctors use email like `arjunmehta@doctorwithu.com` and password `Doctor@123` (see seed script for exact emails).

Add your MongoDB URL in `backend/.env` when ready to run the app end-to-end.
