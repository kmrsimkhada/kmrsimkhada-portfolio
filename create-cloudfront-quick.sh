#!/bin/bash

BUCKET_NAME="kmrsimkhada.com"
REGION="ap-southeast-2"

echo "☁️ Creating CloudFront distribution (without custom domain for now)..."

# Create CloudFront distribution configuration
cat > cloudfront-config-quick.json << EOF
{
    "CallerReference": "$(date +%s)",
    "Comment": "CloudFront distribution for $BUCKET_NAME",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-Website-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-Website-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 7,
            "Items": ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"],
            "CachedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
            }
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "CustomErrorPages": {
        "Quantity": 2,
        "Items": [
            {
                "ErrorCode": 403,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            },
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
}
EOF

# Create the distribution
echo "🚀 Creating CloudFront distribution..."
DISTRIBUTION_RESULT=$(aws cloudfront create-distribution --distribution-config file://cloudfront-config-quick.json --output json)
DISTRIBUTION_ID=$(echo $DISTRIBUTION_RESULT | jq -r '.Distribution.Id')
DISTRIBUTION_DOMAIN=$(echo $DISTRIBUTION_RESULT | jq -r '.Distribution.DomainName')

echo "✅ CloudFront distribution created!"
echo "📋 Distribution ID: $DISTRIBUTION_ID"
echo "🌐 CloudFront Domain: $DISTRIBUTION_DOMAIN"
echo ""
echo "⏳ Distribution is deploying (takes 10-15 minutes)..."
echo ""
echo "🔗 Your HTTPS website will be available at:"
echo "   https://$DISTRIBUTION_DOMAIN"
echo ""
echo "💡 Test it in 10-15 minutes, then we'll add your custom domain!"

# Clean up
rm cloudfront-config-quick.json

echo ""
echo "📝 Next steps:"
echo "1. Wait 10-15 minutes for CloudFront to deploy"
echo "2. Test: https://$DISTRIBUTION_DOMAIN"
echo "3. We'll add custom domain once SSL cert is validated"