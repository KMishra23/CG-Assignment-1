import { Transform } from "./transform.js";
import { Triangle } from "./triangle.js";

export class Circle {
    constructor(radius, centrePos, color) {
        this.radius = radius;
        this.centrePos = centrePos;
        this.color = color;
        this.type = "circle";

        this.numTriangles = 20;
        this.vertexList = [];
        this.triangleList = [];

        this.transform = new Transform
        this.transform.rotationPoint = [centrePos[0], centrePos[1], 0]

        for(var i = 0; i < this.numTriangles; i++) {
            if(i < 3*this.numTriangles/4) {
                this.vertexList.push(centrePos[0], centrePos[1], 0);
                this.vertexList.push(centrePos[0] + radius * Math.cos(2*Math.PI*i/this.numTriangles), centrePos[1] + radius * Math.sin(2*Math.PI*i/this.numTriangles), 0);
                this.vertexList.push(centrePos[0] + radius * Math.cos(2*Math.PI*(i+1)/this.numTriangles), centrePos[1] + radius * Math.sin(2*Math.PI*(i+1)/this.numTriangles), 0);
            }

            const newT = new Triangle (
                [centrePos[0], centrePos[1], 0],
                [centrePos[0] + radius * Math.cos(2*Math.PI*i/this.numTriangles), centrePos[1] + radius * Math.sin(2*Math.PI*i/this.numTriangles), 0],
                [centrePos[0] + radius * Math.cos(2*Math.PI*(i+1)/this.numTriangles), centrePos[1] + radius * Math.sin(2*Math.PI*(i+1)/this.numTriangles), 0],
                [1, 0.0, 0.5, 1],
                this.rotationPoint,
            )
            this.triangleList.push(newT)
        }
        // console.log(this.vertexList);

        
    }
}