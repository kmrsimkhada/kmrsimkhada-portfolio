# Quick Domain Setup Options

## Option 1: Use Your Domain Registrar (Fastest - 5 minutes)

1. **Go to your domain registrar** (where you bought kmrsimkhada.com)
2. **Add DNS Records:**
   - **CNAME Record:** `www` → `kmrsimkhada.com.s3-website-ap-southeast-2.amazonaws.com`
   - **A Record:** `@` → `52.95.110.1` (S3 website IP for ap-southeast-2)

3. **Result:** Your domain will work in 5-10 minutes!

## Option 2: Create CloudFront Manually (10 minutes)

1. **Go to:** https://console.aws.amazon.com/cloudfront/
2. **Create Distribution** with these settings:
   - Origin: `kmrsimkhada.com.s3-website-ap-southeast-2.amazonaws.com`
   - Viewer Protocol: Redirect HTTP to HTTPS
   - Error Pages: 403/404 → /index.html (200)

## Option 3: Use Netlify/Vercel (2 minutes)

1. **Push code to GitHub**
2. **Connect to Netlify/Vercel**
3. **Add custom domain**
4. **Done!**

## Current Working URLs:

- **S3 Website:** http://kmrsimkhada.com.s3-website-ap-southeast-2.amazonaws.com
- **Admin Panel:** http://kmrsimkhada.com.s3-website-ap-southeast-2.amazonaws.com/admin

## Recommendation:

**Use Option 1** - it's the fastest way to get your custom domain working while we set up proper CloudFront later.