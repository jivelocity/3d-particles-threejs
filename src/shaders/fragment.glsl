// varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;
// uniform vec3 uColor1;
// uniform vec3 uColor2;

void main() {
    
    // vec3 color1= vec3(1.,0.,0.);
    // vec3 color2= vec3(1.,1.,0.);

    //Disc
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, strength);
    // strength = 1.0 - strength;

    // Diffuse Point    
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    // strength = 1.0 - strength;

    //Light Point
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = 1.0 - strength;
    // strength =  pow(strength, 10.0);

    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.05 * 2.;
 
    float depth = vPosition.z * 0.5 + 0.5;

    vec3 color = mix(vec3(1.0 ),vColor,strength);
    // gl_FragColor = vec4(color, depth * 0.3 + 0.2);
    // gl_FragColor = vec4(color, 1.);
    gl_FragColor = vec4(vColor, strength * (depth* 0.3 + 0.2));
}