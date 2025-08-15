# 🚀 Portfolio Deployment Checklist

## ✅ Backend (Completed)
- [x] AWS Lambda functions deployed
- [x] DynamoDB tables created
- [x] API Gateway configured
- [x] API endpoints working

## 🔄 Frontend Deployment (In Progress)

### Step 1: Deploy to S3
```bash
./deploy-frontend.sh
```

### Step 2: Request SSL Certificate
1. Go to **AWS Certificate Manager** (us-east-1 region)
2. Click **"Request a certificate"**
3. Add domains:
   - `kmrsimkhada.com`
   - `www.kmrsimkhada.com`
4. Choose **DNS validation**
5. **Validate** the certificate

### Step 3: Create CloudFront Distribution
1. Go to **CloudFront Console**
2. Click **"Create Distribution"**
3. **Origin Settings:**
   - Origin Domain: `kmrsimkhada.com.s3.ap-southeast-2.amazonaws.com`
   - Origin Access Control: Create new OAC
4. **Distribution Settings:**
   - CNAMEs: `kmrsimkhada.com`, `www.kmrsimkhada.com`
   - SSL Certificate: Select your ACM certificate
   - Default Root Object: `index.html`
5. **Custom Error Pages:**
   - 403 → `/index.html` (200)
   - 404 → `/index.html` (200)

### Step 4: Update S3 Bucket Policy
Replace `YOUR_DISTRIBUTION_ID` in `s3-bucket-policy-template.json` and apply it.

### Step 5: Configure DNS (Route 53)
1. Create **Hosted Zone** for `kmrsimkhada.com`
2. Create **A records:**
   - `kmrsimkhada.com` → CloudFront distribution
   - `www.kmrsimkhada.com` → CloudFront distribution
3. Update **nameservers** at your domain registrar

## 🧪 Testing Checklist

### Database Testing
- [ ] Open `test-database.html`
- [ ] Test API connection
- [ ] Add sample data
- [ ] Test admin panel

### Frontend Testing
- [ ] Test local build: `npm run build && npm run preview`
- [ ] Test S3 website URL
- [ ] Test CloudFront URL
- [ ] Test custom domain with HTTPS

## 📊 Cost Monitoring

**Expected Monthly Costs:**
- **S3**: ~$0.10
- **CloudFront**: ~$1-3
- **Route 53**: $0.50
- **Lambda + DynamoDB**: ~$4-5
- **Total**: ~$5.60-8.60/month

## 🔧 Useful Commands

```bash
# Deploy backend
cd backend && npm run deploy

# Deploy frontend
./deploy-frontend.sh

# Test API
curl https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev/articles

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## 🆘 Troubleshooting

**Common Issues:**
1. **Certificate validation fails**: Check DNS records
2. **CloudFront 403 errors**: Update S3 bucket policy
3. **Domain not resolving**: Check nameservers and DNS propagation
4. **API CORS errors**: Check API Gateway CORS settings

## 🎯 Next Steps After Deployment

1. **Monitor costs** in AWS Billing Dashboard
2. **Set up CloudWatch alarms** for usage monitoring
3. **Configure backup** for DynamoDB tables
4. **Add CI/CD pipeline** for automatic deployments
5. **Implement analytics** (Google Analytics, etc.)

---

**Your API Endpoint:** https://qa6iwynfo6.execute-api.ap-southeast-2.amazonaws.com/dev
**Target Domain:** https://www.kmrsimkhada.com