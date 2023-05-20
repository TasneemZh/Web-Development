const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));

function removeDuplicateWithSet(myArr) {
  const newObj = new Set(myArr);
  const newArr = [];
  newObj.forEach((obj) => {
    newArr.push(obj);
  });
  return newArr;
}

function removeDuplicateWithObject(myArr) {
  const withoutDup = myArr.reduce((prev, curr, index) => {
    const isFound = Object.values(prev).find((value) => value === curr);
    if (!isFound) {
      Object.assign(prev, {
        [index]: curr,
      });
    }
    return prev;
  }, {});
  return Object.values(withoutDup);
}

function validateOrder(order) {
  if (typeof order !== 'string') {
    throw new Error('The order name type should be a string --');
  }
  const asc = order.toLowerCase() === 'asc';
  if (!asc && order.toLowerCase() !== 'desc') {
    throw new Error('Please choose the correct abbreviation of the order name ^^');
  }
  return asc;
}

function sortWithSort(myArr, order) {
  const asc = validateOrder(order);
  const sortedArr = [];

  myArr.forEach((element) => {
    sortedArr.push(element);
  });

  return sortedArr.sort((a, b) => (asc ? a - b : b - a));
}

function sortWithMySort(myArr, order) {
  const asc = validateOrder(order);
  const sortedArr = [];
  let minOrMax;
  let unsortedArr = myArr;

  myArr.forEach(() => {
    minOrMax = asc ? Math.min(...unsortedArr) : Math.max(...unsortedArr);
    sortedArr.push(minOrMax);
    unsortedArr = myArr.filter((element) => (asc ? element > minOrMax : element < minOrMax));
  });

  return sortedArr;
}

function findSecondMax(myArr) {
  const max1 = Math.max(...myArr);
  const withoutMax1 = myArr.filter((element) => element !== max1);
  return Math.max(...withoutMax1);
}

app.get('/', (_, res) => {
  try {
    const myArr = [2, 3, 89, 2, 4, 5, 52, 9, 9, 4, 3, 23, 1, 1, 4, 5, 0];
    const readySet = removeDuplicateWithSet(myArr);
    const customSet = removeDuplicateWithObject(myArr);

    const readySort = sortWithSort(readySet, 'asc');
    const customSort = sortWithMySort(customSet, 'asc');
    res.status(200).json({
      duplicate: { readySet, customSet },
      order: { readySort, customSort },
      secondMax: findSecondMax(myArr),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('The server is running on port 3000');
});
