# PostgreSQL Setup Guide for VELORA Store

## Prerequisites
- PostgreSQL installed on your system ([Download here](https://www.postgresql.org/download/))
- psycopg2-binary installed (already in requirements.txt)

## Local Development Setup

### Step 1: Create PostgreSQL Database

Open **PostgreSQL command line** (`psql`) or use **pgAdmin**:

```sql
CREATE DATABASE velora_store;
```

### Step 2: Update `.env` File

Edit the `.env` file with your PostgreSQL credentials:

```env
SECRET_KEY=your-super-secret-key-here-change-this-in-production
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/velora_store
FLASK_DEBUG=1
```

Replace:
- `YOUR_PASSWORD` with your actual postgres user password
- `localhost` if using a remote server
- `5432` if using a different port

### Step 3: Initialize Database

Run the initialization script to create tables and seed data:

```bash
python init_db.py
```

You should see:
```
Database initialized successfully.
```

### Step 4: Run the App

```bash
python app.py
```

Visit `http://localhost:5000` and login with:
- **Username:** admin
- **Password:** VeloraAdmin2026!@#Secure

---

## Production Deployment (Render)

### Step 1: Create PostgreSQL on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Name: `velora-db`
4. Region: Same as Web Service
5. Database: `velora_store` (created automatically)
6. Wait until status is **Available**

### Step 2: Add Environment Variable to Web Service

1. Go to your Web Service settings
2. Click **Environment** tab
3. Add this variable:
   - Key: `DATABASE_URL`
   - Value: Copy the **Internal Database URL** from your PostgreSQL service

### Step 3: Initialize Database on Render

1. In your Web Service dashboard, go to **Shell**
2. Run:
   ```bash
   python init_db.py
   ```
3. You should see: `Database initialized successfully.`

### Step 4: Redeploy

Click **Manual Deploy** to restart with the new database connection.

---

## Useful PostgreSQL Commands

```sql
-- Connect to specific database
\c velora_store

-- List all tables
\dt

-- View table structure
\d users

-- Drop database (careful!)
DROP DATABASE velora_store;

-- Exit
\q
```

---

## Troubleshooting

### "could not connect to server"
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure `localhost:5432` is accessible

### "database does not exist"
- Run: `CREATE DATABASE velora_store;` in psql

### "psycopg2 not found"
- Run: `pip install psycopg2-binary`

### "permission denied for schema public"
- Run in psql as postgres:
  ```sql
  ALTER DATABASE velora_store OWNER TO postgres;
  ```

---

## Switching Back to SQLite (if needed)

Update `.env`:
```env
DATABASE_URL=sqlite:///database.db
```

Then run `python init_db.py` again.
