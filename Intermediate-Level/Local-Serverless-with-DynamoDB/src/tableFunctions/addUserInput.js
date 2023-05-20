import { DynamoDB } from 'aws-sdk';
import awsPermissions from '../authentication/awsPermissions';

awsPermissions();

function addInputToDB(event, docClient) {
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
      } else if (JSON.stringify(data) !== '{}') {
        reject(new Error('There is a movie with the same keys in the database'));
      }
    });

    const params = {
      TableName: 'Movies',
      Item: {
        year,
        title,
        info,
      },
    };

    docClient.put(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(params);
      }
    });
  });
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event) => {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const result = await addInputToDB(event, docClient);
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'A new movie based on your inputs has been added as follows:-',
        input: result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'The movie couldn\'t be added for the following reason:-',
        input: err.message,
      },
      null,
      2),
    });
  }
};
