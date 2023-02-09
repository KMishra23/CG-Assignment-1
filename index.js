import { vertexShaderSrc } from "../Shaders/vertexShader.js";
import { fragmentShaderSrc } from "../Shaders/fragmentShader.js";
import { Circle } from "../circle.js";
import { Scene } from "./scene.js";
import { Renderer } from "./renderer.js";
import { Shader } from "./shader.js";
import { Triangle } from "../triangle.js";
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import { Triangle3D } from "./3Dtriangle.js";

main();

//
// start here
//
function main() {
  const canvas = document.querySelector("#glcanvas");
  canvas.width = window.innerWidth-20;
  canvas.height = window.innerHeight-20;
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }
  // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);



  var vertexShaderSource = vertexShaderSrc;
  var fragmentShaderSource = fragmentShaderSrc;

  // var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  // var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // var program = createProgram(gl, vertexShader, fragmentShader);
  // gl.useProgram(program);

  const shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
  const renderer = new Renderer(gl);
  const scene = new Scene(canvas.width, canvas.height);

  shader.use()
  // Program creation and shaders compiled



  // var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // const colorUniformLocation = gl.getUniformLocation(program, "uColor");
  

  // trying to render a circle
  const circle = new Circle (
    20, [150, 150], [1.0, 1.0, 0.0, 1]
  )
  circle.transform.rotateAboutSetAxis(45 * Math.PI/180);
  // var positions = circle.vertexList;
  const tri1 = new Triangle (
    [300, 300],
    [150, 150],
    [300, 150],
    [1.0, 0.0, 0.0, 1],
    [150, 150, 0],
  )

  // var positions = [
  //   -0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
  //   -0.5, 0.5, 0.5, -0.5, -0.5, -0.5
  // ];

  // console.log(positions.length)
  // console.log(positions)

  scene.add(circle);
  // scene.add(tri1);
  // scene.add(tri3D);
  
  // tri1.transform.setRotationPoint(300, 300, 0);
  tri1.transform.setRotationAxis(0,0,1);
  circle.transform.setRotationAxis(0,0,1);

document.addEventListener("keydown", event => {
  // console.log(event.key);

  if(event.key == "ArrowUp") {
    console.log("pressed ArrowUp");
    // vec3.set(tri1.transform.translate, 0.1, 0.1, 0);
    circle.transform.translation(0, -10);
    circle.transform.setAngleAboutSetAxis(315 * Math.PI/180);
    // tri1.transform.translation(0, -10);
  }
  if(event.key == "ArrowDown") {
    console.log("pressed ArrowDown");
    // vec3.set(tri1.transform.translate, 0.1, 0.1, 0);
    // tri1.transform.translation(0, 10);
    circle.transform.translation(0, 10);
    circle.transform.setAngleAboutSetAxis(135 * Math.PI/180);
  }
  if(event.key == "ArrowLeft") {
    console.log("pressed ArrowLeft");
    // vec3.set(tri1.transform.translate, 0.1, 0.1, 0);
    // tri1.transform.translation(-10, 0);
    circle.transform.translation(-10, 0);
    circle.transform.setAngleAboutSetAxis(225 * Math.PI/180);
  }
  if(event.key == "ArrowRight") {
    console.log("pressed ArrowRight");
    // vec3.set(tri1.transform.translate, 0.1, 0.1, 0);
    // tri1.transform.translation(10, 0);
    circle.transform.translation(10, 0);
    circle.transform.setAngleAboutSetAxis(45 * Math.PI/180);

  }
  if(event.key == "k") {
    console.log("pressed k");
    // tri1.transform.rotateAboutSetAxis(10 * Math.PI/180);
    circle.transform.rotateAboutSetAxis(90 * Math.PI/180);
  }
  if(event.key == "l") {
    console.log("pressed l");
    // tri1.transform.rotateAboutSetAxis(-10 * Math.PI/180);
    circle.transform.rotateAboutSetAxis(-90 * Math.PI/180);
  }
})


  renderer.setAnimationLoop(animation);

  function animation () {
    gl.clearColor(0.0, 0.0, 0.0, 0.1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderer.render(scene, shader);
  }

  {}


  // var positionBuffer = gl.createBuffer();

  // At the start of each animation loop, clear screen with these lines
  // gl.clearColor(0.0, 0.0, 0.0, 0.1);
  // gl.clear(gl.COLOR_BUFFER_BIT);

  // for each primitive, bind buffer with the position data, update with vertex positions for that primitive.

  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

  // //then do this thing for each primitive
  // var size = 2;
  // var type = gl.FLOAT;
  // var normalize = false;
  // var stride = 0;
  // var offset = 0;

  // gl.enableVertexAttribArray(positionAttributeLocation);
  // gl.vertexAttribPointer(
  //   positionAttributeLocation, size, type, normalize, stride, offset
  // )

  // // Set color of each primitive
  // gl.uniform4f(colorUniformLocation, circle.color[0], circle.color[1], circle.color[2], circle.color[3])

  // // Finally, pass these to draw arrays
  // var primitiveType = gl.TRIANGLES;
  // var offset = 0;
  // var count = positions.length/2;

  // gl.drawArrays(primitiveType, offset, count);
}


// function createShader(gl, type, source) {
//   var shader = gl.createShader(type);
//   gl.shaderSource(shader, source);
//   gl.compileShader(shader);
//   var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
//   if(success) {
//     return shader;
//   }
//   console.log("Shader error, type:", type)
//   console.log(gl.getShaderInfoLog(shader));
//   gl.deleteShader(shader);  
// }

// function createProgram(gl, vertexShader, fragmentShader) {
//   var program = gl.createProgram();
//   gl.attachShader(program, vertexShader);
//   gl.attachShader(program, fragmentShader);
//   gl.linkProgram(program);
//   var success = gl.getProgramParameter(program, gl.LINK_STATUS);
//   if(success) {
//     return program;
//   }

//   console.log(gl.getProgramLogInfo(program));
//   gl.deletProgram(program);
// }

