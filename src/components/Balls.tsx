import { useMemo } from 'react';
import { ShaderMaterial, Color } from 'three';
import { RigidBody } from '@react-three/rapier';
import { useControls } from 'leva';
import { ToonVertexShader, ToonFragmentShader } from '../shaders/toonShader';

export function Balls() {
  const controls = useControls('Balls', {
    bounciness: { value: 0.7, min: 0, max: 1, step: 0.1 },
    friction: { value: .25, min: 0, max: 1, step: 0.1 },
    outlineThickness: { value: 0.25, min: 0, max: 0.5, step: 0.01 },
  });

  const toonMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        color: { value: new Color('#51BCFF') },
        outlineThickness: { value: controls.outlineThickness }
      },
      vertexShader: ToonVertexShader,
      fragmentShader: ToonFragmentShader,
    });
  }, [controls.outlineThickness]);

  const balls = useMemo(() => {
    const ballsArray = [];
    for (let i = 0; i < 300; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = Math.random() * 10 + 5;
      const z = (Math.random() - 0.5) * 10;
      const scale = Math.random() * 0.3 + 0.2;
      const color = '#51BCFF';
      
      ballsArray.push({ position: [x, y, z], scale, color });
    }
    return ballsArray;
  }, []);

  return (
    <>
      {balls.map((ball, index) => (
        <RigidBody
          key={index}
          colliders="ball"
          restitution={controls.bounciness}
          friction={controls.friction}
          position={ball.position}
        >
          <mesh castShadow receiveShadow>
            <icosahedronGeometry args={[ball.scale, 3]} />
            <primitive object={toonMaterial} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}