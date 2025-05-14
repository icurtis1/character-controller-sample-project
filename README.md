# 3D Character Controller

A 3D character controller built with React Three Fiber, Rapier physics, and advanced rendering techniques. This project demonstrates how to create a robust third-person character controller with mobile support, physics interactions, and post-processing effects.

[Live Demo](https://character-sample-project.netlify.app/)

<img src="./public/demo.gif" alt="Demo" width="600" />

## Features

- **Responsive 3D Character Controller**: Smooth movement with WASD/arrow keys, jumping, and sprinting
- **Mobile Controls**: Touch-based joystick and jump button for mobile devices
- **Physics Simulation**: Realistic physics using React Three Rapier
- **Stunning Visual Effects**: Post-processing pipeline with bloom, chromatic aberration, vignette and more
- **Environment Interaction**: Dynamic objects that respond to physics (bouncing balls)
- **Customizable Settings**: Debug UI for tweaking character, camera, lighting, and visual effects
- **Optimized Performance**: Efficient rendering and physics calculations
- **Cross-platform**: Works on desktop and mobile browsers

## How It Works

### Core Tech

- **React**: UI framework for the application structure
- **Three.js/React Three Fiber**: 3D rendering library and React bindings
- **@react-three/rapier**: Physics engine for realistic movement and collisions
- **@react-three/drei**: Useful helpers for React Three Fiber
- **@react-three/postprocessing**: Advanced visual effects
- **Leva**: Debug UI for tweaking parameters
- **Tailwind CSS**: Utility-first CSS framework for styling

### Main Components

1. **CharacterController**: Manages character movement, physics, and animation
2. **FollowCamera**: Third-person camera that smoothly follows the character
3. **Ground & Objects**: Physical environment with collision detection
4. **MobileControls**: Touch-based joystick and jump button for mobile devices
5. **Post-processing Pipeline**: Visual effects like bloom, chromatic aberration, and depth of field

### Physics System

The character uses a capsule collider with Rapier physics. Key features:
- Ground detection using raycasting
- Smooth movement with air control
- Jump mechanics with proper forces
- Collision response with environmental objects

## Installation

### Prerequisites

- Node.js 16+ and npm

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/3d-character-controller.git
   cd 3d-character-controller
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Controls

- **WASD/Arrow Keys**: Move the character
- **Space**: Jump
- **Shift**: Sprint
- **Mobile**: Use the left joystick to move and the right button to jump

### Customization

The project uses Leva for a debug UI that allows you to adjust various parameters:

- **Character Physics**: Movement speed, jump height, air control, etc.
- **Camera**: Distance, height, and smoothness
- **Lighting**: Ambient and directional light settings
- **Post-processing**: Enable/disable and adjust visual effects

## Development

### Project Structure

```
/src
  /components         # React components for the 3D scene
  /contexts           # React contexts (e.g., mobile controls)
  /hooks              # Custom hooks for controls and effects
  /shaders            # Custom shaders (toon shader)
  /utils              # Utility functions for physics
  App.tsx             # Main application component
  main.tsx            # Entry point
/public
  /models             # 3D models (character, environment)
```

## License

This project is released under the MIT License. See the LICENSE file for details.

## Acknowledgements

- Built with [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- Physics by [React Three Rapier](https://github.com/pmndrs/react-three-rapier)
- Post-processing from [React Three Postprocessing](https://github.com/pmndrs/react-postprocessing)