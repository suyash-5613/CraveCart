# 🚀 CraveCart Full-Stack Deployment Guide

Deploying a MERN stack application requires splitting the frontend and backend onto different specialized hosting services. 

Here is the easiest, completely **free** way to get CraveCart live on the internet so that anyone can use it on their phone or computer!

---

## Step 1: Set up the Database (MongoDB Atlas)
By default, the app uses a local database on your computer. To make it work online, we need a cloud database.
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create an account.
2. Build a new free "M0 Sandbox" cluster.
3. Under "Network Access" on the left, click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`).
4. Click **Connect** -> **Drivers** -> **Node.js**.
5. Copy your unique `MONGO_URI` connection string.
   *(It looks like: `mongodb+srv://<username>:<password>@cluster0.../cravecart`)*
6. **Important:** Remember to swap `<password>` with your actual database password that you created.

---

## Step 2: Deploy the Backend (Render)
Render is an excellent free service to permanently host your Node.js/Express backend server.
1. Go to [Render.com](https://render.com/) and sign in with GitHub.
2. Click **New +** and select **Web Service**.
3. Connect your `CraveCart` GitHub repository.
4. Fill in the following specific settings:
   - **Name:** `cravecart-api` (or whatever you prefer)
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Scroll down to the **Environment Variables** section and add these four keys:
   - `PORT` = `5000`
   - `MONGO_URI` = *(Paste the full Atlas URI string from Step 1)*
   - `JWT_SECRET` = `cravecart_super_secret_key_2024`
   - `JWT_EXPIRE` = `7d`
6. Click **Create Web Service**. 
7. Wait a few minutes for the deployment process to finish. Render will give you a live public URL (e.g., `https://cravecart-api.onrender.com`).
   **Copy this green URL!** You will need it for the frontend.

---

## Step 3: Deploy the Frontend (Vercel)
Vercel is the fastest and best way to host a React (Vite) frontend application.
1. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
2. Click **Add New** -> **Project**.
3. Import your `CraveCart` GitHub repository.
4. In the configuration page, find the **Root Directory** setting, click `Edit`, and select the `client` folder.
5. Vercel should automatically detect that it's a **Vite** project.
6. Open the **Environment Variables** dropdown and add this exact key:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-render-app-url.onrender.com/api` *(Paste your Render URL here, and make sure to add `/api` to the end! Do not include a trailing slash)*
7. Click **Deploy**.

---

## 🎉 You're Done!
Once Vercel finishes deploying (usually takes under a minute), they will give you a beautiful, live public URL. Click it, and you will see your fully functioning CraveCart platform live on the internet! Enjoy your new full-stack application! 🍔
