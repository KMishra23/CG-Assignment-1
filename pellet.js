import { Transform } from "./transform.js";

export class Pellet {
    constructor(center, size, gridCoords, color, type) {
        this.center = center;
        this.color = color;
        this.isVisited = false;
        this.gridCoords = gridCoords;
        this.type = type;

        this.vertexList = [];
        for(var i = 0; i < 4; i++) {
            this.vertexList.push(center[0], center[1], 0);
            this.vertexList.push(center[0] + size * Math.cos(2*Math.PI*i/4), center[1] + size * Math.sin(2*Math.PI*i/4), 0);
            this.vertexList.push(center[0] + size * Math.cos(2*Math.PI*(i+1)/4), center[1] + size * Math.sin(2*Math.PI*(i+1)/4), 0)
        }

        this.transform = new Transform;
        this.transform.rotationPoint = [center[0], center[1], 0];
    }

    changeColor(color) {
        this.color = color;
    }

    markVisited() {
        this.isVisited = true;
    }

    getPosition() {
        return this.center;
    }
}