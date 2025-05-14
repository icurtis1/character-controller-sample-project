import { useControls } from 'leva';

export function usePostProcessingControls() {
  return useControls('Post Processing', {
    // Bloom
    bloomEnabled: { value: false },
    bloomIntensity: { value: 1.0, min: 0, max: 3, step: 0.1 },
    
    // Vignette
    vignetteEnabled: { value: true },
    vignetteDarkness: { value: 0.4, min: 0, max: 1, step: 0.1 },
    vignetteOffset: { value: 0.5, min: 0, max: 1, step: 0.1 },
    
    // Chromatic Aberration
    chromaticAberrationEnabled: { value: false },
    chromaticAberrationOffset: { value: 0.002, min: 0, max: 0.01, step: 0.001 },
    
    // Depth of Field
    depthOfFieldEnabled: { value: false },
    focalLength: { value: 0.02, min: 0, max: 0.1, step: 0.001 },
    bokehScale: { value: 2.5, min: 0, max: 10, step: 0.1 },
    
    // Color Correction
    brightnessContrastEnabled: { value: false },
    brightness: { value: 0, min: -1, max: 1, step: 0.1 },
    contrast: { value: 0, min: -1, max: 1, step: 0.1 },
    
    // Color Grading
    hueSaturationEnabled: { value: false },
    hue: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    saturation: { value: 0, min: -1, max: 1, step: 0.1 },
  });
}