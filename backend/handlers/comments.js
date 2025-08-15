const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const COMMENTS_TABLE = process.env.COMMENTS_TABLE;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
};

module.exports.getByArticle = async (event) => {
  try {
    const { articleId } = event.pathParameters;

    const result = await dynamodb.query({
      TableName: COMMENTS_TABLE,
      IndexName: 'ArticleIndex',
      KeyConditionExpression: 'articleId = :articleId',
      ExpressionAttributeValues: {
        ':articleId': articleId,
      },
    }).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports.create = async (event) => {
  try {
    const { articleId } = event.pathParameters;
    const data = JSON.parse(event.body);
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    const comment = {
      id,
      articleId,
      ...data,
      timestamp,
      likes: 0,
    };

    await dynamodb.put({
      TableName: COMMENTS_TABLE,
      Item: comment,
    }).promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(comment),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};