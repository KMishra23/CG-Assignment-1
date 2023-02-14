import { vec3, mat4, vec4, mat3 } from 'https://cdn.skypack.dev/gl-matrix';

export class Transform
{
	constructor()
	{
		this.translate = vec3.create();
		vec3.set(this.translate, 0, 0, 0);
		
		this.scale = vec3.create();
		vec3.set(this.scale, 1, 1, 1);
		
		this.rotationAngle = 0;
		this.rotationPoint = [0, 0, 0]
		this.rotationAxis = vec3.create();
		vec3.set(this.rotationAxis, 0, 0, 0);

		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);
		// console.log(this.modelTransformMatrix)

		this.updateModelTransformMatrix();
	}

	updateModelTransformMatrix()
	{	
		// @ToDO
		// 1. Reset the transformation matrix
		// 2. Use the current transformations values to calculate the latest transformation matrix

        mat4.identity(this.modelTransformMatrix);
		// translation
		this.translationMat = mat4.create();
		mat4.translate(this.translationMat, this.modelTransformMatrix, this.translate);

		//rotation about the set point (either origin or if some other point set by the shape)
		// first, translate to origin about that point
		this.rotationMat = mat4.create();
		var temp = vec3.create();
		vec3.set(temp, this.rotationPoint[0], this.rotationPoint[1], this.rotationPoint[2]);
		mat4.translate(this.rotationMat, this.modelTransformMatrix, temp);
		mat4.rotate(this.rotationMat, this.rotationMat, this.rotationAngle, this.rotationAxis);
		vec3.set(temp, -this.rotationPoint[0], -this.rotationPoint[1], -this.rotationPoint[2]);
		mat4.translate(this.rotationMat, this.rotationMat, temp);

		// Scaling
		this.scalingMat = mat4.create();
		var temp = vec3.create();
		vec3.set(temp, this.rotationPoint[0], this.rotationPoint[1], this.rotationPoint[2]);
		mat4.translate(this.scalingMat, this.modelTransformMatrix, temp);
		mat4.scale(this.scalingMat, this.scalingMat, this.scale);
		vec3.set(temp, -this.rotationPoint[0], -this.rotationPoint[1], -this.rotationPoint[2]);
		mat4.translate(this.scalingMat, this.scalingMat, temp);

		// Linear transformation
		mat4.multiply(this.modelTransformMatrix, this.translationMat, this.scalingMat);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationMat);

	}	

	translation(changeX, changeY) {
		vec3.set(this.translate, this.translate[0]+changeX, this.translate[1]+changeY, 0);
		// console.log(this.translate);
	}

	setPosition(x, y) {
		vec3.set(this.translate, x, y, 0);
	}

	rotateAboutSetAxis(angle) {
		this.rotationAngle += angle;
		// console.log(this.rotationMat)
		// vec3.set(this.rotationAxis, 0+x, 0+y, 0+z);
	}

	setAngleAboutSetAxis(angle) {
		this.rotationAngle = angle;
	}

	setRotationAxis(x, y, z) {
		vec3.set(this.rotationAxis, x, y, z);
	}
	
	setRotationPoint(x, y, z) {
		this.rotationPoint = [x, y, z];
	}

	setScale(x, y, z) {
		vec3.set(this.scale, x, y, z);
	}
}