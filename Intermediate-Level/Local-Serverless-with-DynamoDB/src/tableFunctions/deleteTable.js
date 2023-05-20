import { DynamoDB } from 'aws-sdk';
import awsPermissions from '../authentication/awsPermissions';

awsPermissions();

function deleteTableInDB(dynamodb) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'Movies',
    };

    dynamodb.deleteTable(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(params.TableName);
      }
    });
  });
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async () => {
  try {
    const dynamodb = new DynamoDB();
    const result = await deleteTableInDB(dynamodb);
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Deleted successfully the table with the following name:-',
        input: result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'Couldn\'t delete the table for the following reason:-',
        input: err.message,
      },
      null,
      2),
    });
  }
};
