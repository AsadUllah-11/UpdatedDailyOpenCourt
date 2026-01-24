# Deployment Guide for Daily Open Court Application

This guide provides comprehensive instructions for deploying the Daily Open Court application, which consists of a Django REST Framework backend and a React frontend.

## Table of Contents
1. [Quick Start with Docker](#quick-start-with-docker)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
   - [Heroku](#deploy-to-heroku)
   - [Railway](#deploy-to-railway)
   - [Render](#deploy-to-render)
   - [DigitalOcean App Platform](#deploy-to-digitalocean)
   - [AWS (EC2)](#deploy-to-aws-ec2)
   - [Vercel (Frontend) + Railway (Backend)](#vercel--railway)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start with Docker

The easiest way to deploy the entire application is using Docker Compose.

### Prerequisites
- Docker and Docker Compose installed
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/AsadUllah-11/UpdatedDailyOpenCourt.git
   cd UpdatedDailyOpenCourt
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

4. **Create a superuser (in a new terminal)**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

5. **Stop the application**
   ```bash
   docker-compose down
   ```

---

## Local Development Setup

### Backend Setup (Django)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at http://localhost:8000

### Frontend Setup (React)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   Frontend will be available at http://localhost:3000

---

## Production Deployment

### Deploy to Heroku

#### Backend Deployment

1. **Create a Heroku account** at https://heroku.com

2. **Install Heroku CLI** and login
   ```bash
   heroku login
   ```

3. **Create a new Heroku app for backend**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

4. **Add PostgreSQL addon**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Create a Procfile** in the backend directory:
   ```
   web: gunicorn backend.wsgi --log-file -
   release: python manage.py migrate
   ```

6. **Set environment variables**
   ```bash
   heroku config:set SECRET_KEY="your-secret-key"
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS="your-app-name-backend.herokuapp.com"
   heroku config:set CORS_ALLOWED_ORIGINS="https://your-frontend-domain.com"
   ```

7. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   # OR if using main branch
   git push heroku main
   ```

8. **Create superuser**
   ```bash
   heroku run python manage.py createsuperuser
   ```

#### Frontend Deployment

1. **Update API URL** in frontend
   Create a `.env.production` file in frontend directory:
   ```
   REACT_APP_API_URL=https://your-app-name-backend.herokuapp.com
   ```

2. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy to Netlify, Vercel, or Heroku**
   
   **Option A: Netlify**
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Deploy: `netlify deploy --prod --dir=build`
   
   **Option B: Vercel**
   - Install Vercel CLI: `npm install -g vercel`
   - Deploy: `vercel --prod`

---

### Deploy to Railway

Railway offers a simple deployment process for both frontend and backend.

1. **Create a Railway account** at https://railway.app

2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

3. **Login to Railway**
   ```bash
   railway login
   ```

#### Backend Deployment on Railway

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Initialize Railway project**
   ```bash
   railway init
   ```

3. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

4. **Set environment variables**
   ```bash
   railway variables set SECRET_KEY="your-secret-key"
   railway variables set DEBUG=False
   railway variables set ALLOWED_HOSTS="${{RAILWAY_PUBLIC_DOMAIN}}"
   railway variables set CORS_ALLOWED_ORIGINS="https://your-frontend-domain.com"
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Run migrations**
   ```bash
   railway run python manage.py migrate
   railway run python manage.py createsuperuser
   ```

---

### Deploy to Render

1. **Create a Render account** at https://render.com

#### Backend Deployment

1. **Create a new Web Service** on Render dashboard

2. **Connect your GitHub repository**

3. **Configure the service:**
   - Name: `dailyopencourt-backend`
   - Environment: `Python 3`
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && gunicorn backend.wsgi:application`
   - Add PostgreSQL database

4. **Set environment variables** in Render dashboard:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-app.onrender.com
   DATABASE_URL=postgresql://... (auto-generated)
   CORS_ALLOWED_ORIGINS=https://your-frontend.com
   ```

5. **Deploy** - Render will automatically deploy when you push to GitHub

#### Frontend Deployment

1. **Create a new Static Site** on Render

2. **Configure:**
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

3. **Add environment variable:**
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```

---

### Deploy to DigitalOcean

#### Using DigitalOcean App Platform

1. **Create a DigitalOcean account** at https://digitalocean.com

2. **Create a new App** from the dashboard

3. **Connect your GitHub repository**

4. **Configure Components:**

   **Backend Component:**
   - Type: Web Service
   - Source Directory: `/backend`
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `gunicorn --worker-tmp-dir /dev/shm backend.wsgi`
   - HTTP Port: 8000

   **Frontend Component:**
   - Type: Static Site
   - Source Directory: `/frontend`
   - Build Command: `npm install && npm run build`
   - Output Directory: `build`

5. **Add a PostgreSQL Database**

6. **Set environment variables** for backend:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=False
   DATABASE_URL=${db.DATABASE_URL}
   ALLOWED_HOSTS=${APP_DOMAIN}
   CORS_ALLOWED_ORIGINS=https://${frontend.PUBLIC_URL}
   ```

7. **Deploy** - Click "Create Resources"

---

### Deploy to AWS (EC2)

#### Prerequisites
- AWS Account
- EC2 instance running Ubuntu 20.04 or later
- Security group allowing HTTP (80), HTTPS (443), and SSH (22)

#### Setup Steps

1. **SSH into your EC2 instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **Update system and install dependencies**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install python3-pip python3-venv nginx postgresql postgresql-contrib -y
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install nodejs -y
   ```

3. **Clone the repository**
   ```bash
   cd /var/www
   sudo git clone https://github.com/AsadUllah-11/UpdatedDailyOpenCourt.git
   cd UpdatedDailyOpenCourt
   sudo chown -R $USER:$USER /var/www/UpdatedDailyOpenCourt
   ```

4. **Setup PostgreSQL**
   ```bash
   sudo -u postgres psql
   ```
   In PostgreSQL:
   ```sql
   CREATE DATABASE dailyopencourt;
   CREATE USER dailyuser WITH PASSWORD 'your-password';
   ALTER ROLE dailyuser SET client_encoding TO 'utf8';
   ALTER ROLE dailyuser SET default_transaction_isolation TO 'read committed';
   ALTER ROLE dailyuser SET timezone TO 'UTC';
   GRANT ALL PRIVILEGES ON DATABASE dailyopencourt TO dailyuser;
   \q
   ```

5. **Setup Backend**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Create .env file
   cat > .env << EOF
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com,your-ec2-ip
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=dailyopencourt
   DB_USER=dailyuser
   DB_PASSWORD=your-password
   DB_HOST=localhost
   DB_PORT=5432
   CORS_ALLOWED_ORIGINS=https://your-domain.com
   EOF
   
   python manage.py migrate
   python manage.py collectstatic --noinput
   python manage.py createsuperuser
   ```

6. **Setup Gunicorn systemd service**
   ```bash
   sudo nano /etc/systemd/system/gunicorn.service
   ```
   
   Add:
   ```ini
   [Unit]
   Description=gunicorn daemon
   After=network.target

   [Service]
   User=ubuntu
   Group=www-data
   WorkingDirectory=/var/www/UpdatedDailyOpenCourt/backend
   Environment="PATH=/var/www/UpdatedDailyOpenCourt/backend/venv/bin"
   ExecStart=/var/www/UpdatedDailyOpenCourt/backend/venv/bin/gunicorn --workers 3 --bind unix:/var/www/UpdatedDailyOpenCourt/backend/backend.sock backend.wsgi:application

   [Install]
   WantedBy=multi-user.target
   ```
   
   Enable and start:
   ```bash
   sudo systemctl start gunicorn
   sudo systemctl enable gunicorn
   ```

7. **Setup Frontend**
   ```bash
   cd /var/www/UpdatedDailyOpenCourt/frontend
   
   # Create .env.production
   echo "REACT_APP_API_URL=https://your-domain.com/api" > .env.production
   
   npm install
   npm run build
   ```

8. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/dailyopencourt
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       location / {
           root /var/www/UpdatedDailyOpenCourt/frontend/build;
           try_files $uri /index.html;
       }

       # Backend API
       location /api/ {
           include proxy_params;
           proxy_pass http://unix:/var/www/UpdatedDailyOpenCourt/backend/backend.sock;
       }

       # Backend Static Files
       location /static/ {
           alias /var/www/UpdatedDailyOpenCourt/backend/staticfiles/;
       }

       # Backend Media Files
       location /media/ {
           alias /var/www/UpdatedDailyOpenCourt/backend/media/;
       }
   }
   ```
   
   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/dailyopencourt /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL with Let's Encrypt (Optional but recommended)**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

---

### Vercel + Railway

This is a popular combination: Vercel for frontend, Railway for backend.

#### Backend on Railway
Follow the [Railway instructions above](#backend-deployment-on-railway)

#### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend**
   ```bash
   cd frontend
   ```

3. **Create `.env.production`**
   ```
   REACT_APP_API_URL=https://your-backend.up.railway.app
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

   Or connect your GitHub repo directly on Vercel dashboard.

---

## Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | `your-secret-key-here` |
| `DEBUG` | Debug mode | `False` |
| `ALLOWED_HOSTS` | Allowed hosts | `yourdomain.com,*.herokuapp.com` |
| `DB_ENGINE` | Database engine | `django.db.backends.postgresql` |
| `DB_NAME` | Database name | `dailyopencourt` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `your-password` |
| `DB_HOST` | Database host | `localhost` or cloud DB host |
| `DB_PORT` | Database port | `5432` |
| `CORS_ALLOWED_ORIGINS` | CORS allowed origins | `https://yourdomain.com` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://api.yourdomain.com` |

---

## Database Setup

### SQLite (Development Only)
SQLite is configured by default for development. The database file is `backend/db.sqlite3`.

### PostgreSQL (Production)

1. **Create database and user**
   ```sql
   CREATE DATABASE dailyopencourt;
   CREATE USER dailyuser WITH PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE dailyopencourt TO dailyuser;
   ```

2. **Set environment variables**
   ```bash
   export DB_ENGINE=django.db.backends.postgresql
   export DB_NAME=dailyopencourt
   export DB_USER=dailyuser
   export DB_PASSWORD=your-password
   export DB_HOST=localhost
   export DB_PORT=5432
   ```

3. **Run migrations**
   ```bash
   python manage.py migrate
   ```

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
- Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Check that `corsheaders` is in `INSTALLED_APPS`
- Verify `CorsMiddleware` is in `MIDDLEWARE`

#### 2. Static Files Not Loading
- Run `python manage.py collectstatic`
- Check `STATIC_ROOT` and `STATIC_URL` settings
- Ensure WhiteNoise is configured

#### 3. Database Connection Errors
- Verify database credentials
- Check database host is accessible
- Ensure PostgreSQL is running

#### 4. Frontend Can't Connect to Backend
- Check `REACT_APP_API_URL` is set correctly
- Verify backend is running and accessible
- Check CORS configuration

#### 5. Secret Key Errors
- Generate a new secret key: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`
- Set it in environment variables

### Logs

**Backend logs:**
```bash
# Local
python manage.py runserver

# Heroku
heroku logs --tail

# Railway
railway logs

# Docker
docker-compose logs backend
```

**Frontend logs:**
```bash
# Local
npm start

# Check browser console for errors
```

---

## Security Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use a strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Configure CORS properly
- [ ] Enable SSL/TLS
- [ ] Set up database backups

---

## Additional Resources

- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/AsadUllah-11/UpdatedDailyOpenCourt/issues)
- Email: Contact repository owner

---

**Last Updated:** January 2026
