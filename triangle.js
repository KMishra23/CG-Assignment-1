import { Transform } from './transform.js';

export class Triangle {
    constructor(v1, v2, v3, color, rotationCenter) {
        this.vertexList = new Float32Array ([
            // x , y , z
            v1[0], v1[1], 0,
            v2[0], v2[1], 0,
            v3[0], v3[1], 0,
        ])

        this.type = 'triangle';
        this.color = color;
        this.originalColor = color;
        this.transform = new Transform
        this.transform.rotationPoint = rotationCenter;
    }

    changeColor(color){
        this.color = color;
    }
    restoreColor(color) {
        this.color = this.originalColor;
    }
}