# Deployment Architecture

## Application Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Daily Open Court                         │
│                   Full-Stack Application                     │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼───────┐           ┌──────▼──────┐
        │   Frontend    │           │   Backend   │
        │   (React)     │◄─────────►│  (Django)   │
        │   Port 3000   │   API     │  Port 8000  │
        └───────────────┘   Calls   └─────────────┘
                                            │
                                     ┌──────▼──────┐
                                     │  Database   │
                                     │ (PostgreSQL)│
                                     │  Port 5432  │
                                     └─────────────┘
```

## Docker Deployment Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        Docker Host                             │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   docker-compose.yml                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Frontend   │  │   Backend    │  │     Database       │   │
│  │  Container  │  │   Container  │  │     Container      │   │
│  │             │  │              │  │                    │   │
│  │  - Nginx    │  │  - Django    │  │  - PostgreSQL      │   │
│  │  - React    │  │  - Gunicorn  │  │  - Data Volume     │   │
│  │             │  │              │  │                    │   │
│  │  Port: 80   │  │  Port: 8000  │  │  Port: 5432        │   │
│  └──────┬──────┘  └──────┬───────┘  └─────────┬──────────┘   │
│         │                │                    │              │
│         └────────────────┴────────────────────┘              │
│                   Internal Network                           │
└────────────────────────────────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Port 80   │
                    │  (External) │
                    └─────────────┘
```

## Production Deployment (Ubuntu Server)

```
┌────────────────────────────────────────────────────────────────┐
│                         Server (Ubuntu)                         │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                         Nginx                             │ │
│  │              (Reverse Proxy + Static Files)               │ │
│  │                      Port 80/443                          │ │
│  └───────┬──────────────────────────────────┬────────────────┘ │
│          │                                  │                  │
│  ┌───────▼────────┐                 ┌───────▼──────────┐      │
│  │   Frontend     │                 │    Backend API   │      │
│  │  (React Build) │                 │                  │      │
│  │                │                 │  Gunicorn        │      │
│  │  /build/       │                 │  (WSGI Server)   │      │
│  │                │                 │                  │      │
│  │  Served by     │                 │  Django App      │      │
│  │  Nginx         │                 │                  │      │
│  └────────────────┘                 └─────────┬────────┘      │
│                                               │               │
│                                      ┌────────▼────────┐      │
│                                      │   PostgreSQL    │      │
│                                      │   Database      │      │
│                                      │   Port 5432     │      │
│                                      └─────────────────┘      │
└────────────────────────────────────────────────────────────────┘
```

## Cloud Platform Deployment (Heroku Example)

```
┌────────────────────────────────────────────────────────────────┐
│                        Heroku Platform                          │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Frontend (Vercel/Netlify)                    │ │
│  │                                                           │ │
│  │  - Global CDN                                             │ │
│  │  - React Build                                            │ │
│  │  - HTTPS                                                  │ │
│  └────────────────────┬──────────────────────────────────────┘ │
│                       │                                        │
│                       │ API Calls                              │
│                       │                                        │
│  ┌────────────────────▼─────────────────────────────────────┐ │
│  │              Backend Dyno (Heroku)                        │ │
│  │                                                           │ │
│  │  - Gunicorn                                               │ │
│  │  - Django App                                             │ │
│  │  - WhiteNoise (Static Files)                              │ │
│  └────────────────────┬──────────────────────────────────────┘ │
│                       │                                        │
│  ┌────────────────────▼─────────────────────────────────────┐ │
│  │           Heroku Postgres Add-on                          │ │
│  │                                                           │ │
│  │  - Managed PostgreSQL                                     │ │
│  │  - Automatic Backups                                      │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## Hybrid Deployment (Vercel + Railway)

```
┌────────────────────────────────────────────────────────────────┐
│                    Internet / Users                             │
└────────────┬───────────────────────────────────┬───────────────┘
             │                                   │
    ┌────────▼─────────┐              ┌─────────▼──────────┐
    │     Vercel       │              │     Railway        │
    │   (Frontend)     │              │    (Backend)       │
    │                  │              │                    │
    │  - React App     │              │  - Django API      │
    │  - Global CDN    │──── API ────►│  - Gunicorn        │
    │  - Edge Network  │   Calls      │  - PostgreSQL      │
    │  - HTTPS         │              │  - HTTPS           │
    │                  │              │                    │
    └──────────────────┘              └────────────────────┘
         Fast                              Scalable
    Static Serving                      API Backend
```

## Request Flow

### Frontend Request Flow
```
User Browser
    │
    ▼
[HTTPS Request]
    │
    ▼
Nginx/CDN
    │
    ├──► Static Files (CSS, JS, Images)
    │
    └──► index.html (React App)
         │
         ▼
    React Router
    (Client-side routing)
```

### API Request Flow
```
React App
    │
    ▼
[API Request]
(axios)
    │
    ▼
CORS Check
    │
    ▼
Backend Server
(Gunicorn/Django)
    │
    ▼
JWT Authentication
    │
    ▼
URL Routing
    │
    ▼
View/ViewSet
    │
    ▼
Database Query
(PostgreSQL)
    │
    ▼
JSON Response
    │
    ▼
React App
(State Update)
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Network                                           │
│  - Firewall Rules                                           │
│  - HTTPS/TLS Encryption                                     │
│  - DDoS Protection                                          │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Application                                       │
│  - CORS Configuration                                       │
│  - CSRF Protection                                          │
│  - Security Headers (CSP, HSTS, etc.)                       │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Authentication                                    │
│  - JWT Tokens                                               │
│  - Password Hashing (Django)                                │
│  - Session Management                                       │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Authorization                                     │
│  - Permission Classes                                       │
│  - Role-based Access Control                                │
│  - Object-level Permissions                                 │
├─────────────────────────────────────────────────────────────┤
│  Layer 5: Database                                          │
│  - SQL Injection Protection (Django ORM)                    │
│  - Database Encryption                                      │
│  - Access Controls                                          │
└─────────────────────────────────────────────────────────────┘
```

## Scaling Architecture

### Horizontal Scaling
```
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
   │Frontend │      │Frontend │     │Frontend │
   │Instance │      │Instance │     │Instance │
   └─────────┘      └─────────┘     └─────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                    API Gateway
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
   │Backend  │      │Backend  │     │Backend  │
   │Instance │      │Instance │     │Instance │
   └─────────┘      └─────────┘     └─────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                 Database Cluster
              (Primary + Replicas)
```

## Deployment Paths

```
Local Development
    │
    ├──► Testing
    │       │
    │       └──► Staging
    │               │
    │               └──► Production
    │
    └──► Docker Build
            │
            ├──► Docker Hub/Registry
            │       │
            │       └──► Cloud Deployment
            │
            └──► Local Docker Deployment
```

## File Structure in Production

```
/var/www/UpdatedDailyOpenCourt/
│
├── backend/
│   ├── venv/                    (Python virtual environment)
│   ├── staticfiles/             (Collected static files)
│   ├── media/                   (User uploads)
│   ├── db.sqlite3              (Dev only)
│   ├── manage.py
│   └── backend/
│       ├── settings.py
│       ├── urls.py
│       └── wsgi.py
│
├── frontend/
│   ├── build/                   (Production React build)
│   │   ├── static/
│   │   │   ├── css/
│   │   │   └── js/
│   │   └── index.html
│   └── node_modules/            (Dev only)
│
└── logs/                        (Application logs)
```

## Monitoring & Logging

```
┌─────────────────────────────────────────────────────────┐
│                  Application Monitoring                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Frontend    │  │   Backend    │  │   Database   │ │
│  │  Logs        │  │   Logs       │  │   Logs       │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                 │         │
│         └─────────────────┼─────────────────┘         │
│                           │                           │
│                  ┌────────▼────────┐                  │
│                  │  Log Aggregator │                  │
│                  │  (e.g., Sentry) │                  │
│                  └────────┬────────┘                  │
│                           │                           │
│                  ┌────────▼────────┐                  │
│                  │   Monitoring    │                  │
│                  │   Dashboard     │                  │
│                  └─────────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

---

**This architecture supports all deployment methods documented in DEPLOYMENT.md**
