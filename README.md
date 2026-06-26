# 🍔 CraveCart

A modern, full-stack food delivery web application built using the MERN stack (MongoDB, Express, React, Node.js). 

Unlike typical food delivery apps, CraveCart features a unique **"Warm Neon & Glass"** design aesthetic to give it a premium, visually stunning first impression. It provides dedicated experiences for three distinct roles: Customers, Restaurants, and Administrators.

---

## ✨ Key Features

- **🍔 Customer Portal:** Browse local restaurants, securely add items to the cart, place orders, and view live order statuses.
- **🏪 Restaurant Portal:** Dedicated dashboards for restaurant owners to manage their dynamic menus, accept/reject incoming orders, and manually update order progress.
- **🔒 Admin Dashboard:** An oversight console to manage platform users, approve new restaurant listings, and monitor platform health.
- **🎨 Premium UI/UX:** Built with a stunning "Warm Neon & Glass" design highlighting modern glassmorphism and vibrant accent colors.
- **🔐 Secure Authentication:** JWT-based secure login and registration separating logical roles natively.
- **📱 Fully Responsive:** Carefully constructed layouts ensuring seamless use across desktop and mobile devices.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Context API (State Management)
- CSS (Custom "Warm Neon & Glass" Aesthetic)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### 1. Prerequisites
- **Node.js** (v16+ recommended)
- **MongoDB** (Running locally on your machine or via a cloud Atlas URI)

### 2. Backend Setup
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add the following configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/cravecart
   JWT_SECRET=cravecart_super_secret_key_2024
   JWT_EXPIRE=7d
   DEFAULT_ADMIN_EMAIL=admin@cravecart.com
   DEFAULT_ADMIN_PASSWORD=admin123
   DEFAULT_ADMIN_NAME=Admin
   DEFAULT_ADMIN_PHONE=9999999999
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server should now be running on `http://localhost:5000`.*

   On startup, the backend ensures a default admin account exists. You can log in with:
   - Email: `admin@cravecart.com`
   - Password: `admin123`

   If you want different credentials, update the `DEFAULT_ADMIN_*` values in `.env`.

### 3. Frontend Setup
1. Open a **new** terminal window and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL provided by Vite (typically `http://localhost:5173`).

---

## 📂 Architecture & Project Structure

The project is built as a monorepo containing both the frontend and backend applications in order to keep development streamlined.

```plaintext
CraveCart/
├── client/           # React frontend application
│   ├── src/          # Source code
│   │   ├── pages/    # Role-based pages (customer, admin, restaurant)
│   │   ├── contexts/ # Global state (Auth, Cart, etc.)
│   │   └── ...
├── server/           # Node.js backend API
│   ├── controllers/  # Route logic and database interaction
│   ├── models/       # Mongoose database schemas
│   ├── routes/       # Express route definitions
│   └── server.js     # Entry point for the backend
├── .gitignore        # Ignored files for git tracking
└── README.md         # Documentation
```
