# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Security
- [ ] `DEBUG = False` in production settings
- [ ] Strong `SECRET_KEY` set (not the default)
- [ ] `ALLOWED_HOSTS` properly configured
- [ ] Environment variables used for all secrets
- [ ] `.env` file not in version control
- [ ] Database credentials are secure
- [ ] HTTPS/SSL enabled
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] CORS settings properly configured
- [ ] Admin panel URL changed (optional but recommended)

### Database
- [ ] Database backups configured
- [ ] Migrations are up to date
- [ ] PostgreSQL (or production DB) configured
- [ ] Database connection pooling enabled
- [ ] Database indexes optimized

### Django Backend
- [ ] `python manage.py check --deploy` passes
- [ ] All tests passing (`python manage.py test`)
- [ ] Static files collected (`collectstatic`)
- [ ] Media files storage configured
- [ ] Logging configured
- [ ] Error monitoring setup (e.g., Sentry)
- [ ] Email backend configured
- [ ] Timezone settings correct
- [ ] Production-ready WSGI server (Gunicorn)

### React Frontend
- [ ] `npm run build` succeeds
- [ ] API URL points to production backend
- [ ] Environment variables set correctly
- [ ] Production build tested locally
- [ ] No console errors in production build
- [ ] Analytics configured (if needed)
- [ ] Error boundary implemented
- [ ] All tests passing (`npm test`)

### Infrastructure
- [ ] Domain name configured
- [ ] DNS records set up
- [ ] SSL certificate installed
- [ ] Firewall rules configured
- [ ] Server resources adequate (CPU, RAM, Disk)
- [ ] CDN configured (if needed)
- [ ] Monitoring and alerts set up

### Performance
- [ ] Static files cached properly
- [ ] Gzip compression enabled
- [ ] Database query optimization done
- [ ] Lazy loading implemented
- [ ] Images optimized
- [ ] Bundle size optimized

### Documentation
- [ ] README.md updated
- [ ] API documentation current
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] Changelog updated

## Post-Deployment

### Verification
- [ ] Application accessible via domain
- [ ] Homepage loads correctly
- [ ] User authentication works
- [ ] API endpoints responding
- [ ] Admin panel accessible
- [ ] Static files loading
- [ ] Media files uploading/displaying
- [ ] Database connections working
- [ ] HTTPS redirects working
- [ ] Forms submitting correctly

### Testing
- [ ] Smoke tests passed
- [ ] Critical user paths tested
- [ ] Mobile responsiveness checked
- [ ] Cross-browser compatibility verified
- [ ] Performance metrics acceptable
- [ ] Error pages displaying correctly (404, 500)

### Monitoring
- [ ] Application logs being collected
- [ ] Error tracking active
- [ ] Performance monitoring running
- [ ] Uptime monitoring configured
- [ ] Backup schedule verified
- [ ] Alerts configured and tested

### Security
- [ ] Security scan completed
- [ ] Penetration testing done (if required)
- [ ] Dependencies up to date
- [ ] No sensitive data exposed
- [ ] HTTPS enforced
- [ ] Headers security checked

### Communication
- [ ] Team notified of deployment
- [ ] Stakeholders informed
- [ ] Documentation shared
- [ ] Support team prepared
- [ ] Rollback plan documented

## Quick Deployment Commands

### Heroku
```bash
git push heroku main
heroku run python manage.py migrate
heroku ps:scale web=1
```

### Railway
```bash
railway up
railway run python manage.py migrate
```

### Docker
```bash
docker-compose up -d --build
docker-compose exec backend python manage.py migrate
```

### Manual Server
```bash
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

## Emergency Rollback

### Heroku
```bash
heroku releases
heroku rollback v123
```

### Railway
```bash
railway logs
# Redeploy previous version from dashboard
```

### Docker
```bash
docker-compose down
git checkout previous-commit
docker-compose up -d --build
```

### Manual Server
```bash
git log --oneline
git checkout <previous-commit>
# Or
git revert <bad-commit>
sudo systemctl restart gunicorn
```

## Health Check URLs

After deployment, verify these endpoints:

- [ ] `https://yourdomain.com` - Homepage
- [ ] `https://yourdomain.com/api/` - API base
- [ ] `https://yourdomain.com/admin/` - Admin panel
- [ ] `https://yourdomain.com/static/` - Static files
- [ ] `https://yourdomain.com/media/` - Media files (if applicable)

## Common Issues & Solutions

### Issue: Static files not loading
**Solution:**
```bash
python manage.py collectstatic --noinput
# Verify STATIC_ROOT and STATIC_URL settings
```

### Issue: Database connection error
**Solution:**
```bash
# Check database credentials in .env
# Verify database is running
# Check firewall rules
```

### Issue: 502 Bad Gateway
**Solution:**
```bash
# Check backend is running
sudo systemctl status gunicorn
# Check nginx configuration
sudo nginx -t
```

### Issue: CORS errors
**Solution:**
```python
# Update CORS_ALLOWED_ORIGINS in settings.py
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
]
```

## Post-Launch Tasks

### Week 1
- [ ] Monitor error rates
- [ ] Review performance metrics
- [ ] Check user feedback
- [ ] Verify backups working
- [ ] Review security logs

### Week 2-4
- [ ] Analyze usage patterns
- [ ] Optimize based on metrics
- [ ] Update documentation as needed
- [ ] Plan improvements
- [ ] Review and update dependencies

## Notes

- Always test in staging before production
- Keep a deployment log with dates and versions
- Document any custom configurations
- Maintain runbook for common operations
- Schedule regular security updates

---

**Last Updated:** January 2026

**Deployment Date:** _______________

**Deployed By:** _______________

**Version:** _______________

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________
