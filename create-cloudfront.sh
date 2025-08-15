#!/bin/bash

BUCKET_NAME="kmrsimkhada.com"
DOMAIN_NAME="kmrsimkhada.com"
WWW_DOMAIN="www.kmrsimkhada.com"
REGION="ap-southeast-2"

echo "☁️ Creating CloudFront distribution..."

# Get the latest certificate ARN
CERT_ARN=$(aws acm list-certificates --region us-east-1 --query "CertificateSummaryList[?DomainName=='$DOMAIN_NAME'].CertificateArn" --output text)

if [ -z "$CERT_ARN" ]; then
    echo "❌ No validated certificate found for $DOMAIN_NAME"
    echo "Please run ./request-ssl-cert.sh first and validate the certificate"
    exit 1
fi

echo "📋 Using certificate: $CERT_ARN"

# Create CloudFront distribution
cat > cloudfront-config.json << EOF
{
    "CallerReference": "$(date +%s)",
    "Comment": "CloudFront distribution for $DOMAIN_NAME",
    "DefaultRootObject": "index.html",
    "Aliases": {
        "Quantity": 2,
        "Items": ["$DOMAIN_NAME", "$WWW_DOMAIN"]
    },
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
            "Quantity": 2,
            "Items": ["GET", "HEAD"],
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
    "PriceClass": "PriceClass_100",
    "ViewerCertificate": {
        "ACMCertificateArn": "$CERT_ARN",
        "SSLSupportMethod": "sni-only",
        "MinimumProtocolVersion": "TLSv1.2_2021"
    }
}
EOF

# Create the distribution
DISTRIBUTION_RESULT=$(aws cloudfront create-distribution --distribution-config file://cloudfront-config.json --output json)
DISTRIBUTION_ID=$(echo $DISTRIBUTION_RESULT | jq -r '.Distribution.Id')
DISTRIBUTION_DOMAIN=$(echo $DISTRIBUTION_RESULT | jq -r '.Distribution.DomainName')

echo "✅ CloudFront distribution created!"
echo "📋 Distribution ID: $DISTRIBUTION_ID"
echo "🌐 CloudFront Domain: $DISTRIBUTION_DOMAIN"
echo ""
echo "⏳ Distribution is deploying (takes 10-15 minutes)..."
echo ""
echo "🔧 Next steps:"
echo "1. Wait for distribution to deploy"
echo "2. Test: https://$DISTRIBUTION_DOMAIN"
echo "3. Set up DNS: ./setup-dns.sh $DISTRIBUTION_ID"

# Clean up
rm cloudfront-config.json

echo ""
echo "💡 Your secure website will be available at:"
echo "   https://$DOMAIN_NAME"
echo "   https://$WWW_DOMAIN"