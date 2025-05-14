import { Color } from 'three';

export const ToonVertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}`;

export const ToonFragmentShader = `
uniform vec3 color;
uniform float outlineThickness;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  // Calculate rim lighting
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  
  // Create sharp toon shading steps
  float diffuse = max(dot(normal, vec3(1.0)), 0.0);
  diffuse = smoothstep(0.5, 0.51, diffuse);

  // Create outline
  float outline = step(rim, 1.0 - outlineThickness);
  
  // Combine shading
  vec3 finalColor = mix(vec3(0.0), color, outline);
  finalColor = mix(finalColor, color * (0.8 + diffuse * 0.2), outline);
  
  gl_FragColor = vec4(finalColor, 1.0);
}`;