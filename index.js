// Game state
let phase="waiting"; //waiting | stretching | turning | walking | transitioning | falling
let lastTimeStamp; //the timestamp of the previous animation cycle
let heroX; // Changes when moving forward
let heroY; // changes when falling
let sceneOffset; //moves the whole game
let platforms=[
    {x:50, w:50},
    {x:90, w:30},
];
let sticks=[
    {x:100, legth: 50, rotation: 60}
];
let score=0;
// Configuration
//Getting the camvas element 
const canvas = document.getElementById("game");
//Getting the drawing context
const ctx = canvas.getContext("2d");
//Further UI elements 
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart");
//Start game
resetGame();
function resetGame() {
    draw();

}

function draw() {

}
window.addEventListener("mousedown", function (event){

});
window.addEventListener("mouseup", function (event){

});
function animate(timestamp){

}
function resetGame(){
    //Reset game state
    phase="waiting";
    lastTimeStamp=undefined;

    //this platform is always the same
    platforms=[{x:50, w:50}];
    generatePlatform();
     generatePlatform();
      generatePlatform();
       goeneratePlatform();

//initialize heros position
heroX=platforms[0].x+platforms[0].w-30; // Hero stands a bit before the edge
heroY=0;
//by how much should we shift the screen back
sceneOffset=0;
//there's always a stick, even if it appears to be invisible(length:0)
sticks=[{x: platforms[0].x + platforms[0].w, length:0, rotation:0}];
//score
score=0;
//reset UI
restartButton.style.display="none";//hide reset button
scoreElement.innerText=score;//reset score display
draw();
}
function generatePlatform(){
    const minimumGap=40;
    const maximumGap=200;
    const minimumWidth=20;
    const maximumWidth=100;
//X coordinate of the right edge of the furthest platform
const lastPlatform=platforms[platforms.length-1];
let furthestX=lastPlatform.x+lastPlatform.w;

const x=
furthestX+
minimumGap+
Math.floor(Math.random()*(maximumGap-minimumGap));
const w=
minimumWidth+Math.floor(Math.random()*(maximumWidth-minimumWidth));

platforms.push({x,w});
}
//getting the canvas element
const canvasWidth=375;
const canvasHeight=375;
const platformHeight=100;

function draw() {
    ctx.clearRect(0,0, canvasWidth, canvasHeight);
}

function draw(){
    ctx.clearRect(0,0, canvasWidth, canvasHeight);
    //save the current transformation
    ctx.save();
    //shifting the view
    ctx.translate(-sceneOffset,0);
    //draw scene
    drawPlatforms();
    drawHero();
    drawSticks();
    //Restore transfromation to the last save
    ctx.restore();

}
//example state of platforms
function drawPlatforms(){
    platforms.forEach(({x,w}) => {
        //draw platform
        ctx.fillStyle="black";
        ctx.fillRect(x, canvasHeight - platformHeight, w, platformHeight);

    });
}
function drawHero(){
    const heroWidth=20;
    const heroHeight=30;
    ctx.fillStyle="red";
    ctx.fillRect(
        heroX,
        heroY + canvasHeight - platformHeight - heroHeight,
        heroWidth,
        heroHeight
    );
}
function drawSticks() {
  sticks.forEach((stick) => {
    ctx.save();

    // Move the anchor point to the start of the stick and rotate
    ctx.translate(stick.x, canvasHeight - platformHeight);
    ctx.rotate((Math.PI / 180) * stick.rotation);

    // Draw stick
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -stick.length);
    ctx.stroke();

    // Restore transformations
    ctx.restore();
  });
}


window.addEventListener("mousedown", function () {
  if (phase == "waiting") {
    phase = "stretching";
    lastTimestamp = undefined;
    window.requestAnimationFrame(animate);
  }
});

window.addEventListener("mouseup", function () {
  if (phase == "stretching") {
    phase = "turning";
  }
});

restartButton.addEventListener("click", function (event) {
  resetGame();
  restartButton.style.display = "none";
});
function animate(timestamp) {
  if (!lastTimestamp) {
    // First cycle
    lastTimestamp = timestamp;
    window.requestAnimationFrame(animate);
    return;
  }

  let timePassed = timestamp - lastTimestamp;

  switch (phase) {
    case "waiting":
      return; // Stop the loop
    case "stretching": {
      sticks[sticks.length - 1].length += timePassed / stretchingSpeed;
      break;
    }
    case "turning": {
      sticks[sticks.length - 1].rotation += timePassed / turningSpeed;
  
      break;
    }
    case "walking": {
      heroX += timePassed / walkingSpeed;
    
      break;
    }
    case "transitioning": {
      sceneOffset += timePassed / transitioningSpeed;
  
      break;
    }
    case "falling": {
      heroY += timePassed / fallingSpeed;

      break;
    }
  }

  draw();
  lastTimestamp = timestamp;

  window.requestAnimationFrame(animate);
}
//configuration
const stretchingSpeed=4;//milliseconds it takes to draw a pixel
const turningSpeed=4; //milliseconds it takes to turn a degree
const transitioningSpeed=2;
const walkingSpeed=4;
const fallingSpeed=2;

function aniamte(timestamp) {
    switch (phase) {
        case "waiting":
            return; //stop the loop
    }
}
function animate(timestamp){
    switch (phase){
        case "stretching": {
            sticks[sticks.length - 1].length += timePassed / stretchingSpeed;
            break;
        }
    }
}
function animate(timestamp){
    switch (phase){
        case "turning": {
            sticks[sticks.length - 1].rotation += timePassed / turningSpeed;
            if (sticks[sticks.length - 1].rotation >= 90){
                sticks[sticks.legth - 1].rotation = 90;
                const nextPlatform = thePlatformTheStickHits();
                if (nextPlatform){
                    score++;
                    scoreElement.innerText = score;
                    generatePlatform();
                }
                phase = "walking";

            }
            break;
        }
    }
}
function thePlatformTheStickHits() {
    const lastStick = sticks[sticks.length - 1];
    const stickFarX = lastStick.x + lastStick.length;
    const thePlatformTheStickHits = platforms.find(
        (platform) => platform.x < stickFarX && stickFarX < platform.x + platform.w);

    return thePlatformTheStickHits;
}
function animate(timestamp) {


  switch (phase) {
    
    case "walking": {
      heroX += timePassed / walkingSpeed;

      const nextPlatform = thePlatformTheStickHits();
      if (nextPlatform) {
        // If the hero will reach another platform then limit its position at its edge
        const maxHeroX = nextPlatform.x + nextPlatform.w - 30;
        if (heroX > maxHeroX) {
          heroX = maxHeroX;
          phase = "transitioning";
        }
      } else {
        // If the hero won't reach another platform then limit its position at the end of the pole
        const maxHeroX =
          sticks[sticks.length - 1].x +
          sticks[sticks.length - 1].length;
        if (heroX > maxHeroX) {
          heroX = maxHeroX;
          phase = "falling";
        }
      }
      break;
    }
   
  }

  }