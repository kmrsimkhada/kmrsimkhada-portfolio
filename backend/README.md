# Portfolio Backend API

This is the serverless backend for Kumar's portfolio website using AWS Lambda, DynamoDB, and API Gateway.

## Prerequisites

1. **AWS CLI** configured with your credentials
2. **Node.js** (v18 or later)
3. **Serverless Framework**

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install Serverless Framework globally:**
   ```bash
   npm install -g serverless
   ```

3. **Configure AWS credentials:**
   ```bash
   aws configure
   ```

## Deployment

1. **Deploy to AWS:**
   ```bash
   npm run deploy
   ```

2. **Note the API Gateway URL** from the deployment output. You'll need this for your frontend.

3. **Update your frontend API configuration** in `src/services/api.ts` with the deployed API Gateway URL.

## Local Development

1. **Run locally:**
   ```bash
   npm run local
   ```

2. **The API will be available at:** `http://localhost:3000`

## API Endpoints

### Articles
- `GET /articles` - Get all articles
- `GET /articles/{id}` - Get single article
- `POST /articles` - Create article
- `PUT /articles/{id}` - Update article
- `DELETE /articles/{id}` - Delete article

### Books
- `GET /books` - Get all books
- `POST /books` - Create book
- `PUT /books/{id}` - Update book
- `DELETE /books/{id}` - Delete book

### Locations
- `GET /locations` - Get all locations
- `POST /locations` - Create location
- `PUT /locations/{id}` - Update location
- `DELETE /locations/{id}` - Delete location

### Comments
- `GET /articles/{articleId}/comments` - Get comments for article
- `POST /articles/{articleId}/comments` - Create comment

### Auth
- `POST /admin/login` - Admin login

## Database Tables

The deployment creates these DynamoDB tables:
- `portfolio-backend-articles-dev`
- `portfolio-backend-books-dev`
- `portfolio-backend-locations-dev`
- `portfolio-backend-comments-dev`

## Environment Variables

The following environment variables are automatically set:
- `ARTICLES_TABLE`
- `BOOKS_TABLE`
- `LOCATIONS_TABLE`
- `COMMENTS_TABLE`

## Cost Optimization

- Uses **PAY_PER_REQUEST** billing mode for DynamoDB
- Lambda functions only run when called
- API Gateway charges per request
- Estimated cost: **$1-5/month** for typical usage

## Security

- CORS enabled for your domain
- Admin authentication (basic implementation)
- IAM roles with minimal required permissions

## Next Steps

1. Deploy the backend
2. Update frontend API configuration
3. Test all endpoints
4. Deploy frontend to S3/CloudFront
5. Configure custom domain