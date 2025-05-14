import React from 'react';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Quaternion, MathUtils, Ray } from 'three';
import { CapsuleCollider, RigidBody, RigidBodyApi, useRapier } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import { useCharacterControls } from '../hooks/useCharacterControls';
import { calculateMovement, createJumpImpulse, createFallForce, createMovementVelocity } from '../utils/physics';
import { useMobileControls } from '../contexts/MobileControlsContext';
import { CharacterModel } from './CharacterModel';

export type CharacterState = {
  moveSpeed: number;
  jumpForce: number;
  airControl: number;
  isGrounded: boolean;
  velocity: { x: number; y: number; z: number };
};

export const CharacterController = React.forwardRef<any>((_, ref) => {
  const rigidBody = useRef<RigidBodyApi>(null);
  const modelRef = useRef<THREE.Group>(null);
  const { rapier, world } = useRapier();
  const { isJumping: isMobileJumping, movement: mobileMovement } = useMobileControls();
  const [, getKeys] = useKeyboardControls();
  const [isSprinting, setIsSprinting] = useState(false);
  const prevPosition = useRef(new Vector3());
  const [isMoving, setIsMoving] = useState(false);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const groundRay = useRef(new Ray(new Vector3(), new Vector3(0, -1, 0)));
  const [state, setState] = useState<CharacterState>({
    moveSpeed: 0,
    jumpForce: 0,
    airControl: 0,
    isGrounded: false,
    velocity: { x: 0, y: 0, z: 0 },
  });

  const controls = useCharacterControls();

  useFrame(() => {
    if (!rigidBody.current) return;

    // Cast multiple rays for better ground detection
    const translation = rigidBody.current.translation();
    const rayLength = 1.5; // Increased length for better detection
    const rayDir = { x: 0, y: -1, z: 0 };
    
    // Cast rays from multiple points around the character
    const rayOffsets = [
      { x: 0, z: 0 },      // Center
      { x: 0.3, z: 0 },    // Right
      { x: -0.3, z: 0 },   // Left
      { x: 0, z: 0.3 },    // Front
      { x: 0, z: -0.3 },   // Back
    ];
    
    let isGrounded = false;
    let closestHit = null;
    
    for (const offset of rayOffsets) {
      const ray = new rapier.Ray(
        { 
          x: translation.x + offset.x, 
          y: translation.y, 
          z: translation.z + offset.z 
        },
        rayDir
      );
      
      const hit = world.castRay(
        ray,
        rayLength,
        true,
        undefined,
        undefined,
        undefined,
        rigidBody.current
      );
      
      if (hit && (!closestHit || hit.toi < closestHit.toi)) {
        closestHit = hit;
        isGrounded = true;
      }
    }

    // Log ground state changes
    if (isGrounded !== state.isGrounded) {
      console.log(`Ground state changed: ${isGrounded ? 'Grounded' : 'In Air'}`);
    }

    const input = getKeys();
    const shouldJump = input.jump || isMobileJumping;
    const linvel = rigidBody.current.linvel();
    const currentPos = new Vector3(
      translation.x,
      translation.y,
      translation.z
    );

    // Update movement state
    const horizontalSpeed = Math.sqrt(linvel.x * linvel.x + linvel.z * linvel.z);
    setIsMoving(horizontalSpeed > 0.5);
    setIsSprinting(input.sprint && horizontalSpeed > 0.5);

    // Update rotation based on velocity
    if (Math.abs(linvel.x) > 0.1 || Math.abs(linvel.z) > 0.1) {
      targetRotation.current = Math.atan2(linvel.x, linvel.z);
      
      // Normalize angle difference to ensure shortest rotation path
      let angleDiff = targetRotation.current - currentRotation.current;
      if (angleDiff > Math.PI) {
        angleDiff -= Math.PI * 2;
      } else if (angleDiff < -Math.PI) {
        angleDiff += Math.PI * 2;
      }
      targetRotation.current = currentRotation.current + angleDiff;
    }
    
    // Smooth rotation
    if (modelRef.current) {
      currentRotation.current = MathUtils.lerp(
        currentRotation.current,
        targetRotation.current,
        0.2
      );
      modelRef.current.rotation.y = currentRotation.current;
    }

    // Handle movement
    let movement = calculateMovement(input, controls.moveSpeed);
    
    // Override keyboard movement with mobile joystick if active
    if (Math.abs(mobileMovement.x) > 0 || Math.abs(mobileMovement.y) > 0) {
      movement = {
        sprint: false,
        normalizedX: mobileMovement.x,
        normalizedZ: mobileMovement.y
      };
    }
    
    if (movement) {
      const sprintMultiplier = movement.sprint ? controls.sprintMultiplier : 1;
      const moveForce = controls.moveSpeed * (isGrounded ? 1 : controls.airControl);
      let velocity = createMovementVelocity(
        movement.normalizedX,
        movement.normalizedZ,
        moveForce * sprintMultiplier,
        linvel.y
      );
      
      // Smooth out the velocity changes
      if (isGrounded) {
        const smoothing = 0.25;
        velocity.x = velocity.x * smoothing + linvel.x * (1 - smoothing);
        velocity.z = velocity.z * smoothing + linvel.z * (1 - smoothing);
      }

      rigidBody.current.setLinvel(velocity, true);
    }

    // Handle jumping
    if (shouldJump && isGrounded) {
      // Reset vertical velocity before jumping
      rigidBody.current.setLinvel(
        { x: linvel.x, y: 0, z: linvel.z },
        true
      );
      rigidBody.current.applyImpulse(
        createJumpImpulse(controls.jumpForce, { y: linvel.y }),
        true
      );
    }

    // Ground snapping
    if (isGrounded && !input.jump) {
      const snapForce = createFallForce(0.5);
      rigidBody.current.applyImpulse(snapForce, true);
      
      if (closestHit && closestHit.point) {
        const targetY = closestHit.point.y + 1.2; // Keep character at proper height
        rigidBody.current.setTranslation(
          { x: translation.x, y: targetY, z: translation.z },
          true
        );
      }
    }
    
    // Store position for next frame
    if (isGrounded) {
      prevPosition.current.copy(currentPos);
    }

    setState({ 
      moveSpeed: controls.moveSpeed, 
      jumpForce: controls.jumpForce, 
      airControl: controls.airControl, 
      isGrounded, 
      velocity: linvel 
    });
  });

  // Update ref for camera
  React.useImperativeHandle(ref, () => ({
    position: {
      clone: () => {
        const translation = rigidBody.current?.translation();
        return new Vector3(
          translation?.x || 0,
          translation?.y || 0,
          translation?.z || 0
        );
      }
    }
  }), [rigidBody.current]);

  return (
    <RigidBody
      ref={rigidBody}
      colliders={false}
      mass={10}
      position={[0, 6, 1]}
      enabledRotations={[false, false, false]}
      lockRotations
      gravityScale={3}
      friction={controls.friction}
      linearDamping={controls.linearDamping}
      angularDamping={controls.angularDamping}
      restitution={0}
      ccd={true}
      maxCcdSubsteps={2}
      type="kinematicPositionBased"
    >
      <CapsuleCollider args={[0.8, 0.4]} offset={[0, 1.2, 0]} />
      <group ref={modelRef} position={[0, -1.15, 0]} scale={1.5}>
        <CharacterModel 
          isMoving={isMoving} 
          isSprinting={isSprinting} 
          isGrounded={state.isGrounded} 
        />
      </group>
    </RigidBody>
  );
});