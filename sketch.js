let sw = 1;
let speed = 1;
let x, y, px = 0, py = 0;
let brush = 0;
let n, n2, n3;

let button;

const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let mic;
let freq = 0;
let audioStarted = false;

function setup() {
  let canvas = createCanvas(screen.width, screen.height);
  background(255);

  n = random(1, 5);
  n2 = random(1, 5);
  n3 = random(1, 5);

  mic = new p5.AudioIn();

  stroke(228, 212, 57);
  brush = random(1);

  button = createButton('clear canvas');
  button.position(screen.width / 2, 550);
  button.mousePressed(clearCanvas);
}

function startAudio() {
  userStartAudio();

  mic.start(() => {
    console.log("mic started");

    pitch = ml5.pitchDetection(
      model_url,
      getAudioContext(),
      mic.stream,
      () => {
        console.log("model loaded");
        pitch.getPitch(gotPitch);
      }
    );
  });

  audioStarted = true;
}

function gotPitch(error, frequency) {
  if (!error && frequency) {
    freq = frequency;
  }
  pitch.getPitch(gotPitch);
}

function mousePressed() {
  if (!audioStarted) {
    startAudio();
  }

  let chooseColor = random(6);
  if (chooseColor < 1) {
    stroke(228, 212, 57);
  } else if (chooseColor < 2) {
    stroke(216, 130, 21);
  } else if (chooseColor < 3) {
    stroke(6, 38, 51);
  } else if (chooseColor < 4) {
    stroke(23, 119, 47);
  } else if (chooseColor < 5) {
    stroke(56, 8, 50);
  } else {
    stroke(232, 45, 30);
  }
}

function draw() {
  x = mouseX;
  y = mouseY;

  brush = 0.8;
  speed = dist(px, py, x, y);

  if (brush < 0.5) {
    sw = speed / 10;
    sw = constrain(sw, 5, 15);
  } else {
    sw = 100 / speed;
    sw = constrain(sw, 3, 25);
  }

  let r = constrain(freq / n, 0, 255);
  let g = constrain(freq / n2, 0, 255);
  let b = constrain(freq / n3, 0, 255);

  stroke(r, g, b);
  strokeWeight(sw);

  line(px, py, x, y);
  line(width - px, height - py, width - x, height - y);

  px = mouseX;
  py = mouseY;

  noStroke();
  fill(0);
  textSize(16);
  text("freq: " + freq.toFixed(2), 20, 30);
}

function clearCanvas() {
  background(255);
}