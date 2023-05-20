## Note: This guide is for beginners.

This NodeJS app can be the server of any FE project. The suggestion is to implement the FE (i.e., the user interface UI and experience UX) with the ReactJS framework that is using Javascript programming language, HTML, and CSS. The app section shows how to build a sample project with ReactJS that would be the base of your FE.

# Prerequisites

- A terminal to run the commands on it such as [Git Bash](https://git-scm.com/downloads).

- [NodeJS LTS](https://nodejs.org/en/download/) needs to be installed for the *npm* and *npx* commands to work.

- [VSCode](https://code.visualstudio.com/download) which would be the IDE for the project code FE and BE.

# The Project App

### Steps

1- In the terminal, run the following command to build the sample app: `npx create-react-app [name-of-your-project]`

2- Move to the sample app based on what you named it: `cd [name-of-your-project]`

3- Start the sample app on http://localhost:3000: `npm start`

# The Project Server

### Prerequisites

The following links need to be downloaded.

- NPM and that's by adding it to the system environment variables in the PATH like this: 

    > C:\Program Files\nodejs

    The path should be where you installed the NodeJS on your device.

- [MongoDB Community Version](https://www.mongodb.com/try/download/community).

- (Optional) Download [Studio 3T](https://studio3t.com/download/) to be the UI of the MongoDB.

### Steps

1- Clone the Git project by running the following command on your terminal `git clone https://github.com/TasneemZh/MongoDB-APIs-Server.git` or download it as a Zip file.

2- In your terminal, go to the root of the project: `cd MongoDB-APIs-Server/`.

3- Run `npm i` and optionally, `npm i -D`. The first command installs the packages (i.e., libraries) needed to run the project. The second command installs the packages needed for the development work which is not essential for the project to work.

4- Open the cmd in the Windows OS system and go to where you installed the MongoDB, bin folder. Such like:

> cd C:\\Program Files\\MongoDB\\Server\\6.0\\bin

5- Run the MongoDB server by writing the command `mongod` on the cmd. Confirm that you see the last line shows the message "Waiting for connections".

7- Create a new file in the project *MongoDB-APIs-Server* and name it `.env`.

8- Add to the `.env` file the following value:

> MONGODB_CONNECTION_URI=mongodb://0.0.0.0:27017/local

9- Return to the terminal and write the command `npm run dev` to run the NodeJS server you cloned from GitHub.

10- Open [Postman](https://identity.getpostman.com/login?continue=https%3A%2F%2Fweb.postman.co%2Fhome). You will need to have an account first.

11- Add the routes of the project in Postman to use them. You can use them from this [Workspace](https://www.postman.com/winter-astronaut-380709/workspace/mongodb).

12- Open Studio 3T and connect to the database locally through the following link: mongodb://localhost:27017

13- In the *local* database, you will find the collection *alphabets*. In the collection, you will find the users you add through the routes. 

You can add other routes, customize the routes that already exist, and delete them as well.
