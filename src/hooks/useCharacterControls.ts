import { useControls } from 'leva';

export function useCharacterControls() {
  return useControls('Character Physics', {
    moveSpeed: { value: 9.0, min: 0, max: 15, step: 0.1 },
    sprintMultiplier: { value: 1.25, min: 1, max: 3, step: 0.1 },
    jumpForce: { value: 2.5, min: 0, max: 5, step: 0.1 },
    fallMultiplier: { value: 5.0, min: 1, max: 5, step: 0.1 },
    airControl: { value: 0.75, min: 0, max: 1, step: 0.05 },
    friction: { value: 0.5, min: 0, max: 2, step: 0.05 },
    linearDamping: { value: 1.0, min: 0, max: 10, step: 0.1 },
    angularDamping: { value: 3.0, min: 0, max: 5, step: 0.1 },
  });
}