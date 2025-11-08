import React from 'react';
import { useGameStore } from '../store/gameStore';

export const ProgressBar: React.FC = () => {
  const progress = useGameStore(state => state.progress);
  const projectName = useGameStore(state => state.projectName);
  const level = useGameStore(state => state.level);
  
  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-2xl font-bold text-holo-cyan font-mono">
            {projectName}
          </h2>
          <div className="text-sm text-holo-cyan/60 font-mono">
            Level {level} Development Progress
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-holo-green font-mono">
            {progress.toFixed(1)}%
          </div>
          <div className="text-xs text-holo-green/60 font-mono">
            COMPLETION
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="relative h-8 bg-terminal-bg border-2 border-holo-green/30 rounded-lg overflow-hidden">
        {/* Background grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 136, 0.1) 2px,
                rgba(0, 255, 136, 0.1) 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 136, 0.1) 2px,
                rgba(0, 255, 136, 0.1) 4px
              )
            `
          }}
        ></div>
        
        {/* Progress fill */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-holo-green/50 via-holo-cyan/50 to-holo-green/50 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]"></div>
        </div>
        
        {/* Percentage text */}
        <div className="relative h-full flex items-center justify-center">
          <span className="font-mono text-sm font-bold text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]">
            {progress.toFixed(1)}% Complete
          </span>
        </div>
        
        {/* Scan line */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-holo-green to-transparent animate-scan opacity-50"></div>
        </div>
      </div>
      
      {/* Delivery threshold indicator */}
      {progress >= 95 && (
        <div className="mt-2 text-center">
          <span className="text-holo-green font-mono text-sm animate-pulse">
            <i className="fas fa-rocket mr-2"></i>
            Ready for Deployment!
          </span>
        </div>
      )}
      
      {/* Glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-holo-green/20 to-holo-cyan/20 rounded-lg blur-xl -z-10 opacity-50"></div>
    </div>
  );
};
