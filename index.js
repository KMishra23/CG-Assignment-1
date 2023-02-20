import { vertexShaderSrc } from "../Shaders/vertexShader.js";
import { fragmentShaderSrc } from "../Shaders/fragmentShader.js";
import { Circle } from "./primitives/circle.js";
import { Scene } from "./scene.js";
import { Renderer } from "./renderer.js";
import { Shader } from "./shader.js";
import { Triangle } from "./primitives/triangle.js";
import { Square } from "./primitives/square.js";
import { level1 } from "./levels data/level1.js";
import { level2 } from "./levels data/level2.js";
import { level3 } from "./levels data/level3.js";
import { Shape } from "./primitives/shape.js";
import { Pellet } from "./primitives/pellet.js";
import { Invisible } from "./primitives/invisible.js";
import { createLevel, addMazeToScene, removeMazeFromScene, findGridCoords, getGridMarker, getCoordsAfterTransform, getPixelCoords } from "./functions.js";
import { vec3, mat4, vec4, mat3 } from 'https://cdn.skypack.dev/gl-matrix';

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

  // get the shader source code from the respective files
  var vertexShaderSource = vertexShaderSrc;
  var fragmentShaderSource = fragmentShaderSrc;

  const shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
  const renderer = new Renderer(gl);
  const scene = new Scene(canvas.width, canvas.height);

  shader.use()
  // Program creation and shaders compiled
  var currLvl = 0;
  var currentLVL = level1;  

  var gridTileLength = 24;
  var mazeHorizontalOffset = canvas.width/2 - gridTileLength * currentLVL[0].length/2;
  var mazeVerticalOffset = canvas.height/2 - gridTileLength * currentLVL.length/2; 
  var mazeHOffset2 = canvas.width/2 - gridTileLength * currentLVL.length/2; 
  var mazeVOffset2 = canvas.height/2 - gridTileLength * currentLVL[0].length/2;

  var pacPos1 = [1, 1]
  var pacPos2 = [28, 1]
  var pacPos3 = [13, 2]
  var pacPosArr = [pacPos1, pacPos2, pacPos3]

  var mazeVertexList = []
  var pelletList = []
  var enemyList = []
  var enemyLocations = []
  var gridMarkers = []

  var mazeObjectList;
  var mazeMesh 
  var t = createLevel(currentLVL, mazeVertexList, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, pelletList, enemyList, enemyLocations, gridMarkers)
  mazeObjectList = t[0];
  mazeMesh = t[1];

  addMazeToScene(mazeObjectList, gridMarkers, scene)

  // Render pacman
  // Initially placing pacman at 0,0 and then calculating his position for each grid location. 
  var circle = new Circle (
    10, [0, 0], [1.0, 1.0, 0.0, 1]
  )
  circle.transform.rotateAboutLocalPoint(45 * Math.PI/180);
  
  scene.add(circle);

  var universalRotationPoint = [mazeHorizontalOffset + gridTileLength * currentLVL[0].length/2, mazeVerticalOffset + gridTileLength * currentLVL.length/2];
  var pacmanGridCoords = [1, 1];
  var pacmanLoc = [pacmanGridCoords[0]*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, pacmanGridCoords[1]*gridTileLength + gridTileLength/2 + mazeVerticalOffset]

  mazeMesh.transform.setRotationAxis(0,0,1);
  var pacmanSpeed = gridTileLength;

  circle.transform.setRotationAxis(0,0,1);
  circle.transform.translation(pacmanLoc[0], pacmanLoc[1])

  var modeFlag = true; //True means normal mode
  var currentOrientation = 0; //0 for original, 1 for 90 deg clockwise, 2 for 180, 3 for 270 
  var isPicked = false;
  var originalPos = [];

  document.addEventListener("mousedown", event => {
    var mouseX = event.clientX - 8;
    var mouseY = event.clientY - 8;
    // console.log([mouseX, mouseY])0
    // console.log([mazeHorizontalOffset, mazeVerticalOffset])

    var t = findGridCoords([mouseX, mouseY], currentOrientation, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, mazeHOffset2, mazeVOffset2, currentLVL);
    var gridX = t[2]
    var gridY = t[3]
    var actPosGridX = t[0]
    var actPosGridY = t[1]

    console.log([gridX, gridY])
    // console.log([actPosGridX, actPosGridY]);
    if(!modeFlag){
      
      // console.log([gridX, gridY])
      //if pacman has been picked
      if(isPicked) {
        // Check if new position is valid
        if(currentLVL[gridY][gridX] != 1) {
          console.log("paccer placed")
          pacmanGridCoords = [gridX, gridY]
          pacmanLoc = getPixelCoords([actPosGridX, actPosGridY], currentOrientation, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, mazeHOffset2, mazeVOffset2, currentLVL)
          circle.transform.setPosition(pacmanLoc[0], pacmanLoc[1])
        }
        else {
          pacmanLoc = getPixelCoords([originalPos[0], originalPos[1]], currentOrientation, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, mazeHOffset2, mazeVOffset2, currentLVL)
          circle.transform.setPosition(pacmanLoc[0], pacmanLoc[1])
        }
        isPicked = false;
      }
      
      //if pacman hasn't been picked
      else if(!isPicked) {
        if(gridX == pacmanGridCoords[0] && gridY == pacmanGridCoords[1]) {
          console.log("paccer picced")
          originalPos = pacmanGridCoords;
          isPicked = true;
        }
      }
    }
  })

  document.addEventListener("mousemove", event => {
    var mouseX = event.clientX - 8;
    var mouseY = event.clientY - 8;
    var t = findGridCoords([mouseX, mouseY], currentOrientation, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, mazeHOffset2, mazeVOffset2, currentLVL);
    var gridX = t[2]
    var gridY = t[3]
    var actPosGridX = t[0]
    var actPosGridY = t[1]
    if(!modeFlag){
      // console.log([gridX, gridY])
      //if pacman has been picked
      if(isPicked) {
        // Check if new position is valid
        if(currentLVL[gridY][gridX] != 1) {
          pacmanLoc = getPixelCoords([actPosGridX, actPosGridY], currentOrientation, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, mazeHOffset2, mazeVOffset2, currentLVL)
          circle.transform.setPosition(pacmanLoc[0], pacmanLoc[1])
        }
      }
    }
  })

  document.addEventListener("keydown", event => {
    console.log(pacmanGridCoords)
    if(event.key == "m") modeFlag = !modeFlag
    if(modeFlag){
    //Change map, delete all current elements, draw new one, reset pacman position
      if(event.key == 'c') {
        
        currentOrientation = 0
        console.log(currLvl);
        removeMazeFromScene(mazeObjectList, scene);
        if(currLvl == 0) currentLVL = level2;
        else if(currLvl == 1) currentLVL = level3;
        else if(currLvl == 2) currentLVL = level1;
        currLvl = (currLvl + 1)%3;

        mazeHorizontalOffset = canvas.width/2 - gridTileLength * currentLVL[0].length/2;
        mazeVerticalOffset = canvas.height/2 - gridTileLength * currentLVL.length/2; 
        mazeHOffset2 = canvas.width/2 - gridTileLength * currentLVL.length/2; 
        mazeVOffset2 = canvas.height/2 - gridTileLength * currentLVL[0].length/2;

        mazeVertexList = []
        pelletList = []
        enemyList = []
        enemyLocations = []
        gridMarkers = []

        t = createLevel(currentLVL, mazeVertexList, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, pelletList, enemyList, enemyLocations, gridMarkers)
        mazeObjectList = t[0];
        mazeMesh = t[1];
        console.log(mazeMesh)
        addMazeToScene(mazeObjectList, gridMarkers, scene)


        universalRotationPoint = [mazeHorizontalOffset + gridTileLength * currentLVL[0].length/2, mazeVerticalOffset + gridTileLength * currentLVL.length/2]

        scene.delete(circle);
        circle = new Circle (
          10, [0, 0], [1.0, 1.0, 0.0, 1]
        )
        circle.transform.rotateAboutLocalPoint(45 * Math.PI/180);
        circle.transform.setRotationAxis(0,0,1);
        circle.transform.translation(pacmanLoc[0], pacmanLoc[1])
        scene.add(circle);
        
        pacmanGridCoords = pacPosArr[currLvl]
        pacmanLoc = [pacmanGridCoords[0]*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, pacmanGridCoords[1]*gridTileLength + gridTileLength/2 + mazeVerticalOffset]
        // console.log(pacmanLoc);
        circle.transform.setPosition(pacmanLoc[0], pacmanLoc[1])

        // console.log(enemyList);
      }

      var movedThisEvent = false;
      var marker = getGridMarker(pacmanGridCoords, gridMarkers)

      // Rotate Pacman on its axis by 45 deg
      if(event.key == "0") {
        circle.transform.rotateAboutLocalPoint(45 * Math.PI/180);
      }
      if(event.key == "9") {
        circle.transform.rotateAboutLocalPoint(-45 * Math.PI/180);
      }

      if(event.key == "8") {
        circle.transform.rotateAboutGlobalPoint(15 * Math.PI/180);
        // console.log(circle.getPosition())
      }
      if(event.key == "7") {
        circle.transform.rotateAboutGlobalPoint(-15 * Math.PI/180);
        // console.log(circle.getPosition())
      }

      // Scale key for debugguing
      if(event.key == "t") {
        circle.transform.setScale(1.5, 1.5, 1);
      }

      // Code that checks if next position of pacman is valid or not
      var bool1 = currentLVL[pacmanGridCoords[1]][pacmanGridCoords[0]+1] != 1
      let f1 = (pacmanGridCoords) => {
        // console.log("test")
        pacmanGridCoords[0]++;
      }
      var bool2 = currentLVL[pacmanGridCoords[1]+1][pacmanGridCoords[0]] != 1
      let f2 = (pacmanGridCoords) => pacmanGridCoords[1]++;
      var bool3 = currentLVL[pacmanGridCoords[1]][pacmanGridCoords[0]-1] != 1
      let f3 = (pacmanGridCoords) => pacmanGridCoords[0]--;
      var bool4 = currentLVL[pacmanGridCoords[1]-1][pacmanGridCoords[0]] != 1
      let f4 = (pacmanGridCoords) => pacmanGridCoords[1]--;

      if(currentOrientation == 0) {
        var bools = [bool1, bool2, bool3, bool4];
        var funcs = [f1, f2, f3, f4];
      }
      else if(currentOrientation == 1) {
        var bools = [bool4, bool1, bool2, bool3];
        var funcs = [f4, f1, f2, f3];
      }
      else if(currentOrientation == 2) {
        var bools = [bool3, bool4, bool1, bool2];
        var funcs = [f3, f4, f1, f2];
      }
      else if(currentOrientation == 3) {
        var bools = [bool2, bool3, bool4, bool1];
        var funcs = [f2, f3, f4, f1];
      }


      if(event.key == "ArrowRight") {
        if(bools[0]) {
          funcs[0](pacmanGridCoords);
          circle.transform.translation(pacmanSpeed, 0);
          circle.transform.setAngleAboutLocalPoint(45 * Math.PI/180);
          movedThisEvent = true;
        }
      }
      if(event.key == "ArrowDown") {
      if(bools[1]) {
          funcs[1](pacmanGridCoords);
          circle.transform.translation(0, pacmanSpeed);
          circle.transform.setAngleAboutLocalPoint(135 * Math.PI/180);
          movedThisEvent = true;
        }
      }
      if(event.key == "ArrowLeft") {
        if(bools[2]) {
          funcs[2](pacmanGridCoords);
          circle.transform.translation(-pacmanSpeed, 0);
          circle.transform.setAngleAboutLocalPoint(225 * Math.PI/180);
          movedThisEvent = true;
        }
      }
      if(event.key == "ArrowUp") {
        // console.log("pressed ArrowUp");
        // console.log("Tried to move to: ", pacmanGridCoords[1],pacmanGridCoords[0] - 1, " Val: ", currentLVL[pacmanGridCoords[1]-1][pacmanGridCoords[0]])
        if(bools[3]) {
          funcs[3](pacmanGridCoords);
          circle.transform.translation(0, -pacmanSpeed);
          circle.transform.setAngleAboutLocalPoint(315 * Math.PI/180);
          movedThisEvent = true;
        }
      }

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
      if(event.key == "]") {
        currentOrientation = (currentOrientation + 1)%4;

        mazeMesh.transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
        mazeMesh.transform.setRotationAxis(0,0,1)
        mazeMesh.transform.rotateAboutLocalPoint(90 * Math.PI/180);

        for(var i = 0; i < gridMarkers.length; i++) {
          gridMarkers[i].transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
          gridMarkers[i].transform.setRotationAxis(0,0,1);
          gridMarkers[i].transform.rotateAboutLocalPoint(90 * Math.PI/180);
        }
        for(var i = 0; i < pelletList.length; i++) {
          pelletList[i].transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
          pelletList[i].transform.setRotationAxis(0,0,1);
          pelletList[i].transform.rotateAboutLocalPoint(90 * Math.PI/180);
        }
        for(var i = 0; i < enemyList.length; i++) {
          var marker = getGridMarker(enemyList[i].gridCoords, gridMarkers);
          var nextPos = marker.getPosition()
          enemyList[i].transform.setPosition(nextPos[0] - enemyList[i].center[0], nextPos[1] - enemyList[i].center[1])
        }
        var marker = getGridMarker(pacmanGridCoords, gridMarkers)

        var nextPos = marker.getPosition()
        circle.transform.setPosition(nextPos[0], nextPos[1])
        circle.transform.rotateAboutLocalPoint(90*Math.PI/180)


      }

      if(event.key == "[") {
        if(currentOrientation == 0) currentOrientation = 3
        else currentOrientation--;
        
        mazeMesh.transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
        mazeMesh.transform.setRotationAxis(0,0,1)
        mazeMesh.transform.rotateAboutLocalPoint(-90 * Math.PI/180);

        for(var i = 0; i < gridMarkers.length; i++) {
          gridMarkers[i].transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
          gridMarkers[i].transform.setRotationAxis(0,0,1);
          gridMarkers[i].transform.rotateAboutLocalPoint(-90 * Math.PI/180);
        }
        for(var i = 0; i < pelletList.length; i++) {
          pelletList[i].transform.setRotationPoint(universalRotationPoint[0], universalRotationPoint[1], 0);
          pelletList[i].transform.setRotationAxis(0,0,1);
          pelletList[i].transform.rotateAboutLocalPoint(-90 * Math.PI/180);
        }
        for(var i = 0; i < enemyList.length; i++) {
          var marker = getGridMarker(enemyList[i].gridCoords, gridMarkers);
          var nextPos = marker.getPosition()
          enemyList[i].transform.setPosition(nextPos[0] - enemyList[i].center[0], nextPos[1] - enemyList[i].center[1])
        }
        var marker = getGridMarker(pacmanGridCoords, gridMarkers)

        var nextPos = marker.getPosition()
        circle.transform.setPosition(nextPos[0], nextPos[1])
        circle.transform.rotateAboutLocalPoint(-90*Math.PI/180)
      }
  }
  })

  renderer.setAnimationLoop(animation);

  function animation () {
    gl.clearColor(0.0, 0.0, 0.0, 0.1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderer.render(scene, shader);
  }
}



// function rotatePointAboutPoint(pixelPosition, rotationPoint, angle) {
//   var res = vec3.create()
// }

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
