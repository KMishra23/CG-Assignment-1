import { Transform } from '../transform.js';
import { vec3, mat4, vec4, mat3 } from 'https://cdn.skypack.dev/gl-matrix';

export class Triangle {
    constructor(v1, v2, v3, color, rotationCenter, gridCoords) {
        this.vertexList = new Float32Array ([
            // x , y , z
            v1[0], v1[1], 0,
            v2[0], v2[1], 0,
            v3[0], v3[1], 0,
        ])

        this.type = 'triangle';
        this.gridCoords = gridCoords;
        this.color = color;
        this.originalColor = color;
        this.transform = new Transform
        this.center = [(v1[0] + v2[0] + v3[0])/3, (v1[1] + v2[1] + v3[1])/3]
    }
    getPosition() {
        this.transform.updateModelTransformMatrix()
        var out = vec3.create()
        var pos = vec3.create()
        vec3.set(pos, this.center[0], this.center[1], 0)
        vec3.transformMat4(out, pos, this.transform.modelTransformMatrix)
        return out
    }

    changeColor(color){
        this.color = color;
    }
    restoreColor(color) {
        this.color = this.originalColor;
    }
}