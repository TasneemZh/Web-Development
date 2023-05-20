const express = require('express');
const importedArr = require('./data');

const app = express();

app.use(express.urlencoded({ extended: true }));

function customMap(array, callback) {
  const resultArr = [];
  for (let i = 0; i < array.length; i += 1) {
    resultArr.push(callback(array[i], i));
  }
  return resultArr;
}

app.get('/', (req, res) => {
  try {
    const eldersToBe = importedArr.module;
    const result = customMap(eldersToBe, (elder, order) => Object.assign(elder, {
      age: elder.age * (order + 1),
    }));
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('The server is running on port 3000');
});
