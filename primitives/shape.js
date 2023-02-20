import { Transform } from "../transform.js";

export class Shape {
    constructor(vertexList, referencePoint, color, type) {
        this.vertexList = vertexList;
        this.referencePoint = referencePoint;
        this.color = color;
        this.type = type;

        this.transform = new Transform;
        this.transform.rotationPoint = [referencePoint[0], referencePoint[1], 0];
    }
    getPosition() {
        return [this.referencePoint[0] + this.transform.translate[0], this.referencePoint[1] + this.transform.translate[1]];
    }
}