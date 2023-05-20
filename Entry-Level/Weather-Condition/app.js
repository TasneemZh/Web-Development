const express = require("express");
const https = require("https");

const app = express();

app.use(express.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

  const queue = req.body.cityName;
  const unit = "metric";
  const API_key = "9e0e07b7764d23db9cc1321517b3827b";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + queue + "&units=" + unit + "&appid=" + API_key + "#";

  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      // console.log(weatherData);
      // console.log(JSON.stringify(weatherData));

      res.write("<h1>The weather in " + queue + " is " + weatherData.main.temp + " degree.</h1>");
      res.write("<p>The weather seems to be " + weatherData.weather[0].description + ".</p>");

      const iconUrl = "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
      res.write("<img src = " + iconUrl + ">");

      res.send();
    });

  });

});


app.listen(3000, function() {
  console.log("The server is running on port 3000...");
});
