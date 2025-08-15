#!/bin/bash

# Portfolio Deployment Script
# Make sure you have AWS CLI configured with proper credentials

echo "🚀 Starting deployment to AWS S3..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Sync to S3 bucket
echo "☁️ Uploading to S3..."
aws s3 sync dist/ s3://kmrsimkhada.com --delete --cache-control "max-age=31536000" --exclude "*.html"
aws s3 sync dist/ s3://kmrsimkhada.com --delete --cache-control "max-age=0, no-cache, no-store, must-revalidate" --include "*.html"

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 Your site should be live at: https://www.kmrsimkhada.com"