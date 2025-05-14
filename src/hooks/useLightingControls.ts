import { useControls } from 'leva';

export function useLightingControls() {
  return useControls('Lighting', {
    ambientIntensity: { value: 0.5, min: 0, max: 2, step: 0.1 },
    directionalIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    directionalHeight: { value: 10, min: 5, max: 20, step: 0.5 },
    directionalDistance: { value: 10, min: 5, max: 20, step: 0.5 },
  });
}