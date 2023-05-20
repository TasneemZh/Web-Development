const express = require('express');
const people = require('./data');

const app = express();

app.use(express.urlencoded({ extended: true }));

function checkUserParamters(peopleInfo) {
  const peopleArr = people.module;
  const {
    id, name, gender, favColor, age, country,
  } = peopleInfo;

  const result = peopleArr.filter((person) => (!id || parseInt(id, 10) === person.id)
  && (!name || name === person.name)
  && (!gender || gender === person.gender)
  && (!favColor || favColor === person.favColor)
  && (!age || parseInt(age, 10) === person.age)
  && (!country || country === person.country));

  return result;
}

app.get('/:path', (req, res) => {
  try {
    const { path } = req.params;
    if (!path || path !== 'people') {
      throw new Error('Enter \'people\' path as a start');
    } else {
      const result = checkUserParamters(req.query);
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('*', (_, res) => {
  res.redirect('/:path');
});

app.listen(3000, () => {
  console.log('The server is running on port 3000');
});
