# Agorá Tenders 🏛️

**Agorá Tenders** is a modern marketplace for Indian public tenders, focused initially on **GeM (Government e‑Marketplace)** bids.

The platform supports **role‑based access**, manual tender uploads, PDF document hosting, and secure comparisons for registered users.

---

## 🚀 Features (Current – Phase 2 Complete)

### 🔐 Authentication & Roles
- JWT‑based authentication
- Roles:
  - **ADMIN** – Super admin (bulk uploads, full control)
  - **SELLER** – Upload and manage own bids
  - **VIEWER** – Browse and compare bids (read‑only)

---

### 👨‍💼 Admin Dashboard
- View platform statistics:
  - Total users
  - Total bids
  - Active bids
- Bulk upload bids via **Excel**
- Upload tender PDFs per bid
- View all bids in the system

---

### 🧑‍💼 Seller Dashboard
- Create individual GeM bids
- View own uploaded bids
- Attach bid metadata (Bid No, RA No, dates, department, state, etc.)

---

### 🎨 UI & UX
- Modern card‑based UI
- Dark / Light mode toggle
- Montserrat + Cormorant typography
- Responsive layout
- Single login & registration flow

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- React Router
- Context API (Auth & Theme)
- Fetch API / Axios
- CSS Variables (Dark / Light Mode)

### Backend
- Node.js + Express
- SQLite (better‑sqlite3)
- JWT Authentication
- Multer (file uploads)
- XLSX (Excel parsing)

---

## 📂 Folder Structure

