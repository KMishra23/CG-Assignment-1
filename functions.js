import { Square } from "./primitives/square.js";
import { Pellet } from "./primitives/pellet.js";
import { Triangle } from "./primitives/triangle.js";
import { Shape } from "./primitives/shape.js";
import { Invisible } from "./primitives/invisible.js";

export function createLevel(levelData, mazeVertexList, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, pelletList, enemyList, enemyLocations, gridMarkers) {
    var objectList = []
    
    const enemyColorList = [
      [255/255, 0, 0, 1],
      [255/255, 184/255, 255/255, 1],
      [255/255, 184/255, 82/255, 1],
      [0, 255/255, 255/255, 1]
    ]
    var iter = 0;
    
    // mazeVertexList = []
    // pelletList = []
    // enemyList = []
    // gridMarkers = []
    // objectList = []

    for(var row = 0; row < levelData.length; row++) {
      for(var col = 0; col < levelData[0].length; col++) {
        // console.log(levelData[row][col]);
        if(levelData[row][col] == 1) { //Add walls
          
          var sqr = new Square([col*gridTileLength + mazeHorizontalOffset, row*gridTileLength + mazeVerticalOffset], gridTileLength, [0.0, 0.0, 1.0, 0.7]);
          mazeVertexList = mazeVertexList.concat(sqr.vertexList);
          // var gridMarker = new Invisible([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], [col, row], "wallMarker")
          // gridMarkers.push(gridMarker)
        }
        else if(levelData[row][col] == 2) { //Add normal pellet
          var pellet = new Pellet([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], 3, [col, row], [1.0, 0.7, 0.0, 1], "pellet");
          pelletList.push(pellet);
          objectList.push(pellet);
          var gridMarker = new Invisible([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], [col, row], "pelletMarker")
          gridMarkers.push(gridMarker)
        }
        else if(levelData[row][col] == 3) { //Add Power Pellet'
          var pellet = new Pellet([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], 7, [col, row], [1.0, 0.2, 0.2, 1], "powerPellet");
          pelletList.push(pellet);
          objectList.push(pellet);
          // var gridMarker = new Invisible([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], [col, row], "powerPelletMarker")
          // gridMarkers.push(gridMarker)
        }
        else if(levelData[row][col] == 4) { //Add enemies
          var triangle = new Triangle(
            [col*gridTileLength + mazeHorizontalOffset, row*gridTileLength + mazeVerticalOffset + gridTileLength - 5],
            [col*gridTileLength + mazeHorizontalOffset + gridTileLength, row*gridTileLength + mazeVerticalOffset + gridTileLength - 5],
            [col*gridTileLength + mazeHorizontalOffset + gridTileLength/2, row*gridTileLength + mazeVerticalOffset + gridTileLength/2- 5],
            enemyColorList[iter],
            [0, 0, 0],
            [col, row]
          )
          iter++;
          enemyList.push(triangle);
          objectList.push(triangle);
          // var gridMarker = new Invisible([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], [col, row], "enemyMarker")
          // gridMarkers.push(gridMarker)
          enemyLocations.push([col, row])
        } 
        var gridMarker = new Invisible([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], [col, row], "emptyMarker")
        gridMarkers.push(gridMarker)
        objectList.push(gridMarker)
        // if(row == 1 && col == 1){
        //   console.log(gridMarker.getPosition())
        // }
      }
    }
    var mazeMesh = new Shape(mazeVertexList, [0, 0], [0.0, 0.4, 1.0, 1.0], "maze");
    objectList.push(mazeMesh);
  
    return [objectList, mazeMesh];
  }


export function addMazeToScene(objectList, gridMarkers, scene) {
    objectList.forEach(function(object) {
        scene.add(object);
    });
    gridMarkers.forEach(function(marker) {
      scene.add(marker);
    })
}

export function removeMazeFromScene(objectList, scene) {
    objectList.forEach(function(object) {
        scene.delete(object);
    });
}

export function getCoordsAfterTransform(pixelCoords, rotationAngle, universalRotationPoint) {
  var position = vec3.create();
  vec3.set(position, 0, 0, 0);
  
  var transformMatrix = mat4.create();
  mat4.identity(transformMatrix);

  var identity = mat4.create();
  mat4.identity(identity);

  var pixelCoords = pixelCoords
  // console.log(pixelCoords)
  // console.log(pixelCoords);
  var translate = vec3.create();
  var translationMat = mat4.create();
  vec3.set(translate, pixelCoords[0], pixelCoords[1], 0)
  mat4.translate(translationMat, identity, translate);
  // console.log(translationMat)

  // console.log(universalRotationPoint);
  var rotationPoint = [universalRotationPoint[0] - pixelCoords[0], universalRotationPoint[1] - pixelCoords[1]]
  // console.log(rotationPoint)
  var temp = vec3.create()
  vec3.set(temp, rotationPoint[0], rotationPoint[1], 0);
  var rotationAxis = vec3.create()
  vec3.set(rotationAxis, 0, 0, 1);

  var rotationMat = mat4.create()
  mat4.translate(rotationMat, identity, temp);
  mat4.rotate(rotationMat, rotationMat, rotationAngle, rotationAxis);
  vec3.set(temp, -universalRotationPoint[0] - pixelCoords[0], -universalRotationPoint[1] - pixelCoords[1], 0);
  mat4.translate(rotationMat, rotationMat, temp);
  // console.log(rotationMat)

  mat4.multiply(transformMatrix, translationMat, rotationMat)
  vec3.transformMat4(position, position, transformMatrix);
  // console.log(position)
  return position;
}

export function getGridMarker(gridCoords, gridMarkers){
  // console.log(gridCoords);
  for(var i = 0; i < gridMarkers.length; i++) {
    if(gridMarkers[i].gridCoords[0] == gridCoords[0] && gridMarkers[i].gridCoords[1] == gridCoords[1]) {
      // console.log("bro")
      return gridMarkers[i]
    }
  }
  // console.log("marker not found");
}

export function findGridCoords(pixelPosition, currentOrientation, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, m2H, m2V, level) {
  if(currentOrientation == 0) {
    var gridX = Math.floor((pixelPosition[0] - mazeHorizontalOffset)/gridTileLength)
    var gridY = Math.floor((pixelPosition[1] - mazeVerticalOffset)/gridTileLength)
    return [gridX, gridY, gridX, gridY]
  }
  else if(currentOrientation == 1) {
    var gridX = Math.floor((pixelPosition[0] - m2H)/gridTileLength)
    var gridY = Math.floor((pixelPosition[1] - m2V)/gridTileLength)
    return [gridX, gridY, gridY, level.length - 1 - gridX]
  }
  else if(currentOrientation == 2) {
    var gridX = Math.floor((pixelPosition[0] - mazeHorizontalOffset)/gridTileLength)
    var gridY = Math.floor((pixelPosition[1] - mazeVerticalOffset)/gridTileLength)
    return [gridX, gridY, level[0].length - 1 - gridX, level.length - 1 - gridY]
  }
  else if(currentOrientation == 3) {
    var gridX = Math.floor((pixelPosition[0] - m2H)/gridTileLength)
    var gridY = Math.floor((pixelPosition[1] - m2V)/gridTileLength)
    return [gridX, gridY, level[0].length - 1 - gridY, gridX]
  }
}

export function getPixelCoords(gridCoords, currentOrientation, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, m2H, m2V, level) {
  if(currentOrientation == 0) {
    var posX = gridCoords[0] * gridTileLength + gridTileLength/2 + mazeHorizontalOffset;
    var posY = gridCoords[1] * gridTileLength + gridTileLength/2 + mazeVerticalOffset;
    return [posX, posY];
  }
  else if(currentOrientation == 1) {
    var posX = gridCoords[0] * gridTileLength + gridTileLength/2 + m2H;
    var posY = gridCoords[1] * gridTileLength + gridTileLength/2 + m2V;
    return [posX, posY];
  }
  else if(currentOrientation == 2) {
    var posX = gridCoords[0] * gridTileLength + gridTileLength/2 + mazeHorizontalOffset;
    var posY = gridCoords[1] * gridTileLength + gridTileLength/2 + mazeVerticalOffset;
    return [posX, posY];
  }
  else if(currentOrientation == 3) {
    var posX = gridCoords[0] * gridTileLength + gridTileLength/2 + m2H;
    var posY = gridCoords[1] * gridTileLength + gridTileLength/2 + m2V;
    return [posX, posY];
  }
}