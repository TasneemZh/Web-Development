// Node.js packages
const express = require('express');
const fs = require('fs');
const path = require('path');
const Pokedex = require('pokedex-promise-v2');

const app = express();

// Server code
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.static('public'));

// Pokedex Setup
const options = {
  protocol: 'https',
  hostName: 'pokeapi.co:443',
  versionPath: '/api/v2/',
  cacheLimit: 100 * 1000, // 100s
  timeout: 5 * 1000, // 5s
};
// Link: https://pokeapi.co:443/api/v2/pokemon/[id]
const P = new Pokedex(options);

const PageError = {
  code: 0,
  msg: '',
};

// Arrays
const pokemonDetails = require('./data/pokemonDetails');
const pokemonImages = require('./data/pokemonImages');
const pokemonIcons = require('./data/pokemonIcons');

// Local DB
const checkboxArr = [];
const checkResults = require('./data/checkResults');

// Constants
const MAX = 809; // Pokemons maximum number with available images

// Functions
function getRandomInt() {
  return (Math.floor(Math.random() * MAX) + 1); // Starts from 1
}

// CheckBox Function
function checkBox(id, i) {
  let foundId = false;

  // If the pokemon id exists in the local DB, then it must get checked - it not, leave it unchecked
  // console.log(checkboxArr);
  checkboxArr.every((member) => {
    if (member === id) {
      checkResults[i] = 'checked';
      foundId = true;
      return false;
    }
    return true;
  });

  if (!foundId) {
    checkResults[i] = '';
  }
  // console.log(`Result in find function: ${checkResults[i]}`);
}

function createDetails(randomNum, i) {
  P.resource(`api/v2/pokemon/${randomNum}`)
    .then((response) => {
      pokemonDetails[i] = response;
      // console.log(`pokemonDetails #${i} has been set to the id #${response.id}`);
      return response.id;
    }).catch(() => {
      console.log('Error in creating pokemon details!');
    });
}

function createImage(randomNum, i, res) {
  let imgUrl;
  // Getting the images name ready based on the random number
  if (randomNum < 10) {
    imgUrl = `00${randomNum.toString()}`;
  } else if (randomNum < 100) {
    imgUrl = `0${randomNum.toString()}`;
  } else {
    imgUrl = randomNum.toString();
  }

  // Read Pokemon image file
  fs.readFile(`public/images/thumbnails/${imgUrl}.png`, (err, data) => {
    // error handle
    if (err) res.status(500).send(err);
    // get image file extension name
    const extensionName = path.extname(`public/images/thumbnails/${imgUrl}.png`);
    // convert image file to base64-encoded string
    const base64Image = Buffer.from(data).toString('base64');
    // combine all strings
    const pokemonImg = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;

    pokemonImages[i] = pokemonImg;
  });

  // Read Pokemon icon file
  fs.readFile(`public/images/sprites/${imgUrl}MS.png`, (err, data) => {
    // error handle
    if (err) res.status(500).send(err);
    // get image file extension name
    const extensionName = path.extname(`public/images/sprites/${imgUrl}MS.png`);
    // convert image file to base64-encoded string
    const base64Image = Buffer.from(data).toString('base64');
    // combine all strings
    const pokemonIcon = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;

    pokemonIcons[i] = pokemonIcon;
  });
}

// Get Method(s)
app.get('/', (req, res) => {
  let randomNum;
  let pokemonId;

  // 8 Random Pokemons details
  for (let i = 0; i < 8; i += 1) {
    randomNum = getRandomInt();
    pokemonId = createDetails(randomNum, i);
    createImage(randomNum, i, res);
    checkBox(pokemonId, i);
  }

  res.render('home',
    {
      maxDisplay: 8, pokemonDetails, pokemonImages, pokemonIcons, checkResults,
    }); // send image src string into jade compiler + other details
});

app.get('/search', (req, res) => {
  res.render('home',
    {
      maxDisplay: 1, pokemonDetails, pokemonImages, pokemonIcons, checkResults,
    }); // send image src string into jade compiler + other details
});

app.get('/notfound', (req, res) => {
  res.status(PageError.code).render('notfound', { msg: PageError.msg });
});

// Post Method(s)
app.post('/search', (req, res) => {
  // search box method
  let searchValue = req.body.search_input;
  if (searchValue.length < 3) {
    PageError.code = 400;
    PageError.msg = 'Name minimum length shouldn\'t be less than 3!';
    res.redirect('/notfound');
    return;
  }

  searchValue = searchValue.toLowerCase();
  let found = false;
  const interval = {
    limit: 809,
    offset: 0,
  };

  P.getPokemonsList(interval)
    .then((response) => {
      response.results.forEach((member, index) => {
        if (searchValue === member.name) {
          createDetails(index + 1, 0);
          createImage(index + 1, 0, res);
          checkBox(index + 1, 0);
          found = true;
          setTimeout(() => {
            res.redirect('/search');
          }, 5000); // wait 5 seconds to let the above (and below) processing complete
        }
      });
      if (!found) {
        PageError.code = 404;
        PageError.msg = `The name "${searchValue}" is not found...`;
        res.redirect('/notfound');
      }
    });
});

app.post('/checked', (req) => {
  const checkId = req.body.check;
  const uncheckId = req.body.hiddenInput;

  if (checkId !== undefined) { // Clicked
    checkboxArr.push(parseInt(checkId, 10));
    // console.log(`${checkId} has been pushed`);
    // console.log(checkboxArr);
  } else {
    checkboxArr.every((member, index) => {
      if (member === uncheckId) {
        checkboxArr.splice(index, 1);
        // console.log(`${index} has been deleted`);
        // console.log(checkboxArr);
        return false;
      }
      return true; // To continue looping
    });
  }
});

// Put Method

// Server Configuration
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`The server is running on port ${port} successfully!`);
});

server.on('clientError', (err, socket) => {
  console.error(err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
