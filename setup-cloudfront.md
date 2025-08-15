# CloudFront Setup Guide

## Step 1: Create CloudFront Distribution

1. **Go to CloudFront Console**
2. **Click "Create Distribution"**

### Origin Settings:
- **Origin Domain**: Select your S3 bucket `kmrsimkhada.com.s3.ap-southeast-2.amazonaws.com`
- **Origin Path**: Leave empty
- **Name**: `kmrsimkhada-s3-origin`
- **Origin Access**: **Origin access control settings (recommended)**
- **Origin access control**: Create new OAC
  - Name: `kmrsimkhada-oac`
  - Sign requests: Yes
  - Origin type: S3

### Default Cache Behavior:
- **Path Pattern**: Default (*)
- **Viewer Protocol Policy**: **Redirect HTTP to HTTPS**
- **Allowed HTTP Methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
- **Cache Policy**: **Caching Optimized**
- **Origin Request Policy**: None
- **Response Headers Policy**: None

### Distribution Settings:
- **Price Class**: Use all edge locations (best performance)
- **Alternate Domain Names (CNAMEs)**: 
  - `kmrsimkhada.com`
  - `www.kmrsimkhada.com`
- **Custom SSL Certificate**: Select your ACM certificate
- **Security Policy**: TLSv1.2_2021
- **Default Root Object**: `index.html`

### Custom Error Pages:
Add these error pages for React Router:

**Error Page 1:**
- HTTP Error Code: 403
- Response Page Path: `/index.html`
- HTTP Response Code: 200
- Error Caching Minimum TTL: 300

**Error Page 2:**
- HTTP Error Code: 404
- Response Page Path: `/index.html`
- HTTP Response Code: 200
- Error Caching Minimum TTL: 300

3. **Click "Create Distribution"**

## Step 2: Update S3 Bucket Policy

After creating CloudFront, update your S3 bucket policy to only allow CloudFront access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::kmrsimkhada.com/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
                }
            }
        }
    ]
}
```

## Step 3: Configure Route 53 (DNS)

1. **Go to Route 53 Console**
2. **Create/Select Hosted Zone**: `kmrsimkhada.com`

### Create A Records:

**Root Domain (kmrsimkhada.com):**
- Record Name: (leave empty)
- Record Type: A
- Alias: Yes
- Route traffic to: CloudFront distribution
- Distribution: Select your CloudFront distribution

**WWW Subdomain (www.kmrsimkhada.com):**
- Record Name: www
- Record Type: A
- Alias: Yes
- Route traffic to: CloudFront distribution
- Distribution: Select your CloudFront distribution

## Step 4: Update Nameservers

If your domain is registered elsewhere, update nameservers to Route 53:
- Copy the 4 nameservers from your Route 53 hosted zone
- Update them in your domain registrar's settings

## Step 5: Test Your Setup

After DNS propagation (can take up to 48 hours):
- https://kmrsimkhada.com
- https://www.kmrsimkhada.com

Both should work with HTTPS and redirect properly.