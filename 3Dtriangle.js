import { Transform } from './transform.js';

export class Triangle3D {
    constructor(v1, v2, v3, color) {
        this.vertexList = new Float32Array ([
            // x , y , z
            v1[0], v1[1], v1[2],
            v2[0], v2[1], v2[2],
            v3[0], v3[1], v3[2],
        ])

        this.type = 'triangle3D';
        this.color = color;
        this.transform = new Transform
    }
}