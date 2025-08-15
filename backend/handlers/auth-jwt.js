const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
};

module.exports.login = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    // Get user from database
    const result = await dynamodb.get({
      TableName: USERS_TABLE,
      Key: { username },
    }).promise();

    if (!result.Item) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials',
        }),
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, result.Item.passwordHash);
    
    if (!isValidPassword) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials',
        }),
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: result.Item.username,
        role: result.Item.role || 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Login successful',
        token,
        user: {
          username: result.Item.username,
          role: result.Item.role || 'admin'
        }
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports.verifyToken = async (event) => {
  try {
    const token = event.headers.Authorization?.replace('Bearer ', '');
    
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'No token provided' }),
      };
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: true,
        user: decoded
      }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid token' }),
    };
  }
};

module.exports.createUser = async (event) => {
  try {
    const { username, password, role = 'admin' } = JSON.parse(event.body);
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Store user
    await dynamodb.put({
      TableName: USERS_TABLE,
      Item: {
        username,
        passwordHash,
        role,
        createdAt: new Date().toISOString()
      },
    }).promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'User created successfully'
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};