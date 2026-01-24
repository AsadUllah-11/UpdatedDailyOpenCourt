# Installation Guide

## Quick Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- Git

### One-Command Setup (Recommended)

```bash
# Clone and setup everything
git clone https://github.com/AsadUllah-11/UpdatedDailyOpenCourt.git
cd UpdatedDailyOpenCourt
chmod +x setup-local.sh
./setup-local.sh
```

### Manual Installation

#### 1. Install Backend (Python/Django)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

Backend will run at: http://localhost:8000

#### 2. Install Frontend (React)

Open a **new terminal** window:

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start frontend development server
npm start
```

Frontend will run at: http://localhost:3000

### What Gets Installed

#### Backend Dependencies (Python)
- Django 4.2+
- Django REST Framework
- JWT Authentication
- CORS Headers
- PostgreSQL adapter
- Gunicorn (production server)
- WhiteNoise (static files)
- Pandas & OpenPyXL (Excel handling)

See `backend/requirements.txt` for complete list.

#### Frontend Dependencies (Node.js)
- React 19+
- React Router
- Axios (HTTP client)
- Recharts (charts)
- React Icons
- XLSX (Excel handling)

See `frontend/package.json` for complete list.

## Alternative: Docker Installation

If you have Docker installed, you can run everything with one command:

```bash
docker-compose up --build
```

This will:
- Install all dependencies automatically
- Set up PostgreSQL database
- Start backend and frontend
- Make the app available at http://localhost

## Troubleshooting

### "Command not found" errors
- Make sure Python 3.8+ is installed: `python --version`
- Make sure Node.js 18+ is installed: `node --version`
- On some systems, use `python3` instead of `python`

### "Permission denied" on setup script
```bash
chmod +x setup-local.sh
./setup-local.sh
```

### "Port already in use"
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Virtual environment issues
```bash
# Delete and recreate
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Node modules issues
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Verify Installation

After installation, verify everything works:

1. **Backend**: Visit http://localhost:8000/admin
2. **Frontend**: Visit http://localhost:3000
3. **API**: Visit http://localhost:8000/api/

## Next Steps

After installation:
1. Read [README.md](./README.md) for project overview
2. Check [START_HERE.md](./START_HERE.md) for deployment options
3. Review [CONTRIBUTING.md](./CONTRIBUTING.md) if you want to contribute

## Need Help?

- Check [QUICKSTART.md](./QUICKSTART.md) for more options
- Open an issue: https://github.com/AsadUllah-11/UpdatedDailyOpenCourt/issues
