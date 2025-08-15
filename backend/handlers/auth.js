const AWS = require('aws-sdk');

const ssm = new AWS.SSM();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
};

// Get credentials from Parameter Store
async function getCredentials() {
  try {
    const params = {
      Names: [
        '/portfolio/admin/username',
        '/portfolio/admin/password'
      ],
      WithDecryption: true
    };
    
    const result = await ssm.getParameters(params).promise();
    
    const credentials = {};
    result.Parameters.forEach(param => {
      if (param.Name === '/portfolio/admin/username') {
        credentials.username = param.Value;
      } else if (param.Name === '/portfolio/admin/password') {
        credentials.password = param.Value;
      }
    });
    
    return credentials;
  } catch (error) {
    console.error('Failed to get credentials from Parameter Store:', error);
    // Fallback to environment variables for initial setup
    return {
      username: process.env.ADMIN_USERNAME || 'kumar',
      password: process.env.ADMIN_PASSWORD || 'kumar2024admin'
    };
  }
}

// Update credentials in Parameter Store
async function updateCredentials(newUsername, newPassword) {
  try {
    const params = [
      {
        Name: '/portfolio/admin/username',
        Value: newUsername,
        Type: 'SecureString',
        Overwrite: true
      },
      {
        Name: '/portfolio/admin/password',
        Value: newPassword,
        Type: 'SecureString',
        Overwrite: true
      }
    ];
    
    for (const param of params) {
      await ssm.putParameter(param).promise();
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update credentials in Parameter Store:', error);
    return false;
  }
}

module.exports.login = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);
    const credentials = await getCredentials();

    if (username === credentials.username && password === credentials.password) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Login successful',
          user: { username },
        }),
      };
    } else {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials',
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports.changeCredentials = async (event) => {
  try {
    const { currentUsername, currentPassword, newUsername, newPassword } = JSON.parse(event.body);
    const credentials = await getCredentials();

    // Verify current credentials
    if (currentUsername !== credentials.username || currentPassword !== credentials.password) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Current credentials are incorrect',
        }),
      };
    }

    // Validate new credentials
    if (!newPassword || newPassword.length < 8) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'New password must be at least 8 characters long',
        }),
      };
    }

    // Update credentials in Parameter Store
    const updateSuccess = await updateCredentials(
      newUsername || currentUsername,
      newPassword
    );

    if (updateSuccess) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Credentials updated successfully',
          newCredentials: {
            username: newUsername || currentUsername,
          }
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Failed to update credentials in secure storage',
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};