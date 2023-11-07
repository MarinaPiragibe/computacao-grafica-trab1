
import vertShaderSrc from './simple.vert.js';
import fragShaderSrc from './simple.frag.js';

import Shader from './shader.js';

class Scene {
  constructor(gl) {
    this.data = [];

    this.delta = 0;
    this.mat = mat4.create();
    this.matLoc = -1;

    this.vertShd = null;
    this.fragShd = null;
    this.program = null;

    this.vaoLoc = -1;

    this.init(gl);
  }

  init(gl) {
    this.createShaderProgram(gl);
    this.createVAO(gl);
    this.createUniforms(gl);
  }

  createShaderProgram(gl) {
    this.vertShd = Shader.createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    this.fragShd = Shader.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    this.program = Shader.createProgram(gl, this.vertShd, this.fragShd);

    gl.useProgram(this.program);
  }

  createUniforms(gl) {
    this.matLoc = gl.getUniformLocation(this.program, "u_mat");
  }

  loadModel() {
    this.data = [
      // posição 2D (x,y)
      0.1, 0.8, 
      // Cor (rgb)
      1.0, 0.0, 0.0, 
      
      0.1, 0.9, 
      1.0, 0.0, 0.0, 
      
      0.25, 0.8,   
      1.0, 0.0, 0.0,

      0.25, 0.8,
      0.0, 1.0, 0.0,
      
      0.4, 0.9,
      0.0, 1.0, 0.0,
      
      0.4, 0.8,
      0.0, 1.0, 0.0,
      
      0.1, 0.5,
      0.0, 0.0, 1.0,

      0.4, 0.8,
      0.0, 0.0, 1.0,

      0.1, 0.8,
      0.0, 0.0, 1.0,

      0.1, 0.5,
      0.0, 0.0, 1.0,

      0.4, 0.5,
      0.0, 0.0, 1.0,

      0.4, 0.8,
      0.0, 0.0, 1.0,

      0.4, 0.1,
      1.0, 0.0, 1.0,

      0.8, 0.5,
      1.0, 0.0, 1.0,
      
      0.4, 0.5,
      1.0, 0.0, 1.0,
      
      0.4, 0.1,
      1.0, 0.0, 1.0,

      0.8, 0.1,
      1.0, 0.0, 1.0,

      0.8, 0.5,
      1.0, 0.0, 1.0,

      0.8, 0.1,
      0.0, 1.0, 1.0,
      
      0.9, 0.1,
      0.0, 1.0, 1.0,
      
      0.8, 0.3,
      0.0, 1.0, 1.0,
    ];
  }

  createVAO(gl) {
    this.loadModel();

    var coordsAttributeLocation = gl.getAttribLocation(this.program, "position");
    var colorsAttributeLocation = gl.getAttribLocation(this.program, "color");

    // Criação do VBO (Shader.createBuffer)
    const dataBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.data));

    // Criação do VAO
    // Q1) Escreva a implementação da função abaixo, que constroi um VAO contendo informações de posicão e
    // cores, e esteja de acordo com a estrutura do array this.data
    this.vaoLoc = Shader.createVAO(gl, coordsAttributeLocation, colorsAttributeLocation, dataBuffer);
  }

  objectTransformation() {
    // Defina os valores necessários
    const orbitRadius = 0.5;
    const gatinhoWidth = 0.25;
    const gatinhoHeight = 0.25;
    const rotationSpeed = 0.01; // Velocidade de rotação
  
    // Matriz de transformação para rotação em torno do eixo Z
    mat4.identity(this.mat);
  
    // Atualize o ângulo de rotação
    this.delta += rotationSpeed;
  
    // Certifique-se de reiniciar a rotação quando atingir um determinado ângulo
    if (this.delta > 2 * Math.PI) {
      this.delta -= 2 * Math.PI;
    }
  
    // Calcule as coordenadas da posição da cabeça do gatinho em relação ao centro da órbita
    const headX = orbitRadius * Math.cos(this.delta);
    const headY = orbitRadius * Math.sin(this.delta);
  
    // Coordenadas do centro da tela
    const centerX = 0.0; // Ajuste se necessário
    const centerY = 0.0; // Ajuste se necessário
  
    // Crie a matriz de transformação
    mat4.translate(this.mat, this.mat, [centerX + headX, centerY + headY, 0.0]);
    mat4.scale(this.mat, this.mat, [gatinhoWidth, gatinhoHeight, 1.0]);
  }

  draw(gl) {  
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vaoLoc);

    this.objectTransformation();
    gl.uniformMatrix4fv(this.matLoc, false, this.mat);

    // Q3) Implemente o comando dl.drawArrays adequado para o programa em questão
    gl.drawArrays(gl.TRIANGLES, 0, (this.data.length * 0.4)/2);

  }
}

class Main {
  constructor() {
    const canvas = document.querySelector("#glcanvas");
    this.gl = canvas.getContext("webgl2");

    var devicePixelRatio = window.devicePixelRatio || 1;
    this.gl.canvas.width = 1024 * devicePixelRatio;
    this.gl.canvas.height = 768 * devicePixelRatio;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.scene = new Scene(this.gl);
  }

  draw() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.draw(this.gl);

    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  const app = new Main();
  app.draw();
}
