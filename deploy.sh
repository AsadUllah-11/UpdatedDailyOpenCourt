#!/bin/bash

# Deployment script for production server
# This script sets up the application on a fresh Ubuntu server

set -e  # Exit on error

echo "======================================"
echo "Daily Open Court - Production Setup"
echo "======================================"
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install dependencies
echo "📦 Installing dependencies..."
sudo apt install -y python3-pip python3-venv nginx postgresql postgresql-contrib git

# Install Node.js
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone repository
echo "📥 Cloning repository..."
cd /var/www
if [ -d "UpdatedDailyOpenCourt" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd UpdatedDailyOpenCourt
    git pull
else
    sudo git clone https://github.com/AsadUllah-11/UpdatedDailyOpenCourt.git
    cd UpdatedDailyOpenCourt
fi

sudo chown -R $USER:$USER /var/www/UpdatedDailyOpenCourt

# Setup PostgreSQL
echo "🗄️  Setting up PostgreSQL..."
read -p "Enter database name [dailyopencourt]: " DB_NAME
DB_NAME=${DB_NAME:-dailyopencourt}

read -p "Enter database user [dailyuser]: " DB_USER
DB_USER=${DB_USER:-dailyuser}

read -sp "Enter database password: " DB_PASSWORD
echo ""

sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
ALTER ROLE $DB_USER SET client_encoding TO 'utf8';
ALTER ROLE $DB_USER SET default_transaction_isolation TO 'read committed';
ALTER ROLE $DB_USER SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

# Setup Backend
echo "🔧 Setting up Django backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
read -p "Enter your domain name: " DOMAIN_NAME
SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')

cat > .env << EOF
SECRET_KEY=$SECRET_KEY
DEBUG=False
ALLOWED_HOSTS=$DOMAIN_NAME,www.$DOMAIN_NAME
DB_ENGINE=django.db.backends.postgresql
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=https://$DOMAIN_NAME,https://www.$DOMAIN_NAME
EOF

# Run migrations
echo "🗃️  Running database migrations..."
python manage.py migrate
python manage.py collectstatic --noinput

# Create superuser
echo "👤 Creating superuser..."
python manage.py createsuperuser

# Setup Gunicorn service
echo "🚀 Setting up Gunicorn service..."
sudo tee /etc/systemd/system/gunicorn.service > /dev/null << EOF
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=$USER
Group=www-data
WorkingDirectory=/var/www/UpdatedDailyOpenCourt/backend
Environment="PATH=/var/www/UpdatedDailyOpenCourt/backend/venv/bin"
ExecStart=/var/www/UpdatedDailyOpenCourt/backend/venv/bin/gunicorn --workers 3 --bind unix:/var/www/UpdatedDailyOpenCourt/backend/backend.sock backend.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# Setup Frontend
echo "🎨 Setting up React frontend..."
cd /var/www/UpdatedDailyOpenCourt/frontend
echo "REACT_APP_API_URL=https://$DOMAIN_NAME/api" > .env.production
npm install
npm run build

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/dailyopencourt > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    # Frontend
    location / {
        root /var/www/UpdatedDailyOpenCourt/frontend/build;
        try_files \$uri /index.html;
    }

    # Backend API
    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/var/www/UpdatedDailyOpenCourt/backend/backend.sock;
    }

    # Admin
    location /admin/ {
        include proxy_params;
        proxy_pass http://unix:/var/www/UpdatedDailyOpenCourt/backend/backend.sock;
    }

    # Static files
    location /static/ {
        alias /var/www/UpdatedDailyOpenCourt/backend/staticfiles/;
    }

    # Media files
    location /media/ {
        alias /var/www/UpdatedDailyOpenCourt/backend/media/;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/dailyopencourt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL (optional)
read -p "Do you want to setup SSL with Let's Encrypt? (y/n): " SETUP_SSL
if [ "$SETUP_SSL" = "y" ]; then
    echo "🔒 Setting up SSL..."
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME
fi

echo ""
echo "======================================"
echo "✅ Deployment Complete!"
echo "======================================"
echo ""
echo "Your application is now running at:"
echo "  Frontend: https://$DOMAIN_NAME"
echo "  Admin: https://$DOMAIN_NAME/admin"
echo ""
echo "To manage the services:"
echo "  sudo systemctl status gunicorn"
echo "  sudo systemctl restart gunicorn"
echo "  sudo systemctl status nginx"
echo "  sudo systemctl restart nginx"
echo ""
