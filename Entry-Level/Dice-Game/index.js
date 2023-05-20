
var randomNumber1 = Math.floor(Math.random()*6) + 1;
var img_name = "images/dice" + randomNumber1 + ".png";
document.querySelector("img.ply_1").setAttribute("src", img_name);



var randomNumber2 = Math.floor(Math.random()*6) + 1;
var img_name = "images/dice" + randomNumber2 + ".png";
document.querySelector("img.ply_2").setAttribute("src", img_name);

if (randomNumber1 > randomNumber2) {
  document.querySelector("#big_heading").innerHTML = "🚩Player 1 Wins!";
} else if (randomNumber1 < randomNumber2) {
  document.querySelector("#big_heading").innerHTML = "Player 2 Wins!🚩";
} else {
  document.querySelector("#big_heading").innerHTML = "Draw!";
}
