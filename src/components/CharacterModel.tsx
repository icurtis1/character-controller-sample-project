import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { Group } from 'three';

type CharacterModelProps = {
  isMoving: boolean;
  isSprinting: boolean;
  isGrounded: boolean;
};

export function CharacterModel({ isMoving, isSprinting, isGrounded }: CharacterModelProps) {
  const group = useRef<Group>(null);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const { scene, animations } = useGLTF('/models/character.glb', true);
  const { actions } = useAnimations(animations, group);

  scene.traverse((child) => {
    if ('material' in child) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  useEffect(() => {
    let targetAnimation = 'IDLE';
    if (!isGrounded) {
      targetAnimation = 'FALL';
    } else if (isMoving) {
      targetAnimation = 'RUN';
    }
    
    // If it's the first animation or same animation, just play it
    if (!currentAnimation || currentAnimation === targetAnimation) {
      const action = actions[targetAnimation];
      if (action) {
        action.reset().play();
        action.timeScale = isMoving && isSprinting ? 1.25 : 1;
        setCurrentAnimation(targetAnimation);
      }
      return;
    }
    
    // Crossfade to new animation
    const prevAction = actions[currentAnimation];
    const nextAction = actions[targetAnimation];
    
    if (prevAction && nextAction) {
      // Start new animation
      nextAction.reset().play();
      nextAction.timeScale = isMoving && isSprinting ? 1.25 : 1;
      
      // Crossfade with the previous animation
      prevAction.crossFadeTo(nextAction, 0.15, true);
      
      setCurrentAnimation(targetAnimation);
    }
    
  }, [actions, isMoving, isSprinting, isGrounded]);
  
  return <primitive ref={group} object={scene} />;
}