let sw = 1;
let speed = 1;
let x, y, px, py = 0;
let brush = 0;
let n;
let n2;
let n3;

let button;

const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let mic;
let freq = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  background(255);

  n = random(1, 5);
  n2 = random(1, 5);
  n3 = random(1, 5);

  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(listening);

  stroke(228, 212, 57);
  brush = random(1);

  button = createButton('clear canvas');
  button.position(screen.width / 2, 550);
  button.mousePressed(clearCanvas);
}

function listening() {
  pitch = ml5.pitchDetection(
    model_url,
    audioContext,
    mic.stream,
    modelLoaded
  );
}

function modelLoaded() {
  pitch.getPitch(gotPitch);
}

function gotPitch(error, frequency) {
  if (!error && frequency) {
    freq = frequency;
  }
  pitch.getPitch(gotPitch);
}

function mousePressed() {
  userStartAudio();
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

  let r = freq / n;
  let g = freq / n2;
  let b = freq / n3;

  r = constrain(r, 0, 255);
  g = constrain(g, 0, 255);
  b = constrain(b, 0, 255);

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
