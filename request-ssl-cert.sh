#!/bin/bash

DOMAIN_NAME="kmrsimkhada.com"
WWW_DOMAIN="www.kmrsimkhada.com"

echo "🔐 Requesting SSL certificate for $DOMAIN_NAME..."

# Request certificate in us-east-1 (required for CloudFront)
CERT_ARN=$(aws acm request-certificate \
    --domain-name $DOMAIN_NAME \
    --subject-alternative-names $WWW_DOMAIN \
    --validation-method DNS \
    --region us-east-1 \
    --query 'CertificateArn' \
    --output text)

echo "✅ Certificate requested!"
echo "📋 Certificate ARN: $CERT_ARN"
echo ""
echo "🔧 Next steps:"
echo "1. Go to AWS Certificate Manager (us-east-1 region)"
echo "2. Find your certificate: $CERT_ARN"
echo "3. Click 'Create records in Route 53' to validate"
echo "4. Wait for validation to complete (5-10 minutes)"
echo ""
echo "💡 After validation, run: ./create-cloudfront.sh"