const express = require("express");
const app = express();

app.use(express.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/bmicalculator", function(req, res) {
  res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/", function(req, res) {

  var n1 = Number(req.body.num1);
  var n2 = Number(req.body.num2);

  res.send("The result is " + (n1 + n2));
});

app.post("/bmicalculator", function(req, res) {
  var heightVar = parseFloat(req.body.height);
  var weightVar = parseFloat(req.body.weight);

  res.send("The BMI is " + (weightVar / Math.pow(heightVar, 2)));
});

app.listen(3000, function() {
  console.log("The server is running on port 3000...");
});
