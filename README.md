# HotelPro - Hotel Management & Booking System

A lightweight MERN-stack hotel management and room reservation system featuring role-based access control, real-time availability and date overlap validation, booking lifecycle tracking, and administrative inventory management.

---

## Tech Stack

- **Frontend**: React (Vite), React Router DOM (v6), Axios, Bootstrap 5
- **State & Auth**: React Context API (`AuthContext`), LocalStorage, JWT Bearer Token
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security & Utilities**: bcryptjs, dotenv, cors, nodemon

---

## Features by Role

- **Public / Unauthenticated**:
  - Browse all rooms with category filter (`Standard`, `Deluxe`, `Suite`).
  - Choose stay dates with stay duration calculation.
  - Sign in or create a new account.

- **Guest**:
  - Book rooms with automatic date-overlap conflict validation.
  - View personal bookings under **My Bookings**.
  - Mock payment checkout (marks reservation as paid).
  - Cancel active reservations.

- **Staff**:
  - View all guest bookings across the hotel.
  - Check-in guests upon arrival (updates room status to occupied).
  - Check-out departing guests (releases room back to available).

- **Admin**:
  - Full staff privileges (manage bookings, check-in, check-out).
  - Dedicated **Admin Panel** to create new rooms and view live inventory.

---

## Setup & Running the Project

### Prerequisites
- Node.js (v18+)
- MongoDB running on `mongodb://127.0.0.1:27017`

### 1. Install Dependencies
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 2. Seed Database
Seeds 3 sample users (Admin, Staff, Guest) and 6 rooms:
```bash
cd server
node seed.js
```

### 3. Start Backend Server
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### 4. Start Frontend Client
```bash
cd client
npm run dev
# Client runs on http://localhost:3000
```

---

## Demo Logins

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@hotelpro.com` | `admin123` |
| **Staff** | `staff@hotelpro.com` | `staff123` |
| **Guest** | `guest@hotelpro.com` | `guest123` |

---

## Future Scope

- **Real Payments**: Integrate Stripe, PayPal, or Razorpay for secure card and digital payments.
- **Email Notifications**: Automated booking confirmations, check-in reminders, and payment receipts via Nodemailer/SendGrid.
- **Image Uploads**: Room photo galleries with cloud storage support (Cloudinary or AWS S3).
- **Reports & Analytics**: Admin dashboard with revenue metrics, occupancy rates, and exportable monthly reports.
