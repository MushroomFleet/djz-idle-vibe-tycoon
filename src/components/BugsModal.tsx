import React from 'react';
import { useGameStore } from '../store/gameStore';

export const BugsModal: React.FC = () => {
  const bugsClicksProgress = useGameStore(state => state.bugsClicksProgress);
  const bugsClicksRequired = useGameStore(state => state.bugsClicksRequired);
  const clickBugsModal = useGameStore(state => state.clickBugsModal);
  
  const progressPercent = (bugsClicksProgress / bugsClicksRequired) * 100;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-terminal-bg border-2 border-holo-pink rounded-lg p-6 max-w-md w-full mx-4
                      shadow-[0_0_40px_rgba(255,0,128,0.3)]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <i className="fas fa-exclamation-triangle text-3xl text-holo-pink"></i>
          <div>
            <h2 className="text-xl font-bold text-holo-pink font-mono">DEPENDENCY CONFLICT</h2>
            <p className="text-sm text-holo-pink/70 font-mono">Code merge issue detected</p>
          </div>
        </div>
        
        {/* Description */}
        <div className="bg-black/40 border border-holo-pink/30 rounded p-3 mb-4 font-mono text-sm">
          <p className="text-holo-pink/90 mb-2">
            <i className="fas fa-bug mr-2"></i>
            Multiple dependency conflicts in package.json
          </p>
          <p className="text-white/70">
            Click repeatedly to resolve merge conflicts and fix broken dependencies.
            This will not contribute to project progress.
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-holo-pink/70">RESOLUTION PROGRESS</span>
            <span className="text-holo-pink">
              {bugsClicksProgress}/{bugsClicksRequired}
            </span>
          </div>
          
          <div className="relative h-4 bg-black border border-holo-pink/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-holo-pink to-holo-purple transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Click Button */}
        <button
          onClick={clickBugsModal}
          className="w-full px-6 py-4 bg-holo-pink border-2 border-holo-pink rounded-lg
                     hover:bg-holo-pink/20 transition-all duration-200
                     font-mono font-bold text-lg text-white
                     shadow-[0_0_20px_rgba(255,0,128,0.3)]
                     active:scale-95"
        >
          <div className="flex items-center justify-center gap-2">
            <i className="fas fa-code-branch"></i>
            <span>RESOLVE CONFLICT</span>
          </div>
        </button>
        
        {/* Warning Text */}
        <div className="mt-3 text-center text-xs text-holo-pink/60 font-mono">
          ⚠️ Time penalty - no progress during resolution
        </div>
      </div>
    </div>
  );
};
