import { vertexShaderSrc } from "../Shaders/vertexShader.js";
import { fragmentShaderSrc } from "../Shaders/fragmentShader.js";
import { Circle } from "../circle.js";
import { Scene } from "./scene.js";
import { Renderer } from "./renderer.js";
import { Shader } from "./shader.js";
import { Triangle } from "../triangle.js";
import { Square } from "./square.js";
import { level1 } from "./level1.js";
import { Shape } from "./shape.js";
import { Pellet } from "./pellet.js";

main();

function main() {
  const canvas = document.querySelector("#glcanvas");
  canvas.width = window.innerWidth-20;
  canvas.height = window.innerHeight-20;
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  var vertexShaderSource = vertexShaderSrc;
  var fragmentShaderSource = fragmentShaderSrc;

  const shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
  const renderer = new Renderer(gl);
  const scene = new Scene(canvas.width, canvas.height);

  shader.use()
  // Program creation and shaders compiled

  var gridTileLength = 24;
  var mazeHorizontalOffset = canvas.width/2 - gridTileLength * 15;
  var mazeVerticalOffset = canvas.height/2 - gridTileLength * 7; 

  // trying to render a circle
  const circle = new Circle (
    10, [36 + mazeHorizontalOffset, 36 + mazeVerticalOffset], [1.0, 1.0, 0.0, 1]
  )
  circle.transform.rotateAboutSetAxis(45 * Math.PI/180);

  const sq1 = new Square (
    [20, 20], 20, [1.0, 0.5, 0.5, 1]
  )
  // var positions = circle.vertexList;
  const tri1 = new Triangle (
    [300, 300],
    [150, 150],
    [300, 150],
    [1.0, 0.0, 0.0, 1],
    [150, 150, 0],
  )


  // Code to generate level walls
  var lvl = level1;

  var maze1Blocks = []
  var mazeVertexList = []
  var pelletList = []
  var powerPelletList = []
  for(var row = 0; row < lvl.length; row++) {
    for(var col = 0; col < lvl[0].length; col++) {
      // console.log(lvl[row][col]);
      if(lvl[row][col] == 1) { //Add walls
        // console.log(col*10, " ", row*10);
        var sqr = new Square([col*gridTileLength + mazeHorizontalOffset, row*gridTileLength + mazeVerticalOffset], gridTileLength, [0.0, 0.0, 1.0, 0.7]);
        maze1Blocks.push(sqr);
        mazeVertexList = mazeVertexList.concat(sqr.vertexList);

        // scene.add(sqr);
      }
      if(lvl[row][col] == 2) { //Add normal pellet
        var pellet = new Pellet([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], 3, [col, row], [1.0, 0.7, 0.0, 1], "pellet");
        pelletList.push(pellet);
        scene.add(pellet); 
        // console.log(pellet.gridCoords);
      }
      if(lvl[row][col] == 3) { //Add Power Pellet'
        var pellet = new Pellet([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], 7, [col, row], [1.0, 0.2, 0.2, 1], "powerPellet");
        powerPelletList.push(pellet);
        scene.add(pellet);
        // console.log(pellet.gridCoords)
      }
      if(lvl[row][col] == 4) { //Add enemies

      }
    }
  }
  // console.log(mazeVertexList);
  // console.log([mazeHorizontalOffset + gridTileLength * 15, mazeVerticalOffset + gridTileLength * 7])

  var mazeMesh = new Shape(mazeVertexList, [0, 0], [0.0, 0.4, 1.0, 1.0], "maze");
  
  scene.add(mazeMesh);
  scene.add(circle);
  // scene.add(sq1);
  // scene.add(tri1);
  
  // tri1.transform.setRotationPoint(300, 300, 0);
  tri1.transform.setRotationAxis(0,0,1);
  circle.transform.setRotationAxis(0,0,1);
  var pacmanSpeed = gridTileLength;
  var pacmanGridCoords;

  var modeFlag = true; //True means normal mode
  var currentOrientation = 0; //0 for original, 1 for 90 deg clockwise, 2 for 180, 3 for 270 


document.addEventListener("mousedown", event => {
  console.log(event);
  console.log([event.clientX, event.clientY]);
})

  document.addEventListener("keydown", event => {

    var movedThisEvent = false;
    // console.log(event.key);

    // Rotate Pacman on its axis by 45 deg
    if(event.key == "0") {
      circle.transform.rotateAboutSetAxis(15 * Math.PI/180);
    }
    if(event.key == "9") {
      circle.transform.rotateAboutSetAxis(-15 * Math.PI/180);
    }

    // Scale key for debugguing
    if(event.key == "t") {
      circle.transform.setScale(1.5, 1.5, 1);
    }

    // Code that checks if next position of pacman is valid or not

    pacmanGridCoords = toGridCoords(circle.getPosition(), gridTileLength/2, gridTileLength, mazeHorizontalOffset , mazeVerticalOffset);
    // console.log(circle.getPosition());
    // console.log(pacmanGridCoords);
    // console.log("Val: ", lvl[pacmanGridCoords[0]][pacmanGridCoords[1]]);
    
    if(event.key == "ArrowUp") {
      // console.log("pressed ArrowUp");
      // console.log("Tried to move to: ", pacmanGridCoords[1],pacmanGridCoords[0] - 1, " Val: ", lvl[pacmanGridCoords[1]-1][pacmanGridCoords[0]])
      if(lvl[pacmanGridCoords[1]-1][pacmanGridCoords[0]] != 1) {
        circle.transform.translation(0, -pacmanSpeed);
        circle.transform.setAngleAboutSetAxis(315 * Math.PI/180);
        movedThisEvent = true;
      }
    }
    if(event.key == "ArrowDown") {
      // console.log("pressed ArrowDown");
      // console.log("Tried to move to: ", pacmanGridCoords[1],pacmanGridCoords[0] + 1, " Val: ", lvl[pacmanGridCoords[1]+1][pacmanGridCoords[0]])
      if(lvl[pacmanGridCoords[1]+1][pacmanGridCoords[0]] != 1) {
        circle.transform.translation(0, pacmanSpeed);
        circle.transform.setAngleAboutSetAxis(135 * Math.PI/180);
        movedThisEvent = true;
      }
    }
    if(event.key == "ArrowLeft") {
      // console.log("pressed ArrowLeft");
      // console.log("Tried to move to: ", pacmanGridCoords[1] - 1,pacmanGridCoords[0], " Val: ", lvl[pacmanGridCoords[1]][pacmanGridCoords[0]-1])
      if(lvl[pacmanGridCoords[1]][pacmanGridCoords[0]-1] != 1) {
        circle.transform.translation(-pacmanSpeed, 0);
        circle.transform.setAngleAboutSetAxis(225 * Math.PI/180);
        movedThisEvent = true;
      }
    }
    if(event.key == "ArrowRight") {
      // console.log("pressed ArrowRight");
      // console.log("Tried to move to: ", pacmanGridCoords[1] + 1,pacmanGridCoords[0], " Val: ", lvl[pacmanGridCoords[1]][pacmanGridCoords[0]+1])
      if(lvl[pacmanGridCoords[1]][pacmanGridCoords[0]+1] != 1) {
        circle.transform.translation(pacmanSpeed, 0);
        circle.transform.setAngleAboutSetAxis(45 * Math.PI/180);
        movedThisEvent = true;
      }
    }
    pacmanGridCoords = toGridCoords(circle.getPosition(), gridTileLength/2, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset);
    // console.log(pacmanGridCoords)
    // Code that checks if this new tile has a visited pellet, new pellet or a powerPellet
    // iterate through the list of pellets and power pellets to find which one pacman is on.
    if(movedThisEvent) { //this check is only made if pacman actually moved on the last keypress
      for(var i = 0; i < pelletList.length; i++)  {
        if(pacmanGridCoords[0] == pelletList[i].gridCoords[0] && pacmanGridCoords[1] == pelletList[i].gridCoords[1]) { //If pacman is on a pellet
          // console.log("On a pellet");
          if(!pelletList[i].isVisited) { //if the pellet has not been visited
            pelletList[i].markVisited();
            pelletList[i].changeColor([0.0, 1.0, 0.0, 1]);
          }
        }
      }
      // Check for powerPellet
      for(var i = 0; i < powerPelletList.length; i++) {
        if(pacmanGridCoords[0] == powerPelletList[i].gridCoords[0] && pacmanGridCoords[1] == powerPelletList[i].gridCoords[1]) {
          console.log("On a powerPellet");
          if(!powerPelletList[i].isVisited) {
            powerPelletList[i].markVisited();
            powerPelletList[i].changeColor(0.0, 0.0, 0.0, 0.1);
            circle.transform.setScale(1.5, 1.5, 1);
          }
        }
      }
    }

    
    // rotate maze(ie, rotate everything basically)
    if(event.key == "[") {
      
      mazeMesh.transform.setRotationAxis(0,0,1);
      mazeMesh.transform.rotateAboutSetAxis(90 * Math.PI/180);
      if(currentOrientation == 0) {
        mazeMesh.transform.translation(gridTileLength*15, 0);
        currentOrientation = 1;
      }
      else if(currentOrientation == 1) {
        mazeMesh.transform.translation(gridTileLength*15, gridTileLength*15);
        currentOrientation = 2;
      }
      else if(currentOrientation == 2) {
        mazeMesh.transform.translation(-gridTileLength*30, gridTileLength*15);
        currentOrientation = 3;
      }
      else if(currentOrientation == 3) {
        mazeMesh.transform.translation(0, -gridTileLength*30);
        currentOrientation = 0;
      }
    }

    // Make a function that checks if pacman can go onto the next tile
    // then it checks if that tile has a pellet that was already accessed or has a powerpellet
    // if a new tile, change that pellet to green color
    // if a powerpellet, increase pacmansize and change ghost to blue

    // console.log(pacmanGridCoords);

  })


  renderer.setAnimationLoop(animation);

  function animation () {
    gl.clearColor(0.0, 0.0, 0.0, 0.1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderer.render(scene, shader);
  }
}


function toGridCoords(pixelPosition, offset, gridTileLength, hOffset, vOffset) {
  return ([(pixelPosition[0]-offset - hOffset)/gridTileLength, (pixelPosition[1]-offset - vOffset)/gridTileLength]);
}
function GridToPixelCoords(gridPosition, offset, gridTileLength) {
  return ([(gridPosition[0]*gridTileLength)+offset, (gridPosition[1]*gridTileLength)+offset]);
}