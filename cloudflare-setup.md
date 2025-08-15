# 🚀 Quick HTTPS Setup with Cloudflare (5 minutes)

## Step 1: Sign up for Cloudflare (Free)
1. Go to https://cloudflare.com
2. Sign up for free account
3. Add your domain: `kmrsimkhada.com`

## Step 2: Change Nameservers
Cloudflare will give you 2 nameservers like:
- `alice.ns.cloudflare.com`
- `bob.ns.cloudflare.com`

Update these in AWS Route 53:
1. Go to Route 53 Console
2. Find your hosted zone: `kmrsimkhada.com`
3. Update NS record with Cloudflare nameservers

## Step 3: Configure DNS in Cloudflare
Add these DNS records in Cloudflare:
- **A Record:** `@` → `52.95.132.161` (your current IP)
- **CNAME:** `www` → `kmrsimkhada.com`

## Step 4: Enable HTTPS
In Cloudflare dashboard:
1. Go to SSL/TLS tab
2. Set to "Flexible" or "Full"
3. Enable "Always Use HTTPS"

## Result: Instant HTTPS! ⚡
- https://kmrsimkhada.com ✅
- https://www.kmrsimkhada.com ✅