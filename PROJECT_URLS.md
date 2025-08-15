# Project URLs and Configuration

## Live URLs
- **Production Website**: https://www.kmrsimkhada.com
- **Admin Panel**: https://www.kmrsimkhada.com/admin
- **API Base URL**: https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev

## AWS Infrastructure
- **S3 Bucket**: kmrsimkhada.com
- **CloudFront Distribution ID**: E1PMEBDD7TY62K
- **CloudFront Domain**: d1b5wgqn0brdgx.cloudfront.net
- **AWS Region**: ap-southeast-2 (Sydney)
- **Backend Service**: portfolio-backend-dev

## API Endpoints (Production)
Base URL: https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev

### Articles
- GET    /articles              # Get all articles
- GET    /articles/{id}         # Get single article  
- POST   /articles              # Create article (admin)
- PUT    /articles/{id}         # Update article (admin)
- DELETE /articles/{id}         # Delete article (admin)

### Books
- GET    /books                 # Get all books
- POST   /books                 # Create book (admin)
- PUT    /books/{id}            # Update book (admin)
- DELETE /books/{id}            # Delete book (admin)

### Locations
- GET    /locations             # Get all locations
- POST   /locations             # Create location (admin)
- PUT    /locations/{id}        # Update location (admin)
- DELETE /locations/{id}        # Delete location (admin)

### Projects
- GET    /projects              # Get all projects
- POST   /projects              # Create project (admin)
- PUT    /projects/{id}         # Update project (admin)
- DELETE /projects/{id}         # Delete project (admin)

### Skills
- GET    /skills                # Get all skills
- POST   /skills                # Create skill (admin)
- PUT    /skills/{id}           # Update skill (admin)
- DELETE /skills/{id}           # Delete skill (admin)

### Experiences
- GET    /experiences           # Get all experiences
- POST   /experiences           # Create experience (admin)
- PUT    /experiences/{id}      # Update experience (admin)
- DELETE /experiences/{id}      # Delete experience (admin)

### Comments
- GET    /comments/article/{articleId}  # Get comments for article
- POST   /comments/article/{articleId}  # Create comment

### Admin Authentication
- POST   /admin/login                   # Admin login
- POST   /admin/change-credentials      # Change admin credentials

## DynamoDB Tables
- portfolio-backend-articles-dev
- portfolio-backend-books-dev
- portfolio-backend-locations-dev
- portfolio-backend-projects-dev
- portfolio-backend-skills-dev
- portfolio-backend-experiences-dev
- portfolio-backend-comments-dev

## Local Development URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/dev

## Example API Calls
```bash
# Get articles
curl https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev/articles

# Admin login
curl -X POST https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your-username","password":"your-password"}'

# Create article (admin)
curl -X POST https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Article","content":"Article content","description":"Test description","published":true}'
```

## Deployment Commands
```bash
# Deploy backend
cd backend && npx serverless deploy --stage dev

# Deploy frontend
npm run build
aws s3 sync dist/ s3://kmrsimkhada.com --delete
aws cloudfront create-invalidation --distribution-id E1PMEBDD7TY62K --paths "/*"
```
