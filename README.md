# Kumar Simkhada Portfolio - Project Documentation

A modern, full-stack portfolio website with admin panel, built with React + TypeScript frontend and AWS serverless backend.

## 🌐 Live Site
- **Production**: https://www.kmrsimkhada.com
- **Admin Panel**: https://www.kmrsimkhada.com/admin

## 🏗️ Architecture Overview

```
Frontend (React/Vite) → CloudFront → S3 Static Hosting
Admin Panel → API Gateway → Lambda Functions → DynamoDB
HTTPS via ACM Certificate + Route 53 DNS
```

## 🎨 Frontend

### Technology Stack
- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router DOM 7.8.0
- **Styling**: TailwindCSS
- **State Management**: React Hooks

### Key Features
- Responsive design with mobile-first approach
- Dynamic content from API
- Admin panel with full CRUD operations
- Blog system with articles and comments
- Portfolio sections: Projects, Skills, Experience, Travel, Reading
- Interactive UI with animations and particle backgrounds

### Project Structure
```
/
├── components/          # Reusable UI components
├── pages/              # Route components (Admin, Blog, etc.)
├── services/           # API service layer
├── types.ts           # TypeScript interfaces
└── App.tsx            # Main application
```

## ⚙️ Backend

### Technology Stack
- **Runtime**: Node.js 18.x on AWS Lambda
- **Framework**: Serverless Framework
- **API**: AWS API Gateway (REST)
- **Database**: AWS DynamoDB
- **Authentication**: Custom system with AWS SSM Parameter Store

### API Endpoints
```
Articles:     GET, POST, PUT, DELETE /articles
Books:        GET, POST, PUT, DELETE /books  
Locations:    GET, POST, PUT, DELETE /locations
Projects:     GET, POST, PUT, DELETE /projects
Skills:       GET, POST, PUT, DELETE /skills
Experiences:  GET, POST, PUT, DELETE /experiences
Comments:     GET, POST /comments/article/{id}
Auth:         POST /admin/login, /admin/change-credentials
```

## 🗄️ Database

### DynamoDB Tables
- **Articles**: Blog posts with title, content, published status
- **Books**: Reading list with status, progress, ratings
- **Locations**: Travel places with coordinates and status
- **Projects**: Portfolio projects with links and tags
- **Skills**: Technical skills with categories and levels
- **Experiences**: Work experience with descriptions
- **Comments**: Blog comments linked to articles

## 🚀 Infrastructure & Deployment

### AWS Services
- **S3**: Static website hosting
- **CloudFront**: CDN with HTTPS
- **Route 53**: DNS management
- **ACM**: SSL certificates (us-east-1)
- **API Gateway**: REST API
- **Lambda**: Serverless functions
- **DynamoDB**: NoSQL database

### Deployment Commands
```bash
# Backend
cd backend && npx serverless deploy --stage dev

# Frontend
npm run build
aws s3 sync dist/ s3://kmrsimkhada.com --delete
aws cloudfront create-invalidation --distribution-id E1PMEBDD7TY62K --paths "/*"
```

## 🔄 Migration Process

### From localStorage to Database

#### Problem Solved
- Original: All data stored in browser localStorage
- Solution: Full-stack with persistent database storage

#### Key Changes
1. **Created REST API** with Lambda + DynamoDB
2. **Refactored Admin Panel** to use API calls instead of localStorage
3. **Updated Public Pages** to fetch from backend
4. **Added Error Handling** and loading states
5. **Migrated Existing Data** using custom migration tool

#### Code Examples
```typescript
// Before: localStorage
localStorage.setItem('articles', JSON.stringify(data));

// After: API
await apiService.createArticle(data);
```

## 📚 API Usage

### Base URL
`https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev`

### Example Requests
```bash
# Get articles
GET /articles

# Create article (admin)
POST /articles
{
  "title": "Article Title",
  "content": "Article content...",
  "description": "Brief description",
  "published": true
}

# Update article
PUT /articles/{id}
{
  "title": "Updated Title"
}
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- AWS CLI configured
- Serverless Framework

### Local Development
```bash
# Install dependencies
npm install
cd backend && npm install

# Start backend locally
npx serverless offline

# Start frontend
npm run dev
```

### Environment Configuration
- **Development**: `http://localhost:3000/dev`
- **Production**: AWS API Gateway URL
- **Detection**: Uses `import.meta.env.PROD`

## 🐛 Troubleshooting

### Common Issues

**Frontend not updating after deployment:**
```bash
aws cloudfront create-invalidation --distribution-id E1PMEBDD7TY62K --paths "/*"
```

**API calls failing:**
- Check API Gateway URL in `services/api.ts`
- Verify backend deployment: `npx serverless info --stage dev`

**SSL certificate issues:**
- Certificate must be in us-east-1 for CloudFront
- Verify DNS validation records in Route 53

## 📊 Performance Features

### Optimizations
- CloudFront CDN for global performance
- DynamoDB on-demand billing
- Vite for fast build times
- Lazy loading and code splitting
- Responsive images and assets

### Caching Strategy
- Static assets: 1 year cache
- HTML files: No cache for updates
- API responses: Real-time data

## 🔒 Security

### Implementation
- HTTPS-only with automatic redirects
- Input validation on all API endpoints
- Secure credential storage in AWS SSM
- CORS properly configured
- No sensitive data in frontend code

## 📈 Monitoring

### Logging & Analytics
- CloudWatch for Lambda function logs
- API Gateway request/response logging
- Error tracking and alerting
- Performance monitoring

## 🚀 Future Enhancements

### Planned Features
- [ ] CI/CD pipeline with GitHub Actions
- [ ] User authentication for comments
- [ ] Search functionality
- [ ] Multi-region deployment
- [ ] Backup and disaster recovery
- [ ] Performance analytics dashboard

## 📞 Support & Maintenance

### Deployment Checklist
1. Test changes locally
2. Deploy backend first
3. Update frontend
4. Invalidate CloudFront cache
5. Verify functionality

### Monitoring
- Check CloudWatch logs for errors
- Monitor DynamoDB performance
- Verify SSL certificate renewal
- Test API endpoints regularly

---

**Project**: Kumar Simkhada Portfolio  
**Last Updated**: August 14, 2025  
**Version**: 1.0.0