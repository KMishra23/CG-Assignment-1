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
		this.rotationPoint = [0, 0, 0];
		this.globalRotationPoint = [0, 0, 0]; 
		this.globalAngle = 0;
		this.rotationAxis = vec3.create();
		vec3.set(this.rotationAxis, 0, 0, 0);

		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);
		// console.log(this.modelTransformMatrix)

		this.lastTransformMatrix = this.modelTransformMatrix;

		this.updateModelTransformMatrix();
	}

	updateModelTransformMatrix()
	{	
		// @ToDO
		// 1. Reset the transformation matrix
		// 2. Use the current transformations values to calculate the latest transformation matrix
		// var flag = false;
		// if(this.lastTransformMatrix == this.modelTransformMatrix) flag = false
		var identity = mat4.create()
		mat4.identity(identity);
        // mat4.identity(this.modelTransformMatrix);
		// translation
		this.translationMat = mat4.create();
		mat4.translate(this.translationMat, identity, this.translate);
		// console.log(this.translationMat)

		//rotation about the set point (either origin or if some other point set by the shape)
		// first, translate to origin about that point
		this.rotationMat = mat4.create();
		var temp = vec3.create();
		vec3.set(temp, this.rotationPoint[0], this.rotationPoint[1], this.rotationPoint[2]);
		mat4.translate(this.rotationMat, identity, temp);
		mat4.rotate(this.rotationMat, this.rotationMat, this.rotationAngle, this.rotationAxis);
		vec3.set(temp, -this.rotationPoint[0], -this.rotationPoint[1], -this.rotationPoint[2]);
		mat4.translate(this.rotationMat, this.rotationMat, temp);

		this.rotationMat2 = mat4.create();
		var temp = vec3.create();
		vec3.set(temp, this.globalRotationPoint[0], this.globalRotationPoint[1], this.globalRotationPoint[2]);
		mat4.translate(this.rotationMat2, identity, temp);
		mat4.rotate(this.rotationMat2, this.rotationMat2, this.globalAngle, this.rotationAxis);
		vec3.set(temp, -this.globalRotationPoint[0], -this.globalRotationPoint[1], -this.globalRotationPoint[2]);
		mat4.translate(this.rotationMat2, this.rotationMat2, temp);

		// Scaling
		this.scalingMat = mat4.create();
		var temp = vec3.create();
		vec3.set(temp, this.rotationPoint[0], this.rotationPoint[1], this.rotationPoint[2]);
		mat4.translate(this.scalingMat, identity, temp);
		mat4.scale(this.scalingMat, this.scalingMat, this.scale);
		vec3.set(temp, -this.rotationPoint[0], -this.rotationPoint[1], -this.rotationPoint[2]);
		mat4.translate(this.scalingMat, this.scalingMat, temp);

		// Linear transformation
		mat4.multiply(this.modelTransformMatrix, this.translationMat, this.rotationMat2);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, this.scalingMat);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationMat);
		
		// if(flag) this.lastTransformMatrix = this.modelTransformMatrix
	}	

	translation(changeX, changeY) {
		vec3.set(this.translate, this.translate[0]+changeX, this.translate[1]+changeY, 0);
		// console.log(this.translate);
	}

	setPosition(x, y) {
		vec3.set(this.translate, x, y, 0);
	}

	rotateAboutLocalPoint(angle) {
		this.rotationAngle += angle;
		// console.log(this.rotationMat)
		// vec3.set(this.rotationAxis, 0+x, 0+y, 0+z);
	}

	rotateAboutGlobalPoint(angle) {
		this.globalAngle += angle;
		// console.log(this.rotationMat)
		// vec3.set(this.rotationAxis, 0+x, 0+y, 0+z);
	}

	setAngleAboutLocalPoint(angle) {
		this.rotationAngle = angle;
	}

	setAngleAboutGlobalPoint(angle) {
		this.globalAngle = angle;
	}

	setRotationAxis(x, y, z) {
		vec3.set(this.rotationAxis, x, y, z);
	}
	
	setRotationPoint(x, y, z) {
		this.rotationPoint = [x, y, z];
	}
	setGlobalRotationPoint(x, y, z) {
		this.globalRotationPoint = [x, y, z];
	}

	setScale(x, y, z) {
		vec3.set(this.scale, x, y, z);
	}

	getPosition() {
		// var temp = mat4.create()
		// mat4.identity(temp)
		// mat4.translate(temp, temp, this.translate)
		return this.modelTransformMatrix
	}
}