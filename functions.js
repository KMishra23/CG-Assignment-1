import { Square } from "./square.js";
import { Pellet } from "./pellet.js";
import { Triangle } from "./triangle.js";
import { Shape } from "./shape.js";
import { Invisible } from "./invisible.js";

export function createLevel(levelData, mazeVertexList, gridTileLength, mazeHorizontalOffset, mazeVerticalOffset, pelletList, enemyList, enemyLocations, gridMarkers) {
    var objectList = []
    
    const enemyColorList = [
      [255/255, 0, 0, 1],
      [255/255, 184/255, 255/255, 1],
      [255/255, 184/255, 82/255, 1],
      [0, 255/255, 255/255, 1]
    ]
    var iter = 0;
  
    for(var row = 0; row < levelData.length; row++) {
      for(var col = 0; col < levelData[0].length; col++) {
        // console.log(levelData[row][col]);
        if(levelData[row][col] == 1) { //Add walls
          // console.log(col*10, " ", row*10);
          
          var sqr = new Square([col*gridTileLength + mazeHorizontalOffset, row*gridTileLength + mazeVerticalOffset], gridTileLength, [0.0, 0.0, 1.0, 0.7]);
          // maze1Blocks.push(sqr);
          mazeVertexList = mazeVertexList.concat(sqr.vertexList);
          var gridMarker = new Invisible([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], [col, row], "wallMarker")
          gridMarkers.push(gridMarker)
          // scene.add(sqr);
        }
        else if(levelData[row][col] == 2) { //Add normal pellet
          var pellet = new Pellet([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], 3, [col, row], [1.0, 0.7, 0.0, 1], "pellet");
          pelletList.push(pellet);
          objectList.push(pellet);
          var gridMarker = new Invisible([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], [col, row], "pelletMarker")
          gridMarkers.push(gridMarker)
          //   scene.add(pellet); 
          // console.log(pellet.gridCoords);
        }
        else if(levelData[row][col] == 3) { //Add Power Pellet'
          var pellet = new Pellet([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], 7, [col, row], [1.0, 0.2, 0.2, 1], "powerPellet");
          pelletList.push(pellet);
          objectList.push(pellet);
          var gridMarker = new Invisible([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], [col, row], "powerPelletMarker")
          gridMarkers.push(gridMarker)
          //   scene.add(pellet);
          // console.log(pellet.gridCoords)
        }
        else if(levelData[row][col] == 4) { //Add enemies
          var triangle = new Triangle(
            [col*gridTileLength + mazeHorizontalOffset, row*gridTileLength + mazeVerticalOffset + gridTileLength - 5],
            [col*gridTileLength + mazeHorizontalOffset + gridTileLength, row*gridTileLength + mazeVerticalOffset + gridTileLength - 5],
            [col*gridTileLength + mazeHorizontalOffset + gridTileLength/2, row*gridTileLength + mazeVerticalOffset + gridTileLength/2- 5],
            enemyColorList[iter],
            [0, 0, 0],
          )
          iter++;
          enemyList.push(triangle);
          objectList.push(triangle);
          var gridMarker = new Invisible([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], [col, row], "enemyMarker")
          gridMarkers.push(gridMarker)
          enemyLocations.push([col, row])
          //   scene.add(triangle)
        }
        else {
          var gridMarker = new Invisible([col*gridTileLength + gridTileLength/2 + mazeHorizontalOffset, row*gridTileLength + gridTileLength/2 + mazeVerticalOffset], [col, row], "emptyMarker")
          gridMarkers.push(gridMarker)
        }
      }
    }
    var mazeMesh = new Shape(mazeVertexList, [0, 0], [0.0, 0.4, 1.0, 1.0], "maze");
    objectList.push(mazeMesh);
    // scene.add(mazeMesh);
  
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
        scene.remove(object);
    });
}

export function translatePacman(pacmanGridCoords, currLvlData) {
    
}