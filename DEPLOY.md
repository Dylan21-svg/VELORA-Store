# Deploying VELORA Store to Render

This guide explains how to deploy your Flask application to Render.com, a free and easy-to-use cloud platform.

## Prerequisites
1.  A [GitHub](https://github.com/) account.
2.  A [Render](https://render.com/) account.
3.  Your code pushed to a GitHub repository.

## Step 1: Push Code to GitHub
Since you have initialized Git locally, you need to push it to GitHub:
1.  Create a **new repository** on GitHub (do not add README/gitignore, creating an empty one).
2.  Run the commands shown by GitHub to push your existing repository:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Create a Web Service on Render
1.  Log in to the [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account and select your `VELORA-Store` repository.
4.  Configure the service:
    - **Name**: `velora-store` (or your choice)
    - **Region**: Choose the one closest to you (e.g., Frankfurt, Oregon).
    - **Branch**: `main`
    - **Runtime**: `Python 3`
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `gunicorn app:app` (This is already in your `Procfile`, so Render might detect it automatically).
    - **Instance Type**: **Free**

## Step 3: Configure Environment Variables
Scroll down to the **Environment Variables** section and add the following keys. **Do not skip this step.**

| Key | Value | Note |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.10.12` | Matches your `runtime.txt`. |
| `SECRET_KEY` | `your-super-secret-key-here` | Generate a random string. |
| `DATABASE_URL` | `postgresql://...` | **See Database Step below** |
| `FLASK_DEBUG` | `0` | strictly `0` for production. |

### Database Setup (PostgreSQL)
Since SQLite (files like `database.db`) is not persistent on Render's free tier (it gets deleted every restart), you should use a managed PostgreSQL database.

1.  Open a new tab in Render Dashboard.
2.  Click **New +** -> **PostgreSQL**.
3.  Name it `velora-db`, choose the **Free** plan.
4.  Create it. Wait for it to become "Available".
5.  Copy the **Internal Database URL** (looks like `postgres://velora_user:...@dpg-...`).
6.  Go back to your Web Service -> **Environment Variables**.
7.  Add the key `DATABASE_URL` and paste the internal URL.

## Step 4: Deploy
1.  Click **Create Web Service**.
2.  Render will start building your app. Watch the logs.
3.  Once the build finishes, you will see a green "Live" badge.
4.  Click the URL (e.g., `https://velora-store.onrender.com`) to visit your site.

## Step 5: Initialize Database
On the first deployment, your database is empty. You need to create tables.
1.  In the Render Dashboard for your Web Service, go to the **Shell** tab (runs a command in the live container).
2.  Run:
    ```bash
    python init_db.py
    ```
3.  You should see "Database initialized successfully."

## Troubleshooting
- **Build Failed**: Check the logs for missing dependencies.
- **Internal Server Error**: Check logs. Probably missing `DATABASE_URL` or `SECRET_KEY`.
