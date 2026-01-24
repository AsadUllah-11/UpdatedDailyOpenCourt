# Contributing to Daily Open Court

Thank you for your interest in contributing to Daily Open Court! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- Git
- PostgreSQL (for production testing)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/UpdatedDailyOpenCourt.git
   cd UpdatedDailyOpenCourt
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/AsadUllah-11/UpdatedDailyOpenCourt.git
   ```

3. **Run local setup**
   ```bash
   chmod +x setup-local.sh
   ./setup-local.sh
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Backend Development (Django)

1. **Activate virtual environment**
   ```bash
   cd backend
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. **Make your changes**

3. **Create/update migrations if needed**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Run tests**
   ```bash
   python manage.py test
   ```

5. **Check code style**
   ```bash
   flake8 .
   ```

### Frontend Development (React)

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Make your changes**

3. **Run tests**
   ```bash
   npm test
   ```

4. **Check build**
   ```bash
   npm run build
   ```

### Testing Your Changes

Always test your changes before submitting:

**Backend:**
```bash
cd backend
python manage.py test
python manage.py runserver  # Manual testing
```

**Frontend:**
```bash
cd frontend
npm test
npm start  # Manual testing
```

**Docker:**
```bash
docker-compose up --build
```

## Coding Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use meaningful variable and function names
- Write docstrings for classes and functions
- Maximum line length: 120 characters
- Use type hints where appropriate

Example:
```python
def calculate_total(items: list) -> float:
    """
    Calculate the total sum of items.
    
    Args:
        items: List of numeric values
        
    Returns:
        Sum of all items as float
    """
    return sum(items)
```

### JavaScript/React (Frontend)

- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful component and variable names
- Write PropTypes or TypeScript types
- Keep components small and focused

Example:
```javascript
const UserProfile = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Effect code
  }, [user]);
  
  return (
    <div className="user-profile">
      {/* Component JSX */}
    </div>
  );
};
```

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add password reset functionality

fix(api): resolve CORS issue in production

docs(readme): update installation instructions
```

## Submitting Changes

### Pull Request Process

1. **Update your fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Rebase your branch** (if needed)
   ```bash
   git checkout feature/your-feature-name
   git rebase main
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Go to GitHub and create a PR from your fork
   - Fill in the PR template
   - Link any related issues

5. **Wait for review**
   - Address any feedback
   - Make requested changes
   - Push updates to the same branch

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear and descriptive
- [ ] No merge conflicts
- [ ] PR description explains changes clearly

## Reporting Bugs

### Before Submitting

1. Check existing issues
2. Try to reproduce on latest version
3. Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Ubuntu 20.04]
- Browser: [e.g., Chrome 90]
- Python version: [e.g., 3.11]
- Node version: [e.g., 18.0]

**Additional context**
Any other relevant information.
```

## Feature Requests

### Before Submitting

1. Check if feature already exists
2. Search existing feature requests
3. Consider if it fits project scope

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context, screenshots, or examples.
```

## Development Tips

### Useful Commands

**Django:**
```bash
# Create superuser
python manage.py createsuperuser

# Run specific test
python manage.py test core.tests.TestModelName

# Generate secret key
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Check for issues
python manage.py check
```

**React:**
```bash
# Install new package
npm install package-name

# Update dependencies
npm update

# Analyze bundle size
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

**Git:**
```bash
# Squash commits
git rebase -i HEAD~3

# Amend last commit
git commit --amend

# Cherry-pick commit
git cherry-pick <commit-hash>
```

### Common Issues

**Django migrations conflict:**
```bash
python manage.py migrate --fake core zero
python manage.py migrate core
```

**Node modules issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port already in use:**
```bash
# Linux/Mac
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

## Getting Help

- **Documentation:** Check [README.md](./README.md) and [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues:** Browse [existing issues](https://github.com/AsadUllah-11/UpdatedDailyOpenCourt/issues)
- **Discussions:** Start a [discussion](https://github.com/AsadUllah-11/UpdatedDailyOpenCourt/discussions)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Daily Open Court! 🎉
