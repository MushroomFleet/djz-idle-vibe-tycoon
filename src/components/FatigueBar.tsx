import React from 'react';
import { useGameStore } from '../store/gameStore';

export const FatigueBar: React.FC = () => {
  const fatigueLevel = useGameStore(state => state.fatigueLevel);
  const maxFatigue = useGameStore(state => state.maxFatigue);
  const sleepDebt = useGameStore(state => state.sleepDebt);
  
  const fatiguePercent = (fatigueLevel / maxFatigue) * 100;
  
  // Determine fatigue level color
  let barColor = 'bg-holo-cyan';
  if (fatiguePercent > 80) {
    barColor = 'bg-holo-pink';
  } else if (fatiguePercent > 60) {
    barColor = 'bg-yellow-500';
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-holo-cyan/70">FATIGUE</span>
        <span className={`${fatiguePercent > 80 ? 'text-holo-pink' : 'text-holo-cyan'}`}>
          {fatigueLevel}/{maxFatigue}
        </span>
      </div>
      
      {/* Fatigue Bar */}
      <div className="relative h-3 bg-terminal-bg border border-holo-cyan/30 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${fatiguePercent}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
      </div>
      
      {/* Warnings */}
      {fatiguePercent > 80 && (
        <div className="text-xs text-holo-pink/70 font-mono text-center animate-pulse">
          ⚠️ Nearly exhausted! Auto-sleep at {maxFatigue}
        </div>
      )}
      
      {sleepDebt > 0 && (
        <div className="text-xs text-yellow-500/90 font-mono text-center bg-yellow-500/10 border border-yellow-500/30 rounded px-2 py-1">
          💤 Sleep Debt: +{sleepDebt} fatigue next day
        </div>
      )}
    </div>
  );
};
