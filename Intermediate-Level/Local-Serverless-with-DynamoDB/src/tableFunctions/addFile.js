import { DynamoDB } from 'aws-sdk';
import { readFile } from 'fs/promises';
import awsPermissions from '../authentication/awsPermissions';

awsPermissions();

function addFileToDB(docClient, allMovies) {
  return new Promise((resolve, reject) => {
    const params = [];
    const movieTitles = [];
    allMovies.forEach((movie) => {
      params.push({
        TableName: 'Movies',
        Item: {
          year: movie.year,
          title: movie.title,
          info: movie.info,
        },
      });
    });

    for (let i = 0; i < params.length; i += 1) {
      movieTitles.push(params[i].Item.title);
      docClient.put(params[i], (err) => {
        if (err) {
          reject(err);
        } else if (i === params.length - 1) {
          resolve(movieTitles);
        }
      });
    }
  });
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async () => {
  try {
    const docClient = new DynamoDB.DocumentClient();
    const moviesFile = await readFile('./src/data/moviedata.json', 'utf-8');
    const allMovies = JSON.parse(moviesFile);
    const result = await addFileToDB(docClient, allMovies);
    return ({
      statusCode: 200,
      body: JSON.stringify({
        message: 'New Movies have been added with the following titles:-',
        input: result,
      },
      null,
      2),
    });
  } catch (err) {
    return ({
      statusCode: 400,
      body: JSON.stringify({
        message: 'The movies couldn\'t be added for the following reason:-',
        input: err.message,
      },
      null,
      2),
    });
  }
};
