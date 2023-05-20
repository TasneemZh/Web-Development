import { DynamoDB } from 'aws-sdk';
import awsPermissions from '../authentication/awsPermissions';

awsPermissions();

function createTableInDB(dynamoDB) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'Movies',
      KeySchema: [
        { AttributeName: 'year', KeyType: 'HASH' },
        { AttributeName: 'title', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'year', AttributeType: 'N' },
        { AttributeName: 'title', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
    };

    dynamoDB.createTable(params, (err) => {
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
    const dynamoDB = new DynamoDB();
    const result = await createTableInDB(dynamoDB);
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Created successfully the table with the following name:-',
        input: result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'Error! Couldn\'t create table for the following reason:-',
        input: err.message,
      },
      null,
      2),
    });
  }
};
