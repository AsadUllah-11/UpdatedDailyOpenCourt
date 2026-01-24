#!/bin/bash

# Local development setup script

set -e

echo "======================================"
echo "Daily Open Court - Local Setup"
echo "======================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Setup Backend
echo "🔧 Setting up Django backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Running database migrations..."
python manage.py migrate

echo "Creating superuser..."
echo "Please enter superuser credentials:"
python manage.py createsuperuser || true

echo ""
echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "🎨 Setting up React frontend..."
cd ../frontend

echo "Installing Node.js dependencies..."
npm install

echo ""
echo "✅ Frontend setup complete!"
echo ""

# Instructions
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "To start the development servers:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Access the application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000"
echo "  Admin Panel: http://localhost:8000/admin"
echo ""
