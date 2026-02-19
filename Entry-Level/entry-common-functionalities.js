const isPalindrome = (str) => {
    let mid;
    let forward;
    let backward;
    const filteredArr = str.split("").filter((char) => 'a' <= char.toLowerCase() && char.toLowerCase() <= 'z')
    if (filteredArr.length % 2 === 0) {
        mid = filteredArr.length / 2;
        forward = filteredArr.slice(0, mid).join("");
        backward = filteredArr.slice(mid).reverse().join("");
    } else {
        mid = filteredArr.length / 2;
        forward = filteredArr.slice(0, mid).join("");
        backward = filteredArr.slice(mid+1).reverse().join("");
    }
    console.log(`forward: ${forward} - backward: ${backward}`)
    if (forward.toLowerCase() === backward.toLowerCase()) {
        console.log(true);
        return true;
    }
    console.log(false);
    return false;
};

isPalindrome("kikpe**^&eikik321")

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

const debounceFunction = ()=> {
    const startDate = new Date();

    const endDate = new Date().setMinutes(startDate.getMinutes() + 3);

    const isAllowed = () => {
        console.log({
            start: new Date().getTime(),
            end: endDate
        })
        if (new Date().getTime() > endDate) {
            console.log(false);
            return;
        }
        console.log(true);
        return;
    }

    setTimeout(() => isAllowed(), 60000);
    setTimeout(() => isAllowed(), 120000);
    setTimeout(() => isAllowed(), 180000);
    setTimeout(() => isAllowed(), 240000);
    setTimeout(() => isAllowed(), 300000);
    setTimeout(() => isAllowed(), 360000);
};

const sortBasedOnValue = (arr, key) => {
    const sorted = arr.sort((prev, next) => prev[key] - next[key]);
    console.log(sorted);
};

const createHardCopy = (arr, obj) => {
    const copyArr = [...arr];
    const copyObj = JSON.parse(JSON.stringify(obj));
    copyArr.push(9);
    copyArr[0] = 'changed';
    copyObj['c'] = 'ccc';
    console.log({
        arr,
        copyArr,
        obj,
        copyObj,
    });
};

const recurrsiveFunction = () => {
    const factorialNumber = (num1, num2) => {
        return num1 * num2;
    };
    
    const num = 7;
    let result = 1;
    
    for (let i = num; i > 1; i -= 2) {
        result *= factorialNumber(i, i - 1);
    }
    
    console.log(result);    
};

const mergeTwoArrays = (arr1, arr2) => {
    const merged = [];
    let j = 0;
    let i = 0;
    while (j < arr2.length || i < arr1.length) {
        if (arr1[i] < arr2[j]) {
            merged.push(arr1[i]);
            i += 1;
            if (i >= arr1.length) {
                merged.push(...arr2.slice(j))
                break;
            }
        } else {
            merged.push(arr2[j]);
            j += 1;
            if (j >= arr2.length) {
                merged.push(...arr1.slice(i))
                break;
            }
        }
    }
    console.log(merged)
    return merged;
};

