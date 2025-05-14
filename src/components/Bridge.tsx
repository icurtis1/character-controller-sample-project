import { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useRevoluteJoint } from '@react-three/rapier';
import { useBridgeControls } from '../hooks/useBridgeControls';

export function Bridge() {
  const controls = useBridgeControls();
  
  // Create refs for each plank
  const plankRefs = Array(controls.plankCount).fill(null).map(() => useRef(null));
  
  // Create dual rope joints between planks (left and right sides)
  const joints = [];
  // Connect all planks including the static ends
  for (let i = 0; i < plankRefs.length - 1; i++) {
    // Create three revolute joints per plank connection for stability
    // Left edge
    joints.push(
      useRevoluteJoint(plankRefs[i], plankRefs[i + 1], [
        [0.3, 0, -controls.plankLength/2], // Left edge of current plank
        [-controls.plankDistance, 0, -controls.plankLength/2], // Left edge of next plank
        [0, 1, 0], // Rotation axis (vertical)
        // Increase stiffness for connections to static ends
        i === 0 || i === plankRefs.length - 2 ? controls.jointStiffness * 4 : controls.jointStiffness * 2
      ])
    );
    
    // Center
    joints.push(
      useRevoluteJoint(plankRefs[i], plankRefs[i + 1], [
        [0.3, 0, 0], // Center of current plank
        [-controls.plankDistance, 0, 0], // Center of next plank
        [0, 1, 0], // Rotation axis (vertical)
        // Increase stiffness for connections to static ends
        i === 0 || i === plankRefs.length - 2 ? controls.jointStiffness * 3 : controls.jointStiffness
      ])
    );
    
    // Right edge
    joints.push(
      useRevoluteJoint(plankRefs[i], plankRefs[i + 1], [
        [0.3, 0, controls.plankLength/2], // Right edge of current plank
        [-controls.plankDistance, 0, controls.plankLength/2], // Right edge of next plank
        [0, 1, 0], // Rotation axis (vertical)
        // Increase stiffness for connections to static ends
        i === 0 || i === plankRefs.length - 2 ? controls.jointStiffness * 4 : controls.jointStiffness * 2
      ])
    );
  }

  return (
    <group position={[0, 3, 0]}>
      {/* Bridge planks */}
      {plankRefs.map((ref, i) => (
        <RigidBody
          key={i}
          ref={ref}
          position={[
            i === 0 ? -controls.anchorOffset : 
            i === plankRefs.length - 1 ? controls.anchorOffset :
            (-controls.anchorOffset/2) + (i * ((controls.anchorOffset) / (controls.plankCount - 2))),
            0,
            0
          ]}
          colliders="cuboid"
          type={i === 0 || i === plankRefs.length - 1 ? "fixed" : "dynamic"}
          mass={i === 0 || i === plankRefs.length - 1 ? 0 : controls.plankMass}
          linearDamping={controls.damping * 2}
          angularDamping={controls.damping * 2}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.2, controls.plankLength]} />
            <meshStandardMaterial 
              color={i === 0 || i === plankRefs.length - 1 ? "#4a5568" : "#805e3b"}
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}