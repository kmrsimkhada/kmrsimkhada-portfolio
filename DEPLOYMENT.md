# Complete Deployment Guide

This guide covers the complete deployment process for the Kumar Simkhada Portfolio website, from initial setup to production deployment.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Infrastructure Setup](#infrastructure-setup)
- [Domain & SSL Configuration](#domain--ssl-configuration)
- [Environment Variables](#environment-variables)
- [Deployment Scripts](#deployment-scripts)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Tools
- **Node.js**: v18 or later
- **npm**: Latest version
- **AWS CLI**: v2.x configured with credentials
- **Git**: For version control

### AWS Account Setup
1. **Create AWS Account** if you don't have one
2. **Configure IAM User** with necessary permissions:
   - Lambda (full access)
   - DynamoDB (full access)
   - API Gateway (full access)
   - S3 (full access)
   - CloudFront (full access)
   - Route 53 (full access)
   - ACM (full access)
   - CloudWatch (logs access)
   - SSM Parameter Store (full access)

### AWS CLI Configuration
```bash
# Configure AWS credentials
aws configure

# Verify configuration
aws sts get-caller-identity
```

### Domain Requirements
- **Domain Name**: Purchase domain (e.g., from Route 53, Namecheap, etc.)
- **DNS Control**: Access to manage DNS records

## 🚀 Initial Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd kmrsimkhada-portfolio
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install Serverless Framework globally
npm install -g serverless
```

### 3. Environment Configuration
```bash
# Create environment file (optional)
touch .env

# Backend environment variables are managed via serverless.yml
# Frontend environment detection uses Vite's built-in variables
```

## ⚙️ Backend Deployment

### 1. Deploy Serverless Backend
```bash
cd backend

# Deploy to AWS
npm run deploy
# OR
npx serverless deploy --stage dev

# Note the API Gateway URL from output
# Example: https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev
```

### 2. Verify Backend Deployment
```bash
# Check deployment info
npx serverless info --stage dev

# Test API endpoint
curl https://your-api-gateway-url/dev/articles

# Check DynamoDB tables
aws dynamodb list-tables --region ap-southeast-2
```

### 3. Configure Admin Credentials
```bash
# Set admin credentials in AWS SSM Parameter Store
aws ssm put-parameter \
  --name "/portfolio/admin/username" \
  --value "your-admin-username" \
  --type "SecureString" \
  --region ap-southeast-2

aws ssm put-parameter \
  --name "/portfolio/admin/password" \
  --value "your-admin-password" \
  --type "SecureString" \
  --region ap-southeast-2
```

## 🎨 Frontend Deployment

### 1. Update API Configuration
```typescript
// services/api.ts
const API_BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.PROD)
  ? 'https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev'
  : 'http://localhost:3000/dev';
```

### 2. Build Frontend
```bash
cd ../  # Back to root directory
npm run build

# Verify build output
ls -la dist/
```

### 3. Create S3 Bucket
```bash
# Create bucket
aws s3 mb s3://kmrsimkhada.com --region ap-southeast-2

# Enable static website hosting
aws s3 website s3://kmrsimkhada.com \
  --index-document index.html \
  --error-document index.html
```

### 4. Deploy to S3
```bash
# Sync build files to S3
aws s3 sync dist/ s3://kmrsimkhada.com --delete

# Set cache headers for optimization
aws s3 sync dist/ s3://kmrsimkhada.com --delete \
  --cache-control "max-age=31536000" \
  --exclude "*.html"

aws s3 sync dist/ s3://kmrsimkhada.com --delete \
  --cache-control "max-age=0, no-cache, no-store, must-revalidate" \
  --include "*.html"
```

## 🏗️ Infrastructure Setup

### 1. SSL Certificate (ACM)
```bash
# Request certificate (MUST be in us-east-1 for CloudFront)
aws acm request-certificate \
  --region us-east-1 \
  --domain-name kmrsimkhada.com \
  --subject-alternative-names www.kmrsimkhada.com \
  --validation-method DNS

# Note the CertificateArn from output
```

### 2. DNS Validation
```bash
# Get validation records
aws acm describe-certificate \
  --region us-east-1 \
  --certificate-arn "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID"

# Add CNAME records to Route 53 hosted zone
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR-ZONE-ID \
  --change-batch file://dns-validation.json
```

### 3. CloudFront Distribution
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json

# Note the Distribution ID and Domain Name from output
```

### CloudFront Configuration (cloudfront-config.json)
```json
{
  "CallerReference": "portfolio-distribution-$(date +%s)",
  "Comment": "Portfolio website distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-your-domain.com",
        "DomainName": "your-domain.com.s3-website-ap-southeast-2.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-domain.com",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0
  },
  "Aliases": {
    "Quantity": 2,
    "Items": ["your-domain.com", "www.your-domain.com"]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  }
}
```

## 🌐 Domain & SSL Configuration

### 1. Route 53 Hosted Zone
```bash
# Create hosted zone (if not exists)
aws route53 create-hosted-zone \
  --name kmrsimkhada.com \
  --caller-reference "portfolio-$(date +%s)"

# Note the Name Servers for domain registrar
```

### 2. DNS Records
```bash
# Create A records pointing to CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR-ZONE-ID \
  --change-batch '{
    "Changes": [
      {
        "Action": "CREATE",
        "ResourceRecordSet": {
          "Name": "kmrsimkhada.com",
          "Type": "A",
          "AliasTarget": {
            "DNSName": "d1b5wgqn0brdgx.cloudfront.net",
            "EvaluateTargetHealth": false,
            "HostedZoneId": "Z2FDTNDATAQYW2"
          }
        }
      },
      {
        "Action": "CREATE", 
        "ResourceRecordSet": {
          "Name": "www.kmrsimkhada.com",
          "Type": "A",
          "AliasTarget": {
            "DNSName": "d1b5wgqn0brdgx.cloudfront.net",
            "EvaluateTargetHealth": false,
            "HostedZoneId": "Z2FDTNDATAQYW2"
          }
        }
      }
    ]
  }'
```

### 3. Verify SSL Certificate
```bash
# Check certificate status
aws acm describe-certificate \
  --region us-east-1 \
  --certificate-arn "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID"

# Should show "Status": "ISSUED"
```

## 📝 Environment Variables

### Backend Environment Variables (serverless.yml)
```yaml
environment:
  ARTICLES_TABLE: ${self:service}-articles-${self:provider.stage}
  BOOKS_TABLE: ${self:service}-books-${self:provider.stage}
  LOCATIONS_TABLE: ${self:service}-locations-${self:provider.stage}
  PROJECTS_TABLE: ${self:service}-projects-${self:provider.stage}
  SKILLS_TABLE: ${self:service}-skills-${self:provider.stage}
  EXPERIENCES_TABLE: ${self:service}-experiences-${self:provider.stage}
  COMMENTS_TABLE: ${self:service}-comments-${self:provider.stage}
  REGION: ${self:provider.region}
```

### Frontend Environment Detection
```typescript
// Automatic detection in services/api.ts
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://production-api-url/dev'
  : 'http://localhost:3000/dev';
```

## 🔄 Deployment Scripts

### Create deploy-backend.sh
```bash
#!/bin/bash
echo "🚀 Deploying backend..."
cd backend
npm ci --no-progress
npx serverless deploy --stage dev
echo "✅ Backend deployed successfully!"
```

### Create deploy-frontend.sh
```bash
#!/bin/bash
BUCKET_NAME="kmrsimkhada.com"
DISTRIBUTION_ID="E1PMEBDD7TY62K"

echo "🔨 Building frontend..."
npm run build

echo "📦 Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete \
  --cache-control "max-age=31536000" \
  --exclude "*.html"

aws s3 sync dist/ s3://$BUCKET_NAME --delete \
  --cache-control "max-age=0, no-cache, no-store, must-revalidate" \
  --include "*.html"

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Frontend deployed successfully!"
echo "🌐 Visit: https://www.kmrsimkhada.com"
```

### Create deploy-all.sh
```bash
#!/bin/bash
echo "🚀 Full deployment starting..."

# Deploy backend first
./deploy-backend.sh

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 30

# Deploy frontend
./deploy-frontend.sh

echo "🎉 Full deployment complete!"
echo "🔗 Admin Panel: https://www.kmrsimkhada.com/admin"
echo "🔗 Website: https://www.kmrsimkhada.com"
```

### Make Scripts Executable
```bash
chmod +x deploy-backend.sh
chmod +x deploy-frontend.sh
chmod +x deploy-all.sh
```

## 📊 Monitoring & Maintenance

### 1. CloudWatch Monitoring
```bash
# View Lambda function logs
aws logs tail /aws/lambda/portfolio-backend-dev-getArticles --follow

# View API Gateway logs
aws logs describe-log-groups --log-group-name-prefix "API-Gateway-Execution-Logs"
```

### 2. Health Checks
```bash
# Test API endpoints
curl https://your-api-url/dev/articles
curl https://your-api-url/dev/books
curl https://your-api-url/dev/locations

# Test website
curl -I https://your-domain.com
```

### 3. Performance Monitoring
- CloudWatch Metrics for Lambda execution time
- CloudFront cache hit ratio
- DynamoDB read/write capacity utilization
- API Gateway error rates

### 4. Cost Monitoring
```bash
# Check current month costs
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

## 🐛 Troubleshooting

### Common Deployment Issues

#### 1. Backend Deployment Fails
```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify permissions
aws iam get-user

# Clean deploy
cd backend
rm -rf node_modules .serverless
npm install
npx serverless deploy --stage dev --verbose
```

#### 2. Frontend Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

#### 3. SSL Certificate Issues
```bash
# Certificate must be in us-east-1
aws acm list-certificates --region us-east-1

# Check DNS validation
aws route53 list-resource-record-sets --hosted-zone-id YOUR-ZONE-ID
```

#### 4. CloudFront Not Updating
```bash
# Force invalidation
aws cloudfront create-invalidation \
  --distribution-id YOUR-DIST-ID \
  --paths "/*"

# Check distribution status
aws cloudfront get-distribution --id YOUR-DIST-ID
```

#### 5. API Gateway CORS Issues
```bash
# Verify CORS configuration in serverless.yml
# Check browser network tab for preflight requests
# Ensure proper headers in Lambda responses
```

### Debugging Commands
```bash
# Backend debugging
npx serverless logs -f getArticles --stage dev --tail

# Frontend debugging
npm run preview  # Test production build locally

# AWS resource debugging
aws cloudformation describe-stacks --stack-name portfolio-backend-dev
```

## 🔄 Continuous Deployment

### Using GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy Portfolio

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-southeast-2
        
    - name: Deploy Backend
      run: |
        cd backend
        npm ci
        npx serverless deploy --stage dev
        
    - name: Deploy Frontend
      run: |
        npm ci
        npm run build
        aws s3 sync dist/ s3://your-domain.com --delete
        aws cloudfront create-invalidation --distribution-id YOUR-ID --paths "/*"
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] AWS CLI configured
- [ ] Domain purchased and DNS accessible
- [ ] Dependencies installed
- [ ] Backend API URL updated in frontend
- [ ] Admin credentials configured

### Backend Deployment
- [ ] Serverless Framework installed
- [ ] Backend deployed successfully
- [ ] DynamoDB tables created
- [ ] API Gateway endpoints accessible
- [ ] Lambda functions working

### Frontend Deployment
- [ ] Build completed without errors
- [ ] S3 bucket created and configured
- [ ] Files uploaded to S3
- [ ] CloudFront distribution created
- [ ] SSL certificate issued and attached

### DNS & SSL
- [ ] Route 53 hosted zone configured
- [ ] A records pointing to CloudFront
- [ ] SSL certificate validated and issued
- [ ] HTTPS redirects working

### Final Testing
- [ ] Website loads correctly
- [ ] Admin panel accessible
- [ ] API endpoints responding
- [ ] CRUD operations working
- [ ] Mobile responsiveness verified

---

**Deployment Guide Version**: 1.0.0  
**Last Updated**: August 14, 2025  
**Estimated Deployment Time**: 30-60 minutes  
**Monthly Cost**: $1-5 USD
