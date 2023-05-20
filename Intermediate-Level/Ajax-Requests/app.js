require('dotenv').config();
const express = require('express');
const { join } = require('path');
const fetch = require('node-fetch');
const { writeFile, appendFile, readFile } = require('fs/promises');
const browserify = require('browserify');
const { createWriteStream } = require('fs');
const axios = require('axios');

const app = express();

app.use(express.static(join(__dirname, '/public')));

async function downloadImage() { // or use axios: https://masteringjs.io/tutorials/axios/response-body
  try {
    const response = await fetch(process.env.IMAGE_URL);
    const buffer = await response.buffer();
    const destImage = join(__dirname, '/public', 'images', 'news.jpg');
    await writeFile(destImage, buffer, (error) => {
      if (error) {
        throw new Error(error);
      }
    });
  } catch (error) {
    console.error(`Well, errors can happen: ${error.message}`);
  }
}

async function getImageStyle() {
  try {
    const axiosConfig = {
      headers: {
        'Content-Type': 'text/css; charset=UTF-8',
      },
    };
    const styleObject = await axios.get(process.env.CSS_URL, axiosConfig).then((res) => {
      const startIndex = res.data.search('.img_style');
      const startText = res.data.substr(startIndex);
      const endIndex = startText.search('}');
      const imageStyle = res.data.substr(startIndex, endIndex + 1);
      return imageStyle;
    });

    const destStyle = join(__dirname, '/public', 'css', 'styles.css');
    const stylesFile = await readFile(destStyle, 'utf8');
    if (stylesFile.search(styleObject) === -1) {
      await appendFile(destStyle, `\n\n${styleObject}`, (error) => {
        if (error) {
          throw new Error(error);
        }
      });
    }
  } catch (error) {
    console.error(`Well, errors can happen: ${error.message}`);
  }
}

function bundleFiles() {
  try {
    const bundled = browserify();
    bundled.add(join(__dirname, '/public', 'js', 'click-event.js'));
    const destFile = join(__dirname, '/public', 'js', 'bundle.js');
    const writable = createWriteStream(destFile);
    bundled.bundle().pipe(writable);
  } catch (error) {
    console.error(`Well, errors can happen: ${error.message}`);
  }
}

app.get('/', (_, res) => Promise.all([downloadImage(), getImageStyle(), bundleFiles()]).then(() => {
  res.sendFile(join(__dirname, '/public', 'home.html'));
}));

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`The server is running on ${port}`);
});
