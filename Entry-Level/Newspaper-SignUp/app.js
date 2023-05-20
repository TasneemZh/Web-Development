require("dotenv").config();
// npm i @mailchimp/mailchimp_marketing
const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("link"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  apiKey: process.env.API_KEY, // Change this API key with your API key
  server: process.env.SERVER_NUM // Change this server number with your API server number
});

app.post("/", function(req, res) {
  /* Change this Audience key with your Audience ID through MailChimp ->
  Admin Site -> Audience -> Settings -> Audience name and defaults */
  const listId = process.env.LIST_ID;

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: req.body.email,
      status: "subscribed",
      merge_fields: {
        FNAME: req.body.firstName,
        LNAME: req.body.lastName
      }
    });

    res.sendFile(__dirname + "/success.html")
    console.log("");
    console.log("Successfully added contact as an audience member.");
    console.log("The contact's id is" + (response.id));
  };

  run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

// Server configuration
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

let server = app.listen(port, function() {
  console.log(`The server is running successfully on ${port}!`);
});

server.on("clientError", (err, socket) => {
  console.error(err);
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});
