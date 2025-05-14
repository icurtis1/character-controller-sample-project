import { RigidBody } from '@react-three/rapier';

export function Platforms() {
  return (
    <group>
      {/* Small Platform */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[5, 2, 5]}>
          <boxGeometry args={[3, 0.5, 3]} />
          <meshStandardMaterial color="#90cdf4" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Medium Platform */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[-6, 4, -6]}>
          <boxGeometry args={[4, 0.5, 4]} />
          <meshStandardMaterial color="#9ae6b4" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Large Platform */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[0, 6, -8]}>
          <boxGeometry args={[6, 0.5, 6]} />
          <meshStandardMaterial color="#fbd38d" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Stair-like Platforms */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[-8, 1, 4]}>
          <boxGeometry args={[2, 0.5, 2]} />
          <meshStandardMaterial color="#feb2b2" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[-6, 2, 6]}>
          <boxGeometry args={[2, 0.5, 2]} />
          <meshStandardMaterial color="#feb2b2" roughness={0.8} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[-4, 3, 8]}>
          <boxGeometry args={[2, 0.5, 2]} />
          <meshStandardMaterial color="#feb2b2" roughness={0.8} />
        </mesh>
      </RigidBody>
    </group>
  );
}