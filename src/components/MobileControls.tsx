import React from 'react';
import { Circle } from 'lucide-react';
import { useMobileControls } from '../contexts/MobileControlsContext';

const JOYSTICK_SMOOTHING = 0.2; // Slightly more smoothing for better feel
const JOYSTICK_DEADZONE = 0.1; // Minimum movement to register
const RETURN_TO_CENTER_SPEED = 0.15; // Slower return for smoother animation
const CENTER_THRESHOLD = 0.01; // Smaller threshold for more precise centering

type TouchZone = 'none' | 'joystick' | 'jump';

export function MobileControls() {
  const { setIsJumping, setMovement } = useMobileControls();
  const [joystickPosition, setJoystickPosition] = React.useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeZone, setActiveZone] = React.useState<TouchZone>('none');
  const [returnToCenter, setReturnToCenter] = React.useState(false);
  const joystickRef = React.useRef<HTMLDivElement>(null);
  const animationFrameRef = React.useRef<number>();
  const movementRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const prevMovementRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Smooth joystick movement
  React.useEffect(() => {
    const updatePosition = () => {
      setJoystickPosition(prev => {
        let newPosition;
        
        if (returnToCenter) {
          // Smoothly return to center when released
          newPosition = {
            x: prev.x * (1 - RETURN_TO_CENTER_SPEED * 1.5),
            y: prev.y * (1 - RETURN_TO_CENTER_SPEED * 1.5)
          };
          
          // Stop animation when very close to center
          if (Math.abs(newPosition.x) < CENTER_THRESHOLD && Math.abs(newPosition.y) < CENTER_THRESHOLD) {
            setReturnToCenter(false);
            newPosition = { x: 0, y: 0 };
            movementRef.current = { x: 0, y: 0 };
          }
        } else {
          // Normal joystick movement
          newPosition = {
            x: prev.x + (targetPosition.x - prev.x) * (1 - JOYSTICK_SMOOTHING),
            y: prev.y + (targetPosition.y - prev.y) * (1 - JOYSTICK_SMOOTHING)
          };
        }
        
        // Calculate normalized movement values
        if (joystickRef.current) {
          const radius = joystickRef.current.getBoundingClientRect().width / 2;
          const normalizedX = newPosition.x / radius;
          const normalizedY = newPosition.y / radius;
          
          // Apply deadzone
          const magnitude = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
          if (magnitude < JOYSTICK_DEADZONE) {
            movementRef.current = { x: 0, y: 0 };
          } else {
            movementRef.current = { 
              x: normalizedX, 
              y: normalizedY 
            };
          }
        }
        
        return newPosition;
      });
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    animationFrameRef.current = requestAnimationFrame(updatePosition);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetPosition]);

  // Separate effect for movement updates to avoid state updates during render
  React.useEffect(() => {
    const updateMovement = () => {
      if (JSON.stringify(movementRef.current) !== JSON.stringify(prevMovementRef.current)) {
        setMovement(movementRef.current);
        prevMovementRef.current = { ...movementRef.current };
      }
      requestAnimationFrame(updateMovement);
    };
    const animationId = requestAnimationFrame(updateMovement);
    return () => cancelAnimationFrame(animationId);
  }, [setMovement]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent, zone: TouchZone) => {
    e.preventDefault();
    
    // Allow jump while using joystick
    if (zone === 'joystick' && activeZone === 'jump') return;
    if (zone === 'jump' && activeZone === 'joystick') {
      setActiveZone('both');
    } else {
      setActiveZone(zone);
    }
    
    if (zone === 'jump') {
      setIsJumping(true);
    } else if (zone === 'joystick') {
      setIsDragging(true);
      setReturnToCenter(false);
      updateJoystickPosition(e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDragging || activeZone !== 'joystick') return;
    updateJoystickPosition(e);
  };

  const handleTouchEnd = () => {
    if (activeZone === 'jump') {
      setIsJumping(false);
    } else if (activeZone === 'joystick') {
      setIsDragging(false);
      setReturnToCenter(true);
      setTargetPosition({ x: 0, y: 0 });
    } else if (activeZone === 'both') {
      setIsJumping(false);
      setActiveZone('joystick');
      return;
    }
    setActiveZone('none');
  };

  const updateJoystickPosition = (e: React.TouchEvent | React.MouseEvent) => {
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Get client coordinates based on event type
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    // Calculate distance from center
    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;

    // Limit the joystick movement to the container radius
    const radius = rect.width / 2;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > radius) {
      const angle = Math.atan2(deltaY, deltaX);
      deltaX = Math.cos(angle) * radius;
      deltaY = Math.sin(angle) * radius;
    }

    setTargetPosition({ x: deltaX, y: deltaY });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none z-50 select-none touch-none md:hidden">
      <div className="max-w-lg mx-auto flex justify-between items-end">
        {/* Left Side - Joystick Zone */}
        <div className="flex-1 h-48 flex items-end">
          <div 
            ref={joystickRef}
            className="w-32 h-32 rounded-full bg-white/5 backdrop-blur-sm relative pointer-events-auto touch-none select-none will-change-transform shadow-lg shadow-black/25 border border-white/10"
            onTouchStart={(e) => handleTouchStart(e, 'joystick')}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={(e) => handleTouchStart(e, 'joystick')}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
          >
            <div 
              className="absolute w-16 h-16 rounded-full bg-white/10 transform will-change-transform z-10 border-2 border-white/30 shadow-lg shadow-black/25 transition-shadow duration-200"
              style={{ 
                transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
                left: 'calc(50% - 2rem)',
                top: 'calc(50% - 2rem)',
                boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.25)'
              }}
            />
          </div>
        </div>

        {/* Right Side - Jump Button Zone */}
        <div className="flex-1 h-48 flex items-end justify-end">
          <button 
            className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm border-2 border-white/20 pointer-events-auto transform will-change-transform flex items-center justify-center select-none touch-none shadow-lg shadow-black/25 transition-all duration-200"
            style={{
              transform: `scale(${activeZone === 'jump' ? '0.92' : '1'})`,
              boxShadow: activeZone === 'jump' ? '0 8px 24px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.25)'
            }}
            onTouchStart={(e) => handleTouchStart(e, 'jump')}
            onMouseDown={(e) => handleTouchStart(e, 'jump')}
            onTouchEnd={handleTouchEnd}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
          >
            <div 
              className="text-white/70 font-semibold text-lg select-none transition-transform duration-200"
              style={{
                transform: `scale(${activeZone === 'jump' ? '0.95' : '1'}) translateY(${activeZone === 'jump' ? '2px' : '0'})`
              }}
            >
              JUMP
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}