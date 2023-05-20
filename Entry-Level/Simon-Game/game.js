var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level, userLevel, result;
var gameBegining = true;

$("#level-title").text("Press A Key to Start");

$("body").on("keypress", function() {
  if (gameBegining) {
    gameBegining = false;
    level = userLevel = 0;
    gamePattern = [];
    userClickedPattern = [];
    nextSequence();
  }
});


$(".btn").click(function() {
  if (!gameBegining) {

    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    animatePress(userChosenColour);
    userLevel++;
    result = checkAnswer(userLevel, userChosenColour);
    playSound(result);
    if (result === "wrong") {
      $("body").css("background-color", "red");
      setTimeout(function() {
        $("body").css("background-color", "#011F3F");
      }, 200);
      gameBegining = true;
      $("#level-title").text("Game Over, Press Any Key to Restart");
    } else {
      if (userLevel === level) {
        nextSequence();
        userLevel = 0;
        userClickedPattern = [];
      }
    }
  }
});



function nextSequence() {
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel, userColour) {
  for (var i = 0; i < currentLevel; i++) {
    if (userClickedPattern[i] !== gamePattern[i]) {
      return "wrong";
    }
  }
  return userColour;
}
