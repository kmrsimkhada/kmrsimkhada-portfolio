#!/bin/bash

# Frontend Deployment Script for AWS S3 + CloudFront
# Make sure you have AWS CLI configured

BUCKET_NAME="kmrsimkhada.com"
REGION="ap-southeast-2"

echo "🚀 Starting frontend deployment..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "☁️ Deploying to AWS..."

# Check if bucket exists, create if not
if ! aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo "📦 Bucket $BUCKET_NAME already exists"
else
    echo "📦 Creating S3 bucket: $BUCKET_NAME"
    aws s3 mb s3://$BUCKET_NAME --region $REGION
    
    # Configure bucket for static website hosting
    aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html
    
    # Set bucket policy for public read access
    cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
    rm bucket-policy.json
fi

# Sync files to S3
echo "📤 Uploading files to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete \
    --cache-control "max-age=31536000" \
    --exclude "*.html"

# Upload HTML files with no-cache headers
aws s3 sync dist/ s3://$BUCKET_NAME --delete \
    --cache-control "max-age=0, no-cache, no-store, must-revalidate" \
    --include "*.html"

echo "✅ Frontend deployed successfully!"
echo "🌐 Your website is available at:"
echo "   S3 Website: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo ""
echo "🚀 Next steps:"
echo "   1. Set up CloudFront distribution for CDN and HTTPS"
echo "   2. Configure Route 53 for custom domain"
echo "   3. Request SSL certificate in AWS Certificate Manager"