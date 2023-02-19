import { Transform } from "./transform.js";
import { vec3, mat4, vec4, mat3 } from 'https://cdn.skypack.dev/gl-matrix';

export class Invisible {
    constructor(centre, gridCoords, type) {
        this.centre = centre;
        this.gridCoords = gridCoords;
        this.color = [0,0,0,0]
        this.type = type

        this.vertexList = []

        this.transform = new Transform;
        this.transform.rotationPoint = [centre[0], centre[1], 0];
    }
    getPosition() {
        this.transform.updateModelTransformMatrix()
        var out = vec3.create()
        var pos = vec3.create()
        vec3.set(pos, this.centre[0], this.centre[0], 0)
        vec3.transformMat4(out, pos, this.transform.modelTransformMatrix)
        return out
    }
    getCenter() {
        var pos = vec3.create()
        vec3.set(pos, this.centre[0], this.centre[0], 0)
        return pos
    }
}