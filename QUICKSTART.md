# Quick Start Guide

Get Daily Open Court up and running in minutes!

## Choose Your Deployment Method

### 1. Docker (Fastest - Recommended for Testing)

```bash
# Clone the repository
git clone https://github.com/AsadUllah-11/UpdatedDailyOpenCourt.git
cd UpdatedDailyOpenCourt

# Start with Docker Compose
docker-compose up --build

# In a new terminal, create admin user
docker-compose exec backend python manage.py createsuperuser
```

**Done!** Visit http://localhost for the app and http://localhost:8000/admin for admin panel.

---

### 2. Local Development (Best for Development)

#### Prerequisites
- Python 3.8+
- Node.js 18+
- Git

#### One-Command Setup
```bash
git clone https://github.com/AsadUllah-11/UpdatedDailyOpenCourt.git
cd UpdatedDailyOpenCourt
chmod +x setup-local.sh
./setup-local.sh
```

Then start the servers:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Visit http://localhost:3000

---

### 3. Cloud Deployment (Production-Ready)

#### Option A: Heroku (Free Tier Available)

**Backend:**
```bash
cd backend
heroku login
heroku create your-app-backend
heroku addons:create heroku-postgresql:mini
git subtree push --prefix backend heroku main
heroku run python manage.py createsuperuser
```

**Frontend:** Deploy to Vercel
```bash
cd frontend
npm install -g vercel
vercel --prod
```

#### Option B: Railway (Easiest Cloud)

```bash
npm install -g @railway/cli
railway login

# Backend
cd backend
railway init
railway add postgresql
railway up

# Frontend  
cd frontend
railway init
railway up
```

#### Option C: Render (All-in-One)

1. Push your code to GitHub
2. Go to https://render.com
3. Create New -> Web Service
4. Connect your repository
5. Follow platform-specific instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)

---

### 4. Production Server (Ubuntu/Debian)

```bash
# On your server
git clone https://github.com/AsadUllah-11/UpdatedDailyOpenCourt.git
cd UpdatedDailyOpenCourt
chmod +x deploy.sh
sudo ./deploy.sh
```

The script will:
- Install all dependencies
- Setup PostgreSQL database
- Configure Django backend
- Build React frontend
- Setup Nginx
- Configure SSL (optional)

---

## Environment Configuration

### Backend (.env)
Copy `.env.example` and configure:

```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
DB_ENGINE=django.db.backends.postgresql
DB_NAME=dailyopencourt
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com
```

---

## Common Commands

### Django Backend
```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run tests
python manage.py test

# Start development server
python manage.py runserver
```

### React Frontend
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Docker
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build
```

---

## Troubleshooting

### Port Already in Use
```bash
# Backend (port 8000)
lsof -ti:8000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Database Issues
```bash
# Reset database (development only!)
rm backend/db.sqlite3
python backend/manage.py migrate
python backend/manage.py createsuperuser
```

### Permission Denied (Linux/Mac)
```bash
chmod +x setup-local.sh
chmod +x deploy.sh
```

### Module Not Found
```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. **Read the full deployment guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Configure your environment:** Copy `.env.example` to `.env`
3. **Customize settings:** Update Django settings and React config
4. **Add your data:** Use the admin panel to add initial data
5. **Setup CI/CD:** Configure GitHub Actions for automated deployment

---

## Getting Help

- **Documentation:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides
- **Issues:** [GitHub Issues](https://github.com/AsadUllah-11/UpdatedDailyOpenCourt/issues)
- **README:** [Main README](./README.md)

---

**Happy Deploying! 🚀**
