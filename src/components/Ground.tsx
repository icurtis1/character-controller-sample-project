import { RigidBody } from '@react-three/rapier';
import { useTexture } from '@react-three/drei'; 
import { RepeatWrapping, DoubleSide } from 'three';

type BoxDimensions = [number, number, number];

const boxes = [
  { position: [4, -1, -4] as const, size: [3, 3, 3] as BoxDimensions },
  { position: [-4, -1, -4] as const, size: [3, 3, 3] as BoxDimensions },
  { position: [8, -1, 4] as const, size: [3, 3, 3] as BoxDimensions },
  { position: [-8, -1, 4] as const, size: [3, 3, 3] as BoxDimensions },
  { position: [0, -1, 8] as const, size: [3, 3, 3] as BoxDimensions },
];

export function Ground() {
  const texture = useTexture('/final-texture.png');
  const platformTexture = texture.clone();
  const wallTexture = texture.clone();
  
  // Configure texture
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(8, 8);
  
  platformTexture.wrapS = platformTexture.wrapT = RepeatWrapping;
  platformTexture.repeat.set(1, 1);
  
  wallTexture.wrapS = wallTexture.wrapT = RepeatWrapping;
  wallTexture.repeat.set(8, 1);
  
  const groundSize = 30;
  const wallHeight = 3;
  const wallThickness = 1;

  return (
    <group>
      {/* Ground */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[groundSize, groundSize]} />
          <meshStandardMaterial 
            map={texture}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
        {/* Hidden floor for physics */}
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[groundSize, 0.1, groundSize]} />
          <meshStandardMaterial visible={false} />
        </mesh>
      </RigidBody>

      {/* Visible walls */}
      <RigidBody type="fixed" colliders="cuboid">
        {/* North Wall */}
        <mesh position={[0, 0.5, -groundSize/2]} castShadow receiveShadow>
          <boxGeometry args={[groundSize, wallHeight, wallThickness]} />
          <meshStandardMaterial 
            map={wallTexture}
            roughness={0.8}
            metalness={0.2}
            side={DoubleSide}
          />
        </mesh>
        {/* South Wall */}
        <mesh position={[0, 0.5, groundSize/2]} castShadow receiveShadow>
          <boxGeometry args={[groundSize, wallHeight, wallThickness]} />
          <meshStandardMaterial 
            map={wallTexture}
            roughness={0.8}
            metalness={0.2}
            side={DoubleSide}
          />
        </mesh>
        {/* East Wall */}
        <mesh position={[groundSize/2, 0.5, 0]} rotation={[0, Math.PI/2, 0]} castShadow receiveShadow>
          <boxGeometry args={[groundSize, wallHeight, wallThickness]} />
          <meshStandardMaterial 
            map={wallTexture}
            roughness={0.8}
            metalness={0.2}
            side={DoubleSide}
          />
        </mesh>
        {/* West Wall */}
        <mesh position={[-groundSize/2, 0.5, 0]} rotation={[0, Math.PI/2, 0]} castShadow receiveShadow>
          <boxGeometry args={[groundSize, wallHeight, wallThickness]} />
          <meshStandardMaterial 
            map={wallTexture}
            roughness={0.8}
            metalness={0.2}
            side={DoubleSide}
          />
        </mesh>
      </RigidBody>
      
      {/* Boxes */}
      {boxes.map((box, index) => (
        <RigidBody
          key={index}
          type="fixed"
          position={box.position}
          colliders="cuboid"
          friction={0.1}
          restitution={0}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={box.size} />
            <meshStandardMaterial
              map={platformTexture}
              side={DoubleSide}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}