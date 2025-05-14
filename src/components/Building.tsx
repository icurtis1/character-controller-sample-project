import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export function Building() {
  const { scene } = useGLTF('/models/building.glb');

  // Enable shadows for all meshes in the model
  scene.traverse((child) => {
    if ('material' in child) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive 
        object={scene} 
        position={[0, 0, 0]} 
        scale={1}
        rotation={[0, 0, 0]}
      />
    </RigidBody>
  );
}