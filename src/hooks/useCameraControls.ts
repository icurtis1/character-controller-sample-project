import { useControls } from 'leva';

export function useCameraControls() {
  return useControls('Camera', {
    height: { value: 4, min: 1, max: 10, step: 0.1 },
    distance: { value: 6, min: 5, max: 20, step: 0.1 },
    smoothness: { value: 1, min: 0.01, max: 1, step: 0.01 }
  });
}