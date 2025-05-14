import React, { createContext, useContext, useState } from 'react';

type MobileControlsContextType = {
  isJumping: boolean;
  setIsJumping: (jumping: boolean) => void;
  movement: { x: number, y: number };
  setMovement: (movement: { x: number, y: number }) => void;
};

const MobileControlsContext = createContext<MobileControlsContextType>({
  isJumping: false,
  setIsJumping: () => {},
  movement: { x: 0, y: 0 },
  setMovement: () => {},
});

export function MobileControlsProvider({ children }: { children: React.ReactNode }) {
  const [isJumping, setIsJumping] = useState(false);
  const [movement, setMovement] = useState({ x: 0, y: 0 });

  return (
    <MobileControlsContext.Provider value={{ isJumping, setIsJumping, movement, setMovement }}>
      {children}
    </MobileControlsContext.Provider>
  );
}

export function useMobileControls() {
  return useContext(MobileControlsContext);
}