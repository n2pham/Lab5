// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const input = document.getElementById("image-input");
const form = document.getElementById("generate-meme");
const canvas = document.getElementById("user-image");
let canv = canvas.getContext('2d');
const clear = document.querySelector("button[type='reset']");
const submit = document.querySelector("button[type='submit']");
const range = document.querySelector("input[type='range']");
const read = document.querySelector("button[type='button']");

var synth = window.speechSynthesis;
var createVoice = true;
// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  
  canv.clearRect(0, 0, canvas.width, canvas.height);

  // Set button visibility
  read.disabled = true;
  clear.disabled = true;
  submit.disabled = false;

  // Fill canvas black
  canv.fillStyle = "black";
  canv.fillRect(0, 0, canvas.width, canvas.height);

  // Set dimension of image as size of canvas
  var imgDimension = getDimensions(canvas.width, canvas.height, img.width, img.height);
  canv.drawImage(img, imgDimension["startX"], imgDimension["startY"], imgDimension["width"], imgDimension["height"]);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});
input.addEventListener('change', (event) => {
  img.src = URL.createObjectURL(event.target.files[0]); // User picks image location
  img.alt = event.target.files[0].name;                 // Outputs image name
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  var topText = document.getElementById("text-top").value;
  var bottomText = document.getElementById("text-bottom").value;

  canv.fillStyle = "white";
  canv.font = "bold 25px Arial";
  canv.fillText(topText, (canvas.width / 2), 30);
  canv.fillText(bottomText, (canvas.width / 2), canvas.height - 20);

  // Set button visibility
  read.disabled = false;
  clear.disabled = false;
  submit.disabled = true;
});

clear.addEventListener("click", (event) => {
  canv.clearRect(0, 0, canvas.width, canvas.height);
  canv.fillStyle = "black";
  canv.fillRect(0, 0, canvas.width, canvas.height);
  //Reset text input
  document.getElementById("text-top").value = "";
  document.getElementById("text-bottom").value = "";

  // Set button visibility
  read.disabled = true;
  clear.disabled = true;
  submit.disabled = false;
});

read.addEventListener("click", (event) => {
  event.preventDefault();
  
  var voiceSelect = document.querySelector('select');
  voiceSelect.disabled = false;
  var voices = speechSynthesis.getVoices();

  if (createVoice == true){
    for(var i = 0; i < voices.length; i++) {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

      if(voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voiceSelect.appendChild(option);
    }
    createVoice = false;
  }
  var topText = document.getElementById("text-top").value;
  var bottomText = document.getElementById("text-bottom").value;
  var speak = new SpeechSynthesisUtterance(topText+bottomText);

  var select = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(i = 0; i < voices.length ; i++) {
    if(voices[i].name === select) {
      speak.voice = voices[i];
    }
  }
  speak.volume = range.value / 100;
  synth.speak(speak);
  
});

range.addEventListener("input", (event) => {

  const volumeIcon = document.getElementById("volume-group").getElementsByTagName("img")[0];

  if (range.value == 0){
    volumeIcon.src = "icons/volume-level-0.svg";
    volumeIcon.alt = "Volume Level 0";
  }else if (range.value <= 33){
    volumeIcon.src = "icons/volume-level-1.svg";
    volumeIcon.alt = "Volume Level 2";
  }else if (range.value <= 66){
    volumeIcon.src = "icons/volume-level-2.svg";
    volumeIcon.alt = "Volume Level 2";
  }else if (range.value <= 100){
    volumeIcon.src = "icons/volume-level-3.svg";
    volumeIcon.alt = "Volume Level 3";
  }
});
/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
