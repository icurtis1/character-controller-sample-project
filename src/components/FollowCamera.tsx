import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { PerspectiveCamera } from '@react-three/drei';
import { useCameraControls } from '../hooks/useCameraControls';

type FollowCameraProps = {
  target: { current: { position: Vector3 } | null };
};

export function FollowCamera({ target }: FollowCameraProps) {
  const cameraRef = useRef<THREE.Group>(null);
  const controls = useCameraControls();
  const currentPos = useRef(new Vector3());
  
  useFrame((state) => {
    if (!target.current || !cameraRef.current) return;

    const position = target.current.position;
    const targetPos = position.clone().add(new Vector3(0, controls.height, controls.distance));

    // Smooth camera movement
    currentPos.current.lerp(targetPos, controls.smoothness);
    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(position.clone());
  });

  return (
    <group ref={cameraRef}>
      <PerspectiveCamera makeDefault position={[0, controls.height, controls.distance]} fov={75}>
        <meshBasicMaterial attach="material" color="red" />
      </PerspectiveCamera>
    </group>
  );
}