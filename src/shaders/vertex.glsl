attribute vec3 aRandom;
// varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;

uniform float uTime; 
uniform float uScale; 

void main() {
    // vUv = uv;
    vPosition = position;
    vColor = color;

    float time = uTime * 4.;



    vec3 pos = position;
    // pos.x *= 0.5;
    pos.x += sin(time * aRandom.x) * 0.01;
    pos.y += sin(time * aRandom.y) * 0.01;
    pos.z += sin(time * aRandom.z) * 0.01;

    pos.x *= uScale + (sin(pos.y * 4. + time) *(1. - uScale));
    pos.y *= uScale + (cos(pos.z * 4. + time) *(1. - uScale));
    pos.z *= uScale + (sin(pos.x * 4. + time) *(1. - uScale));

    pos *= uScale;
    

    vec4 modelPosition = modelMatrix * vec4( pos, 1.0 );
    vec4 viewPosition = viewMatrix * modelPosition ;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = 50.0 / -viewPosition.z;
}