import React from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { KeyboardControls, Environment, useTexture } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Bolt } from 'lucide-react';
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration, 
  Vignette, 
  SMAA, 
  BrightnessContrast,
  HueSaturation,
  DepthOfField
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { CharacterController } from './components/CharacterController';
import { Ground } from './components/Ground';
import { Balls } from './components/Balls';
import { FollowCamera } from './components/FollowCamera';
import { useCharacterControls } from './hooks/useCharacterControls';
import { useCameraControls } from './hooks/useCameraControls';
import { useLightingControls } from './hooks/useLightingControls';
import { usePostProcessingControls } from './hooks/usePostProcessingControls';
import { Leva } from 'leva';
import { MobileControlsProvider } from './contexts/MobileControlsContext';
import { MobileControls } from './components/MobileControls';

const characterRef = { current: null };

function DynamicDepthOfField({ enabled, target, focalLength, bokehScale }) {
  const { camera } = useThree();
  const [focusDistance, setFocusDistance] = React.useState(0);
  
  useFrame(() => {
    if (!enabled || !target.current) return;
    // Calculate distance from camera to character
    const distance = camera.position.distanceTo(target.current.position.clone());
    // Convert world distance to normalized focus distance (0-1 range)
    setFocusDistance(Math.min(distance / 20, 1));
  });

  return enabled ? (
    <DepthOfField
      focusDistance={focusDistance}
      focalLength={focalLength}
      bokehScale={bokehScale}
      height={1080}
    />
  ) : null;
}

function App() {
  // Order matters for GUI - call lighting controls last
  const characterControls = useCharacterControls();
  const cameraControls = useCameraControls();
  const lighting = useLightingControls();
  const postProcessing = usePostProcessingControls();

  return (
    <div className="w-full h-screen">
      <Bolt className="fixed top-4 right-4 w-6 h-6 text-white opacity-50" />
      <div className="fixed top-4 left-1/2 -translate-x-1/2 text-white font-mono text-sm pointer-events-none select-none bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm z-50">
        WASD to move | SPACE to jump | SHIFT to run
      </div>
      <Leva collapsed />
      <MobileControlsProvider>
        <MobileControls />
        <KeyboardControls
          map={[
            { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
            { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
            { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
            { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
            { name: 'jump', keys: ['Space'] },
            { name: 'sprint', keys: ['ShiftLeft', 'ShiftRight'] },
          ]}
        >
          <Canvas shadows>
          <Environment
            preset="sunset"
            intensity={1}
            background
            blur={0.8}
            resolution={256}
          />
          <ambientLight intensity={lighting.ambientIntensity} />
          <directionalLight
            castShadow
            position={[lighting.directionalDistance, lighting.directionalHeight, lighting.directionalDistance / 2]}
            intensity={lighting.directionalIntensity}
            shadow-mapSize={[4096, 4096]}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-camera-far={50}
            shadow-bias={-0.0001}
            shadow-normalBias={0.02}
          />
          <Physics 
            interpolate={false}
            positionIterations={5}
            velocityIterations={4}
          >
            <CharacterController ref={characterRef} />
            <Ground />
            <Balls />
          </Physics>
          <FollowCamera target={characterRef} />
          <EffectComposer>
            <DynamicDepthOfField
              enabled={postProcessing.depthOfFieldEnabled}
              target={characterRef}
              focalLength={postProcessing.focalLength}
              bokehScale={postProcessing.bokehScale}
            />
            {postProcessing.bloomEnabled && (
              <Bloom 
                intensity={postProcessing.bloomIntensity}
              />
            )}
            {postProcessing.chromaticAberrationEnabled && (
              <ChromaticAberration
                offset={[postProcessing.chromaticAberrationOffset, postProcessing.chromaticAberrationOffset]}
                blendFunction={BlendFunction.NORMAL}
              />
            )}
            {postProcessing.vignetteEnabled && (
              <Vignette
                darkness={postProcessing.vignetteDarkness}
                offset={postProcessing.vignetteOffset}
                blendFunction={BlendFunction.NORMAL}
              />
            )}
            {postProcessing.brightnessContrastEnabled && (
              <BrightnessContrast
                brightness={postProcessing.brightness}
                contrast={postProcessing.contrast}
                blendFunction={BlendFunction.NORMAL}
              />
            )}
            {postProcessing.hueSaturationEnabled && (
              <HueSaturation
                hue={postProcessing.hue}
                saturation={postProcessing.saturation}
                blendFunction={BlendFunction.NORMAL}
              />
            )}
            <SMAA />
          </EffectComposer>
        </Canvas>
      </KeyboardControls>
      </MobileControlsProvider>
    </div>
  );
}
export default App;
