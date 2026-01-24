# Daily Open Court Application

A full-stack web application built with Django REST Framework (backend) and React (frontend) for managing daily court operations.

## 🚀 Quick Start

### Using Docker (Recommended)

The fastest way to get started:

```bash
# Clone the repository
git clone https://github.com/AsadUllah-11/UpdatedDailyOpenCourt.git
cd UpdatedDailyOpenCourt

# Start the application with Docker Compose
docker-compose up --build

# Create a superuser (in a new terminal)
docker-compose exec backend python manage.py createsuperuser
```

Then access:
- **Frontend:** http://localhost
- **Backend API:** http://localhost:8000
- **Admin Panel:** http://localhost:8000/admin

### Manual Setup

#### Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

#### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## 📋 Features

- User authentication with JWT
- RESTful API
- Modern React UI
- Responsive design
- Data management
- Excel import/export capabilities

## 🛠️ Technology Stack

### Backend
- **Framework:** Django 4.2+
- **API:** Django REST Framework
- **Authentication:** JWT (Simple JWT)
- **Database:** SQLite (dev), PostgreSQL (production)
- **Server:** Gunicorn

### Frontend
- **Framework:** React 19+
- **HTTP Client:** Axios
- **Routing:** React Router
- **Charts:** Recharts
- **Icons:** React Icons, Lucide React
- **Build Tool:** Create React App

## 📦 Project Structure

```
UpdatedDailyOpenCourt/
├── backend/                 # Django backend
│   ├── backend/            # Django project settings
│   ├── core/               # Main Django app
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Backend Docker configuration
│   └── manage.py           # Django management script
├── frontend/               # React frontend
│   ├── public/            # Static files
│   ├── src/               # React source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── context/       # React context
│   ├── package.json       # Node dependencies
│   └── Dockerfile         # Frontend Docker configuration
├── docker-compose.yml     # Docker Compose configuration
├── .env.example          # Environment variables template
└── DEPLOYMENT.md         # Detailed deployment guide
```

## 🌐 Deployment

This application can be deployed to various platforms. See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:

- **Docker Deployment** (Recommended)
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean App Platform**
- **AWS EC2**
- **Vercel + Railway**
- **Manual Server Setup**

### Quick Deployment Options

#### Deploy to Heroku

```bash
# Backend
cd backend
heroku create your-app-backend
heroku addons:create heroku-postgresql:mini
git push heroku main

# Frontend - deploy to Vercel or Netlify
cd frontend
npm run build
# Deploy the build folder
```

#### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🔐 Environment Variables

### Backend (.env)

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
DB_ENGINE=django.db.backends.postgresql
DB_NAME=dailyopencourt
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8000
```

See [.env.example](./.env.example) for a complete template.

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 API Documentation

The API endpoints are available at:
- Base URL: `http://localhost:8000/api/`
- Admin Interface: `http://localhost:8000/admin/`

### Main Endpoints
- `/api/auth/login/` - User login
- `/api/auth/register/` - User registration
- `/api/auth/refresh/` - Refresh JWT token
- (Add more endpoints as needed)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **AsadUllah** - [AsadUllah-11](https://github.com/AsadUllah-11)

## 🐛 Issues

Found a bug? Please open an issue [here](https://github.com/AsadUllah-11/UpdatedDailyOpenCourt/issues).

## 📞 Support

For support and questions, please open an issue or contact the repository owner.

## ⚙️ Development

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- PostgreSQL (for production)
- Docker & Docker Compose (optional)

### Setup Development Environment

1. **Clone and setup:**
   ```bash
   git clone https://github.com/AsadUllah-11/UpdatedDailyOpenCourt.git
   cd UpdatedDailyOpenCourt
   ```

2. **Backend setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

3. **Frontend setup (in new terminal):**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Code Style

- **Backend:** Follow PEP 8 guidelines
- **Frontend:** ESLint configuration included
- Run linters before committing

## 📊 Database Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Show migrations
python manage.py showmigrations
```

## 🔒 Security

- Always use environment variables for sensitive data
- Never commit `.env` files
- Use HTTPS in production
- Keep dependencies updated
- Follow security best practices in [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🚀 Performance Tips

- Use production build for frontend (`npm run build`)
- Enable WhiteNoise for static files
- Use CDN for static assets
- Configure database connection pooling
- Enable caching in production

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Deployment Guide](./DEPLOYMENT.md)

---

**Made with ❤️ by AsadUllah**
