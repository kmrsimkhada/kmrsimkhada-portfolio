#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./setup-dns.sh <DISTRIBUTION_ID>"
    echo "Example: ./setup-dns.sh E1234567890ABC"
    exit 1
fi

DISTRIBUTION_ID=$1
DOMAIN_NAME="kmrsimkhada.com"
WWW_DOMAIN="www.kmrsimkhada.com"

echo "🌐 Setting up DNS for CloudFront distribution: $DISTRIBUTION_ID"

# Get CloudFront domain name
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)
echo "📋 CloudFront Domain: $CLOUDFRONT_DOMAIN"

# Check if hosted zone exists
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='$DOMAIN_NAME.'].Id" --output text | cut -d'/' -f3)

if [ -z "$HOSTED_ZONE_ID" ]; then
    echo "📝 Creating Route 53 hosted zone for $DOMAIN_NAME..."
    HOSTED_ZONE_RESULT=$(aws route53 create-hosted-zone --name $DOMAIN_NAME --caller-reference $(date +%s) --output json)
    HOSTED_ZONE_ID=$(echo $HOSTED_ZONE_RESULT | jq -r '.HostedZone.Id' | cut -d'/' -f3)
    
    echo "✅ Hosted zone created: $HOSTED_ZONE_ID"
    echo "📋 Nameservers:"
    echo $HOSTED_ZONE_RESULT | jq -r '.DelegationSet.NameServers[]'
    echo ""
    echo "⚠️  IMPORTANT: Update these nameservers at your domain registrar!"
else
    echo "✅ Using existing hosted zone: $HOSTED_ZONE_ID"
fi

# Create A record for root domain
echo "📝 Creating A record for $DOMAIN_NAME..."
cat > change-batch-root.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$DOMAIN_NAME",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "$CLOUDFRONT_DOMAIN",
                    "EvaluateTargetHealth": false,
                    "HostedZoneId": "Z2FDTNDATAQYW2"
                }
            }
        }
    ]
}
EOF

aws route53 change-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --change-batch file://change-batch-root.json

# Create A record for www subdomain
echo "📝 Creating A record for $WWW_DOMAIN..."
cat > change-batch-www.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$WWW_DOMAIN",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "$CLOUDFRONT_DOMAIN",
                    "EvaluateTargetHealth": false,
                    "HostedZoneId": "Z2FDTNDATAQYW2"
                }
            }
        }
    ]
}
EOF

aws route53 change-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --change-batch file://change-batch-www.json

echo "✅ DNS records created!"
echo ""
echo "🎉 Setup complete! Your secure website will be available at:"
echo "   https://$DOMAIN_NAME"
echo "   https://$WWW_DOMAIN"
echo ""
echo "⏳ DNS propagation may take up to 48 hours"
echo "🔍 Test CloudFront directly: https://$CLOUDFRONT_DOMAIN"

# Clean up
rm change-batch-root.json change-batch-www.json