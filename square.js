import { Triangle } from "./triangle.js";
import { Transform } from "./transform.js";

export class Square {
    constructor(topLeftCorner, length, color) {
        this.topLeftCorner = topLeftCorner;
        this.length = length;
        this.color = color
        this.type = "square";

        this.vertexList = [
            topLeftCorner[0], topLeftCorner[1], 0,
            topLeftCorner[0] + length, topLeftCorner[1], 0,
            topLeftCorner[0], topLeftCorner[1] + length, 0,
            topLeftCorner[0], topLeftCorner[1] + length, 0,
            topLeftCorner[0] + length, topLeftCorner[1], 0,
            topLeftCorner[0] + length, topLeftCorner[1] + length, 0,
        ];
        this.triangleList = [];

        this.transform = new Transform()
        this.transform.rotationPoint = [topLeftCorner[0] + length/2, topLeftCorner[1] + length/2, 0];
    }

    changeColor(color) {
        this.color = color;
    }
}