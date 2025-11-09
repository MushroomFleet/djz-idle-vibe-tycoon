import React from 'react';
import { useGameStore } from '../store/gameStore';
import { BugsModal } from './BugsModal';
import { HardwareModal } from './HardwareModal';

export const EventModal: React.FC = () => {
  const activeModal = useGameStore(state => state.activeModal);
  
  if (activeModal === 'bugs') {
    return <BugsModal />;
  }
  
  if (activeModal === 'hardware') {
    return <HardwareModal />;
  }
  
  return null;
};
