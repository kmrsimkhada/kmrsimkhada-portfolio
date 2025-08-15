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

**Project**: Kumar Simkhada Portfolio  
**Last Updated**: August 14, 2025  
**Version**: 1.0.0