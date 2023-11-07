// Q4) Escreva o shader de vértices adequado ao programa
export default 
`#version 300 es
precision highp float;

in vec2 position;
in vec3 color;

uniform mat4 u_mat;
out vec4 vColor;

void main()
{
    gl_Position = u_mat * vec4(position, 0.0, 1);
    vColor = vec4(color,1.0);
}`