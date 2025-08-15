#!/bin/bash

echo "🔐 Secure Backend Deployment"
echo "This deployment requires admin credentials to be set."
echo ""

# Check if environment variables are already set
if [ -z "$ADMIN_USERNAME" ] || [ -z "$ADMIN_PASSWORD" ]; then
    echo "⚠️  Admin credentials not found in environment variables."
    echo ""
    
    # Prompt for credentials
    read -p "Enter admin username: " ADMIN_USERNAME
    read -s -p "Enter admin password: " ADMIN_PASSWORD
    echo
    read -s -p "Confirm admin password: " CONFIRM_PASSWORD
    echo
    
    if [ "$ADMIN_PASSWORD" != "$CONFIRM_PASSWORD" ]; then
        echo "❌ Passwords don't match!"
        exit 1
    fi
    
    # Export for this session
    export ADMIN_USERNAME
    export ADMIN_PASSWORD
fi

echo "🚀 Deploying backend with secure credentials..."
echo "👤 Username: $ADMIN_USERNAME"
echo "🔑 Password: [hidden]"
echo ""

# Deploy
cd backend
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ Backend deployed successfully!"
    echo ""
    echo "🔐 Security Notes:"
    echo "   - Credentials are stored as environment variables in AWS Lambda"
    echo "   - No hardcoded credentials in source code"
    echo "   - Credentials are encrypted at rest in AWS"
    echo ""
    echo "💡 To change credentials later, run this script again with new values"
else
    echo "❌ Deployment failed!"
    exit 1
fi