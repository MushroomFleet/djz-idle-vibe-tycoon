import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber, calculateTotalProduction } from '../utils/formulas';

export const Stats: React.FC = () => {
  const codePoints = useGameStore(state => state.codePoints);
  const level = useGameStore(state => state.level);
  const totalClicks = useGameStore(state => state.totalClicks);
  const totalAppsDelivered = useGameStore(state => state.totalAppsDelivered);
  const prestigeMultiplier = useGameStore(state => state.prestigeMultiplier);
  const automations = useGameStore(state => state.automations);
  
  const productionRate = calculateTotalProduction(automations) * prestigeMultiplier;
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Code Points */}
      <div className="bg-terminal-bg border-2 border-holo-cyan/40 rounded-lg p-4 relative overflow-hidden group hover:border-holo-cyan transition-colors">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-code text-holo-cyan text-xl"></i>
            <span className="text-holo-cyan/70 font-mono text-xs uppercase">Code Points</span>
          </div>
          <div className="text-2xl font-bold text-holo-cyan font-mono">
            {formatNumber(codePoints)}
          </div>
          {productionRate > 0 && (
            <div className="text-xs text-holo-cyan/60 font-mono mt-1">
              +{formatNumber(productionRate)}/sec
            </div>
          )}
        </div>
        <div className="absolute -inset-1 bg-holo-cyan/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10"></div>
      </div>
      
      {/* Level */}
      <div className="bg-terminal-bg border-2 border-holo-green/40 rounded-lg p-4 relative overflow-hidden group hover:border-holo-green transition-colors">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-layer-group text-holo-green text-xl"></i>
            <span className="text-holo-green/70 font-mono text-xs uppercase">Level</span>
          </div>
          <div className="text-2xl font-bold text-holo-green font-mono">
            {level}
          </div>
          <div className="text-xs text-holo-green/60 font-mono mt-1">
            Apps: {totalAppsDelivered}
          </div>
        </div>
        <div className="absolute -inset-1 bg-holo-green/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10"></div>
      </div>
      
      {/* Total Clicks */}
      <div className="bg-terminal-bg border-2 border-holo-purple/40 rounded-lg p-4 relative overflow-hidden group hover:border-holo-purple transition-colors">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-mouse-pointer text-holo-purple text-xl"></i>
            <span className="text-holo-purple/70 font-mono text-xs uppercase">Total Clicks</span>
          </div>
          <div className="text-2xl font-bold text-holo-purple font-mono">
            {formatNumber(totalClicks)}
          </div>
        </div>
        <div className="absolute -inset-1 bg-holo-purple/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10"></div>
      </div>
      
      {/* Prestige Multiplier */}
      <div className="bg-terminal-bg border-2 border-holo-pink/40 rounded-lg p-4 relative overflow-hidden group hover:border-holo-pink transition-colors">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-star text-holo-pink text-xl"></i>
            <span className="text-holo-pink/70 font-mono text-xs uppercase">Multiplier</span>
          </div>
          <div className="text-2xl font-bold text-holo-pink font-mono">
            {prestigeMultiplier.toFixed(2)}x
          </div>
        </div>
        <div className="absolute -inset-1 bg-holo-pink/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10"></div>
      </div>
    </div>
  );
};
