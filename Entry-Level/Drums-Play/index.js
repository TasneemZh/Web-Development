var drumBtns = document.querySelectorAll(".drum").length;


for (var i = 0; i < drumBtns; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function() {
    playSound(this.innerHTML);
    animationEffect(this.innerHTML);
  });
}

document.addEventListener("keydown", function(event) {
  playSound(event.key);
  animationEffect(event.key);
});

function playSound(buttonLetter) {

  var audio;

  switch (buttonLetter) {
    case 'w':
      audio = new Audio("sounds/tom-1.mp3");
      break;
    case 'a':
      audio = new Audio("sounds/tom-2.mp3");
      break;
    case 's':
      audio = new Audio("sounds/tom-3.mp3");
      break;
    case 'd':
      audio = new Audio("sounds/tom-4.mp3");
      break;
    case 'j':
      audio = new Audio("sounds/snare.mp3");
      break;
    case 'k':
      audio = new Audio("sounds/crash.mp3");
      break;
    case 'l':
      audio = new Audio("sounds/kick-bass.mp3");
      break;

    default:
      console.log("Oops! There is no such thing exist...");

  }
  audio.play();
}

function animationEffect(buttonLetterAnimation) {
  document.querySelector("." + buttonLetterAnimation).classList.add("pressed");

  setTimeout(function() {
    document.querySelector("." + buttonLetterAnimation).classList.remove("pressed");
  }, 100);

}
