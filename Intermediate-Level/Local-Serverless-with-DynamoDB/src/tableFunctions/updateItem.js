import { DynamoDB } from 'aws-sdk';
import awsPermissions from '../authentication/awsPermissions';

awsPermissions();

function updateItemInDB(event, docClient) {
  return new Promise((resolve, reject) => {
    const { year, title, info } = JSON.parse(event.body);

    const keyParams = {
      TableName: 'Movies',
      Key: {
        year,
        title,
      },
    };

    docClient.get(keyParams, (err, data) => {
      if (err) {
        reject(err);
      } else if (JSON.stringify(data) === '{}') {
        reject(new Error('The keys don\'t match any of the data in the database'));
      }
    });

    const params = {
      TableName: 'Movies',
      Key: {
        year,
        title,
      },
      UpdateExpression: 'set info=:info',
      ExpressionAttributeValues: {
        ':info': info,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    docClient.update(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          TableName: 'Movies',
          Key: {
            year,
            title,
          },
          info,
        });
      }
    });
  });
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event) => {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const result = await updateItemInDB(event, docClient);
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'The movie with the selected keys has been updated as follows:-',
        input: result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'Error! The movie couldn\'t be updated for the following reason:-',
        input: err.message,
      },
      null,
      2),
    });
  }
};
