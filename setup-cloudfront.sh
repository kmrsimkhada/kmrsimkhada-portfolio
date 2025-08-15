#!/bin/bash

# CloudFront and Domain Setup Script
BUCKET_NAME="kmrsimkhada.com"
DOMAIN_NAME="kmrsimkhada.com"
WWW_DOMAIN="www.kmrsimkhada.com"
REGION="ap-southeast-2"

echo "🚀 Setting up CloudFront and Domain Configuration..."

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "📋 AWS Account ID: $ACCOUNT_ID"

# Step 1: Create CloudFront Origin Access Control
echo "🔐 Creating Origin Access Control..."
OAC_CONFIG='{
    "Name": "kmrsimkhada-oac",
    "Description": "OAC for kmrsimkhada.com S3 bucket",
    "OriginAccessControlOriginType": "s3",
    "SigningBehavior": "always",
    "SigningProtocol": "sigv4"
}'

OAC_RESULT=$(aws cloudfront create-origin-access-control --origin-access-control-config "$OAC_CONFIG" --output json)
OAC_ID=$(echo $OAC_RESULT | jq -r '.OriginAccessControl.Id')
echo "✅ Created OAC with ID: $OAC_ID"

# Step 2: Create CloudFront Distribution Configuration
echo "☁️ Creating CloudFront distribution configuration..."

cat > cloudfront-config.json << EOF
{
    "CallerReference": "$(date +%s)",
    "Comment": "CloudFront distribution for $DOMAIN_NAME",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3.$REGION.amazonaws.com",
                "OriginPath": "",
                "CustomOriginConfig": null,
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                },
                "OriginAccessControlId": "$OAC_ID"
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
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
    "PriceClass": "PriceClass_All"
}
EOF

echo "📋 CloudFront configuration created. Please complete these manual steps:"
echo ""
echo "🔧 MANUAL STEPS REQUIRED:"
echo "1. Go to AWS Certificate Manager (ACM) in us-east-1 region"
echo "2. Request a certificate for:"
echo "   - $DOMAIN_NAME"
echo "   - $WWW_DOMAIN"
echo "3. Validate the certificate using DNS validation"
echo ""
echo "4. Go to CloudFront Console and create distribution with:"
echo "   - Origin: $BUCKET_NAME.s3.$REGION.amazonaws.com"
echo "   - OAC ID: $OAC_ID"
echo "   - Custom SSL Certificate: Your ACM certificate"
echo "   - CNAMEs: $DOMAIN_NAME, $WWW_DOMAIN"
echo ""
echo "5. After CloudFront is deployed, update S3 bucket policy:"

# Generate S3 bucket policy template
cat > s3-bucket-policy-template.json << EOF
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
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "arn:aws:cloudfront::$ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
                }
            }
        }
    ]
}
EOF

echo "📄 S3 bucket policy template created: s3-bucket-policy-template.json"
echo "   Replace YOUR_DISTRIBUTION_ID with your actual CloudFront distribution ID"
echo ""
echo "6. Set up Route 53 DNS records:"
echo "   - Create A record for $DOMAIN_NAME pointing to CloudFront"
echo "   - Create A record for $WWW_DOMAIN pointing to CloudFront"
echo ""
echo "🌐 After setup, your site will be available at:"
echo "   - https://$DOMAIN_NAME"
echo "   - https://$WWW_DOMAIN"

# Clean up
rm cloudfront-config.json

echo ""
echo "✅ Setup script completed!"
echo "📖 See setup-cloudfront.md for detailed manual steps"