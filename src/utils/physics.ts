import { vec3 } from '@react-three/rapier';

export function calculateMovement(input: { 
  forward: boolean; 
  backward: boolean; 
  left: boolean; 
  right: boolean; 
  sprint: boolean;
}, moveSpeed: number) {
  let xImpulse = 0;
  let zImpulse = 0;
  
  if (input.forward) zImpulse -= moveSpeed;
  if (input.backward) zImpulse += moveSpeed;
  if (input.left) xImpulse -= moveSpeed;
  if (input.right) xImpulse += moveSpeed;

  const length = Math.sqrt(xImpulse * xImpulse + zImpulse * zImpulse);
  if (length === 0) return null;

  return {
    sprint: input.sprint,
    normalizedX: xImpulse / length,
    normalizedZ: zImpulse / length
  };
}

export function createJumpImpulse(force: number, currentVelocity: { y: number }) {
  // Reset any existing vertical velocity before applying jump force
  // This ensures consistent jump height regardless of current state
  return vec3({ 
    x: 0, 
    y: Math.max(force * 7.5, Math.abs(currentVelocity.y)), 
    z: 0 
  });
}

export function createFallForce(fallMultiplier: number) {
  return vec3({ x: 0, y: -9.81 * (fallMultiplier - 1) * 0.016, z: 0 });
}

export function createMovementVelocity(
  normalizedX: number, 
  normalizedZ: number, 
  moveForce: number, 
  currentY: number
) {
  return vec3({
    x: normalizedX * moveForce,
    y: currentY,
    z: normalizedZ * moveForce
  });
}