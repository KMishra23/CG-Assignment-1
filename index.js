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
import { Invisible } from "./invisible.js";
import { createLevel, addMazeToScene, removeMazeFromScene } from "./functions.js";
import { vec3, mat4, vec4, mat3 } from 'https://cdn.skypack.dev/gl-matrix';

main();

function main() {

  // var modelTransformMatrix = mat4.create();
  // mat4.identity(this.modelTransformMatrix);

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

  // Render pacman
  // Initially placing pacman at 0,0 and then calculating his position for each grid location. 
  const circle = new Circle (
    10, [0, 0], [1.0, 1.0, 0.0, 1]
  )
  // circle.transform.rotateAboutSetAxis(45 * Math.PI/180);

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
  // orient 1 2 and 3 are just used for collision detection, level rotation is done using transformation matrix
  var lvlOrient0 = level1;
  var lvlOrient1 = rotate90Clockwise(lvlOrient0);
  var lvlOrient2 = rotate90Clockwise(lvlOrient1);
  var lvlOrient3 = rotate90Clockwise(lvlOrient2);
  // var lvlCheck = rotate90Clockwise(lvlOrient3)

  // console.log(lvlCheck)

  // var maze1Blocks = []
  var mazeVertexList = []
  var pelletList = []
  // var powerPelletList = []
  var enemyList = []
  var enemyLocations = []
  var gridMarkers = []

  var mazeObjectList;
  var mazeMesh 
  var t = createLevel(lvlOrient0, mazeVertexList, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, pelletList, enemyList, enemyLocations, gridMarkers)
  mazeObjectList = t[0];
  mazeMesh = t[1];
  
  console.log(gridMarkers);
  addMazeToScene(mazeObjectList, gridMarkers, scene)
  scene.add(circle);
  // scene.add(sq1);
  // scene.add(tri1);

  var universalRotationPoint = [mazeHorizontalOffset + gridTileLength * 15, mazeVerticalOffset + gridTileLength * 7];
  var pacmanGridCoords = [1, 1];
  var pacmanLoc = [pacmanGridCoords[0]*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, pacmanGridCoords[1]*gridTileLength + gridTileLength/2 + mazeVerticalOffset]

  // tri1.transform.setRotationPoint(300, 300, 0);
  tri1.transform.setRotationAxis(0,0,1);
  circle.transform.setRotationAxis(0,0,1);
  circle.transform.globalRotationPoint = [universalRotationPoint[0]-pacmanLoc[0], universalRotationPoint[1]-pacmanLoc[1], 0]
  // circle.transform.setRotationPoint(universalRotationPoint[0]-pacmanLoc[0], universalRotationPoint[1]-pacmanLoc[1], 0);
  mazeMesh.transform.setRotationAxis(0,0,1);
  var pacmanSpeed = gridTileLength;
  circle.transform.translation(pacmanLoc[0], pacmanLoc[1])

  var modeFlag = true; //True means normal mode
  var currentOrientation = 0; //0 for original, 1 for 90 deg clockwise, 2 for 180, 3 for 270 
  var currentLVL = lvlOrient0;

  
  

  var currAngle = 0
document.addEventListener("mousedown", event => {
  console.log(event);
  console.log([event.clientX, event.clientY]);
})

  document.addEventListener("keydown", event => {
    // console.log(pacmanGridCoords)
    var movedThisEvent = false;
    // console.log(event.key);

    // Rotate Pacman on its axis by 45 deg
    if(event.key == "0") {
      circle.transform.rotateAboutSetAxis(15 * Math.PI/180);
    }
    if(event.key == "9") {
      circle.transform.rotateAboutSetAxis(-15 * Math.PI/180);
    }

    if(event.key == "8") {
      circle.transform.rotateAboutGlobalAxis(15 * Math.PI/180);
    }
    if(event.key == "7") {
      circle.transform.rotateAboutGlobalAxis(-15 * Math.PI/180);
    }

    // Scale key for debugguing
    if(event.key == "t") {
      circle.transform.setScale(1.5, 1.5, 1);
    }

    // Code that checks if next position of pacman is valid or not

    if(event.key == "ArrowUp") {
      // console.log("pressed ArrowUp");
      // console.log("Tried to move to: ", pacmanGridCoords[1],pacmanGridCoords[0] - 1, " Val: ", lvlOrient0[pacmanGridCoords[1]-1][pacmanGridCoords[0]])
      // if(lvlOrient0[pacmanGridCoords[1]-1][pacmanGridCoords[0]] != 1) {
        pacmanGridCoords[1]--;
        circle.transform.translation(0, -pacmanSpeed);
        circle.transform.setAngleAboutSetAxis(315 * Math.PI/180);
        movedThisEvent = true;
      // }
    }
    if(event.key == "ArrowDown") {
      // if(lvlOrient0[pacmanGridCoords[1]+1][pacmanGridCoords[0]] != 1) {
        pacmanGridCoords[1]++;
        circle.transform.translation(0, pacmanSpeed);
        circle.transform.setAngleAboutSetAxis(135 * Math.PI/180);
        movedThisEvent = true;
      // }
    }
    if(event.key == "ArrowLeft") {
      // if(lvlOrient0[pacmanGridCoords[1]][pacmanGridCoords[0]-1] != 1) {
        pacmanGridCoords[0]--;
        circle.transform.translation(-pacmanSpeed, 0);
        circle.transform.setAngleAboutSetAxis(225 * Math.PI/180);
        movedThisEvent = true;
      // }
    }
    if(event.key == "ArrowRight") {
      // if(lvlOrient0[pacmanGridCoords[1]][pacmanGridCoords[0]+1] != 1) {
        pacmanGridCoords[0]++;
        circle.transform.translation(pacmanSpeed, 0);
        circle.transform.setAngleAboutSetAxis(45 * Math.PI/180);
        movedThisEvent = true;
      // }
    }
    // console.log(circle.getPosition())


    // reset enemy color to normal and pacman size after it moves from a power pellet
    if(movedThisEvent) {
      enemyList.forEach(function(enemy){
        enemy.restoreColor()
      })
      circle.transform.setScale(1,1,0)
    }
    // Make a function that checks if pacman can go onto the next tile
    // then it checks if that tile has a pellet that was already accessed or has a powerpellet
    // if a new tile, change that pellet to green color
    // if a powerpellet, increase pacmansize and change ghost to blue
    // Code that checks if this new tile has a visited pellet, new pellet or a powerPellet
    // iterate through the list of pellets and power pellets to find which one pacman is on.
    if(movedThisEvent) { //this check is only made if pacman actually moved on the last keypress
      for(var i = 0; i < pelletList.length; i++)  {
        if(pacmanGridCoords[0] == pelletList[i].gridCoords[0] && pacmanGridCoords[1] == pelletList[i].gridCoords[1]) { //If pacman is on a pellet
          // console.log("On a pellet");
          if(!pelletList[i].isVisited) { //if the pellet has not been visited
            if(pelletList[i].type == "pellet") { //For normal Pellet
              pelletList[i].markVisited();
              pelletList[i].changeColor([0.0, 1.0, 0.0, 1]);
            }
            else { //for powerpellet
              pelletList[i].markVisited(); 
              pelletList[i].changeColor(0.0, 0.0, 1.0, 1.0);
              circle.transform.setScale(1.5, 1.5, 1);
              for(var j = 0; j < 4; j++) {
              enemyList[j].changeColor([0.0, 0.0, 1.0, 1]);
              }
            }
          }
        }
      }
    }

    
    // rotate maze(ie, rotate everything basically)
    if(event.key == "[") {
      currentOrientation = (currentOrientation + 1)%4;
      if(currentOrientation == 0) currentLVL = lvlOrient0
      else if(currentOrientation == 1) currentLVL = lvlOrient1
      else if(currentOrientation == 2) currentLVL = lvlOrient2
      else currentLVL = lvlOrient3

      mazeMesh.transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
      mazeMesh.transform.rotateAboutSetAxis(90 * Math.PI/180);
      
      for(var i = 0; i < pelletList.length; i++) {
        pelletList[i].transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
        pelletList[i].transform.setRotationAxis(0,0,1);
        pelletList[i].transform.rotateAboutSetAxis(90 * Math.PI/180);
      }
      for(var i = 0; i < enemyList.length; i++) {
        enemyList[i].transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
        enemyList[i].transform.setRotationAxis(0,0,1);
        enemyList[i].transform.rotateAboutSetAxis(90 * Math.PI/180);
      }
      for(var i = 0; i < gridMarkers.length; i++) {
        gridMarkers[i].transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
        gridMarkers[i].transform.setRotationAxis(0,0,1);
        gridMarkers[i].transform.rotateAboutSetAxis(90 * Math.PI/180);
      }
      var marker = getGridMarker(pacmanGridCoords, gridMarkers)
      var t = vec3.create()
      var pacmanPosition = marker.getPosition()
      circle.transform.setPosition(pacmanPosition[0], pacmanPosition[1])
      circle.transform.rotateAboutSetAxis(90)


    }
    if(event.key == "]") {
      
      mazeMesh.transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
      mazeMesh.transform.rotateAboutSetAxis(-90 * Math.PI/180);
      
      for(var i = 0; i < pelletList.length; i++) {
        pelletList[i].transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
        pelletList[i].transform.setRotationAxis(0,0,1);
        pelletList[i].transform.rotateAboutSetAxis(-90 * Math.PI/180);
      }
      for(var i = 0; i < enemyList.length; i++) {
        enemyList[i].transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
        enemyList[i].transform.setRotationAxis(0,0,1);
        enemyList[i].transform.rotateAboutSetAxis(-90 * Math.PI/180);
      }
      for(var i = 0; i < gridMarkers.length; i++) {
        gridMarkers[i].transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
        gridMarkers[i].transform.setRotationAxis(0,0,1);
        gridMarkers[i].transform.rotateAboutSetAxis(-90 * Math.PI/180);
      }
      // var marker = getGridMarker(pacmanGridCoords, gridMarkers)
      currAngle -= 90*Math.PI/180;
      // console.log(universalRotationPoint)
      var temp = getGridCoordsAfterTransform(circle.getPosition(), currAngle, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, universalRotationPoint)
      // var pacmanPosition = marker.getPosition()
      circle.transform.setPosition(temp[0], temp[1])
      // circle.transform.rotateAboutSetAxis(-90)



    }
    // console.log(circle.getPosition())
    // var marker = getGridMarker([1,1], gridMarkers)
    // console.log(marker.getPosition())
    // console.log(getGridCoordsAfterTransform(pacmanGridCoords, 90 * Math.PI/180, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, universalRotationPoint));
    
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

function rotate90Clockwise(matrixMN) {
  var n = matrixMN.length;
  var m = matrixMN[0].length;
  var output = [...Array(m)].map(e => Array(n));
  // console.log(output);

  for(var i = 0; i < n; i++) {
    for(var j = 0; j < m; j++) {
      output[j][n-1-i] = matrixMN[i][j];
    }
  }

  return output;
}

function getGridCoordsAfterTransform(gridCoords, rotationAngle, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, universalRotationPoint) {
  var position = vec3.create();
  vec3.set(position, 0, 0, 0);
  
  var transformMatrix = mat4.create();
  mat4.identity(transformMatrix);

  var identity = mat4.create();
  mat4.identity(identity);

  var pixelCoords = gridCoords
  // console.log(pixelCoords)
  var translate = vec3.create();
  var translationMat = mat4.create();
  vec3.set(translate, pixelCoords[0], pixelCoords[1], 0)
  mat4.translate(translationMat, identity, translate);
  // console.log(translationMat)

  // console.log(universalRotationPoint);
  var rotationPoint = vec3.create()
  // console.log(universalRotationPoint)
  // console.log(universalRotationPoint[1] - pixelCoords[1])
  // console.log(universalRotationPoint[0] - pixelCoords[0] + " " + universalRotationPoint[1] - pixelCoords[1]);
  vec3.set(rotationPoint, universalRotationPoint[0] - pixelCoords[0], universalRotationPoint[1] - pixelCoords[1], 0);
  var rotationAxis = vec3.create()
  vec3.set(rotationAxis, 0, 0, 1);

  var rotationMat = mat4.create()
  mat4.translate(rotationMat, identity, rotationPoint);
  mat4.rotate(rotationMat, rotationMat, rotationAngle, rotationAxis);
  vec3.set(rotationPoint, -universalRotationPoint[0] - pixelCoords[0], -universalRotationPoint[1] - pixelCoords[1], 0);
  mat4.translate(rotationMat, rotationMat, rotationPoint);
  console.log(rotationMat)

  mat4.multiply(transformMatrix, translationMat, rotationMat)
  vec3.transformMat4(position, position, transformMatrix);
  console.log(position)
  return position;
}

function getGridMarker(gridCoords, gridMarkers){
  // console.log(gridCoords);
  for(var i = 0; i < gridMarkers.length; i++) {
    if(gridMarkers[i].gridCoords[0] == gridCoords[0] && gridMarkers[i].gridCoords[1] == gridCoords[1]) {
      // console.log("bro")
      return gridMarkers[i]
    }
  }
  // console.log("marker not found");
}