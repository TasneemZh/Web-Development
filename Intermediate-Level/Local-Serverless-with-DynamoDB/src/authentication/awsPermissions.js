import { config } from 'aws-sdk';

// This is the security token that is needed for Lambda functions to perform operations on the DB
const awsPermissions = async () => config.update({
  region: 'us-east-1',
  accessKeyId: '1234',
  secretAccessKey: '5678',
  endpoint: 'http://localhost:8000',
});

export default awsPermissions;
