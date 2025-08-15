#!/bin/bash

BUCKET_NAME="kmrsimkhada.com"
REGION="ap-southeast-2"

echo "🔧 Fixing S3 permissions for $BUCKET_NAME..."

# Step 1: Unblock public access
echo "1️⃣ Removing public access block..."
aws s3api delete-public-access-block --bucket $BUCKET_NAME

# Step 2: Create and apply bucket policy
echo "2️⃣ Creating bucket policy..."
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

# Step 3: Configure website hosting
echo "3️⃣ Configuring static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Step 4: Re-sync files with proper permissions
echo "4️⃣ Re-uploading files with public-read ACL..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete --acl public-read

echo "✅ S3 permissions fixed!"
echo "🌐 Your website should now be accessible at:"
echo "   http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

# Clean up
rm bucket-policy.json