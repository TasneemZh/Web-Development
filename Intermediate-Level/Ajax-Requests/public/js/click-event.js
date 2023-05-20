const makeRequest = require('./ajax-call');

const btnObject = [{
  source: 'https://tasneemzh-newspaper.herokuapp.com/',
  isFile: false,
}, {
  source: 'result.html',
  isFile: true,
}];

document.getElementById('reqs_btn_url').addEventListener('click', () => {
  makeRequest(btnObject[0]);
});
document.getElementById('reqs_btn_file').addEventListener('click', () => {
  makeRequest(btnObject[1]);
});
