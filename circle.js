import { Transform } from "./transform.js";
import { Triangle } from "./triangle.js";
import { vec3, mat4, vec4, mat3 } from 'https://cdn.skypack.dev/gl-matrix';


export class Circle {
    constructor(radius, center, color) {
        this.radius = radius;
        this.center = center;
        this.color = color;
        this.type = "circle";
        this.globalCenter = [];

        this.numTriangles = 20;
        this.vertexList = [];
        this.triangleList = [];

        this.transform = new Transform
        // console.log(center)
        // this.transform.rotationPoint = [center[0] + 10, center[1] + 10, 0]

        for(var i = 0; i < this.numTriangles; i++) {
            if(i < 3*this.numTriangles/4) {
                this.vertexList.push(center[0], center[1], 0);
                this.vertexList.push(center[0] + radius * Math.cos(2*Math.PI*i/this.numTriangles), center[1] + radius * Math.sin(2*Math.PI*i/this.numTriangles), 0);
                this.vertexList.push(center[0] + radius * Math.cos(2*Math.PI*(i+1)/this.numTriangles), center[1] + radius * Math.sin(2*Math.PI*(i+1)/this.numTriangles), 0);
            }

            const newT = new Triangle (
                [center[0], center[1], 0],
                [center[0] + radius * Math.cos(2*Math.PI*i/this.numTriangles), center[1] + radius * Math.sin(2*Math.PI*i/this.numTriangles), 0],
                [center[0] + radius * Math.cos(2*Math.PI*(i+1)/this.numTriangles), center[1] + radius * Math.sin(2*Math.PI*(i+1)/this.numTriangles), 0],
                [1, 0.0, 0.5, 1],
                this.rotationPoint,
            )
            this.triangleList.push(newT)
        }
        // console.log(this.vertexList);

        
    }

    getPosition() {
        this.transform.updateModelTransformMatrix()
        var out = vec3.create()
        var pos = vec3.create()
        vec3.set(pos, this.center[0], this.center[0], 0)
        return vec3.transformMat4(out, pos, this.transform.modelTransformMatrix)
    }

    restoreRotationPoint() {
        this.transform.rotatePoint = [this.center[0], this.center[1], 0];
    }
}