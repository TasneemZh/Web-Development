# About the Project

A serverless offline project that runs locally on the user's browser. It costs nothing and doesn't need any registration. It also has a local DynamoDB which can be interacted with through a shell as long as the server is running in the background. All the functions are written in **Node.js** and formatted modernly with **ES6**. The server is connected with the [Serverless App](https://app.serverless.com/) with the name "serverless-template". Thus, it needs an Internet connection when operating since the word "offline" means that it isn't connected with a cloud service provider (e.g., AWS). In other words, it is FREE.

-------------------------------------------------

# Different Usages

The project has three major parts that can be separated from each other, with one example for each part.

### First Part

Mocha Functions: This type of functions has an advantage of getting created by a template (check the _templates_ folder) through the following command:

`sls create function -f [your_Function_Name] --handler src/mochaFunctions/[your_Function_Name].[your_Function_Name]  --path src/test/`

Determining the _test_ path is optional, but in neither way, the test function would be created side to side with the user mocha function.

Running this kind is done by running the test function which would have the same name as the user function but is better changed to another name to avoid confusion. (Check the project _mochaFunctions_ folder and _test_ folder)

### Second Part

General Functions: Very basic and simple functions (check _helloWorld.js_ file). They reside in two places:

* Inside the _src_ folder as a Node.js function. (Written by the user)

* Under the _functions_ section inside _serverless.yml_. (Added manually by the user)

### Third Part

Database Functions: They come as a series of functions, such as creating the table, adding items to the table from a file, adding an item to the table from user-input, updating an item in the table, and finally deleting the table.

The database should be configured (check the _tableFunctions_ folder), and customized (check the custom section for dynamodb in _package.json_).

Add the DB functions to _serverless.yml_ in the same way as in the second part.

-------------------------------------------------

# Setting up the Project

1- Clone the project. `git clone https://github.com/TasneemZh/Local-Serverless-with-DynamoDB.git`.

2- Install NPM dependencies by `npm i`.

3- Install NPM devDependencies by `npm i -also=dev`.

4- Install serverless globally by NPM (ONLY ONCE) `npm i -g serverless`, or locally, if that is not possible.

-------------------------------------------------

# Running the Project

- Use the terminal and `cd` to the project root.

**Mocha:** `mocha src/test/mocahExampleFunction.js` OR `cd src/test` then `mocha mocahExampleFunction.js`

**General:** `sls offline`, [Dev - Main Route](http://localhost:3000/dev), and Postman if REST is used in the project for best practice

**Dynamodb:** [Shell](http://localhost:8000/shell/)

**General with Dynamodb:** `sls offline start`

-------------------------------------------------

# Side Notes

* The plugins in _serverless.yml_ are added based on the usages of the project. As for the plugins below, the first one is for mocha, it is unnecessary if mocha won't be used, second one is also optional if the DB won't be used, and third one is essential for the project to run locally.

        plugins:

        ...

        - serverless-mocha-plugin

        - serverless-dynamodb-local

        - serverless-offline

* Authentication in serverless with aws is a crucial part of the project as it won't get executed without it. Notice the plugin "serverless-iam-roles-per-function" in _serverless.yml_, the "iamRoleStatements" sections for the functions in the _serverless.yml_, and the npm package "serverless-iam-roles-per-function" in _package.json_.

* The shell is connected with the server, thus any executed code there would affect the DB directly.

* _serverless.yml_ is very sensitive to indents so take extra care to them there.

* _tableFunctions_ are written with the ES6 module while _mochaFunctions_ are written with the CommonJS module. Both of them don't need to apply explicitly the global strict mode directive by writing at the top of js files **'use strict';** since they already use strict mode in their modules.

-------------------------------------------------

# A Clean Start

For a clean start:

1- Delete the .git folder, and initialize a new one by `git init`.

2- Delete mochaFunctions and test folders. Use `sls create function -f [your_Function_Name] --handler src/.../[your_Function_Name].[your_Function_Name]  --path src/.../` to create your owns.

3- Delete the dynamoDB `sls dynamodb remove`, and create a new one `sls dynamodb install`.

4- Use VS Code with “Prettier” and “Eslint” extensions to open and edit the project. (_Recommended_)

-------------------------------------------------

# Resources

* [Serverless Framework with AWS Lambda](https://www.youtube.com/watch?v=woqLi6NEW58)

* [Serverless Offline](https://www.serverless.com/plugins/serverless-offline)

* [Serverless DynamoDB Local](https://www.serverless.com/plugins/serverless-dynamodb-local)

* [Getting Started with Node.js and DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.html)
