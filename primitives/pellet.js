import { Transform } from "../transform.js";
import { vec3, mat4, vec4, mat3 } from 'https://cdn.skypack.dev/gl-matrix';

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
        this.transform.updateModelTransformMatrix()
        var out = vec3.create()
        var pos = vec3.create()
        vec3.set(pos, this.center[0], this.center[1], 0)
        return vec3.transformMat4(out, pos, this.transform.lastTransformMatrix)
    }
}