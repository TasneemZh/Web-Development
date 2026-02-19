const isPalindrome = (str) => {
    let mid;
    let forward;
    let backward;
    if (str.length % 2 === 0) {
        mid = str.length / 2;
        forward = str.slice(0, mid);
        backward = str.split("").slice(mid).reverse().join("");
    } else {
        mid = str.length / 2;
        forward = str.slice(0, mid);
        backward = str.split("").slice(mid+1).reverse().join("");
    }
    console.log(`forward: ${forward} - backward: ${backward}`)
    if (forward === backward) {
        return true;
    }
    return false;
};

const reversString = (str) => {
    return str.split("").reverse().join("");
};

const filterForEvenNumbers = (arr) => {
    return arr.filter((num) => num % 2 === 0)
};

const calculateFactorial = (num) => {
    let result = 1;
    for (let i = num; i > 0; i -= 1) {
        result *= i;
    }
    return result;
};

const isPrime = (num) => {
    let j;
    for (let i = 2; i < num; i += 1) {
        j = i;
        while (j < num) {
            if (i * j === num) {
                return false;
            }
            j += 1;
        }
    }
    return true;
};

const findLargestInNested = (nestedArr) => {
    let maxFound = 0;
    for (let i = 0; i < nestedArr.length; i += 1) {
        maxFound = Math.max(maxFound, ...nestedArr[i]);
    }
    return maxFound;
};

const calculateFibonacci = (series, endOfSeries) => {
    let sum = 0;
    for (let i = 0; sum < endOfSeries; i+=1) {
        sum = series[i] + series[i+1];
        series.push(sum);
    }
    return series;
};

const capitalizeFirstWord = (str) => {
    let word;
    let sentence = "";
    const arr = str.split(" ");
    for (let i = 0; i < arr.length; i += 1) {
        word = arr[i][0].toUpperCase() + arr[i].substring(1, arr[i].length);
        sentence += (!sentence ? "" : " ") + word;
    }
    return sentence;
};
