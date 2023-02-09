export class Shader{
    constructor(gl, vertexShaderSrc, fragmentShaderSrc) {
        this.gl = gl;
        this.vertexShaderSrc = vertexShaderSrc;
        this.fragmentShaderSrc = fragmentShaderSrc;

        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSrc);
        this.fragmentShader= this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSrc);
        
        this.program = this.createProgram(this.vertexShader, this.fragmentShader);
        // console.log(this.program);
        
        this.positionBuffer = gl.createBuffer();
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        var success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if(success) {
          return shader;
        }
        console.log("Shader error, type:", type)
        console.log(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);  
    }

    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        var success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if(success) {
          return program;
        }
      
        console.log(this.gl.getProgramLogInfo(program));
        this.gl.deleteProgram(program);
    }

    use() {
        this.gl.useProgram(this.program)
    }

    setUniform2f(uniformName, vec2) {
        const uniformLoc = this.gl.getUniformLocation(this.program, uniformName);
        this.gl.uniform2f(this.gl.getUniformLocation(this.program, uniformName), vec2[0], vec2[1]);
    }

    setUniform4f(uniformName, vec4) {
        const uniformLoc = this.gl.getUniformLocation(this.program, uniformName);
        this.gl.uniform4f(uniformLoc, vec4[0], vec4[1], vec4[2], vec4[3]);
    }

    setUniformMatrix4fv(uniformName, mat4) {
        const uniformLoc = this.gl.getUniformLocation(this.program, uniformName);
        this.gl.uniformMatrix4fv(uniformLoc, false, mat4);
    }

    bindBuffer(data, buffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.DYNAMIC_DRAW);
    }

    fillAttributeData(attribName, size, type, normalize, stride, offset) {
        this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, attribName));
        this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program, attribName), size, type, normalize, stride, offset);
    }

    drawArrays(primitiveType, numElements) {
        // console.log("ruh")
        this.gl.drawArrays(primitiveType, 0, numElements);
    }
}