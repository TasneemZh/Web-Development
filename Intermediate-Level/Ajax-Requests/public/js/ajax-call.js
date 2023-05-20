function verifyRequest(xhr, btnObject) {
  /* Without the promise, the app will keep continuously
       rejecting until the request is ready and done */
  return new Promise((resolve, reject) => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (btnObject.isFile || xhr.status === 200) {
        document.getElementById('container').innerHTML = xhr.responseText;
        resolve(xhr.responseText);
      } else {
        reject(new Error('Somthing went wrong in the request'));
      }
    } else {
      reject(new Error('The request couldn\'t be done'));
    }
  }).catch((error) => {
    console.error(`Well, errors can happen: ${error}`);
  });
}

function makeRequest(btnObject) {
  try {
    const xhr = new XMLHttpRequest();
    if (!xhr) {
      throw new Error('Error! Couldn\'t create an XML-HTTP-Request');
    }
    xhr.onreadystatechange = () => {
      verifyRequest(xhr, btnObject);
    };
    xhr.open('GET', btnObject.source, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
  } catch (error) {
    console.error(`Well, errors can happen: ${error}`);
  }
}

module.exports = makeRequest;
