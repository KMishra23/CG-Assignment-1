// this is where we get all the primitives from the scene, then render them all in the animation loop

export class Renderer {
    constructor(gl) {
        this.gl = gl;
        // this.program = program;
        // this.positionBuffer = this.gl.createBuffer();
    }

    setAnimationLoop(animation) {
        function renderLoop() {
            animation();
            window.requestAnimationFrame(renderLoop);
        }

        renderLoop();
    }

    render(scene, shader) {
        scene.primitives.forEach(function(primitive) {
            // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            // gl.bufferData(gl., primitive.vertexList, gl.DYNAMIC_DRAW);
            primitive.transform.updateModelTransformMatrix();

            shader.setUniformMatrix4fv("u_model_matrix", primitive.transform.modelTransformMatrix);

            shader.bindBuffer(primitive.vertexList, shader.positionBuffer);
        

            var size = 3;
            var type = shader.gl.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            // gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
            // gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), size, type, normalize, stride, offset);
            shader.fillAttributeData("a_position", size, type, normalize, stride, offset);

            // console.log(scene.canvasHeight)
            shader.setUniform2f("u_resolution",[scene.canvasWidth, scene.canvasHeight]);
            
            // gl.uniform4f(gl.getUniformLocation(program, "uColor"), primitive.color[0], primitive.color[1], primitive.color[2], primitive.color[3]);
            shader.setUniform4f("u_color", primitive.color);

            var primitiveType = shader.gl.TRIANGLES;
            var count = primitive.vertexList.length / 3;
            shader.drawArrays(primitiveType, count);
            // gl.drawArrays(primitiveType, offset, count);
        })


    }
}