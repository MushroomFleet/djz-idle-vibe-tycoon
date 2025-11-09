import React from 'react';
import { useGameStore } from '../store/gameStore';

export const HardwareModal: React.FC = () => {
  const cash = useGameStore(state => state.cash);
  const stability = useGameStore(state => state.stability);
  const resolveHardware = useGameStore(state => state.resolveHardware);
  
  // Calculate costs based on stability
  let costModifier = 1;
  if (stability > 70) {
    costModifier = 0.7; // 30% discount for high stability
  } else if (stability < 30) {
    costModifier = 1.75; // 75% markup for low stability
  }
  
  const cheapCost = Math.floor(100 * costModifier);
  const standardCost = Math.floor(300 * costModifier);
  const premiumCost = Math.floor(600 * costModifier);
  
  const fixOptions = [
    {
      type: 'cheap' as const,
      name: 'Quick Fix',
      cost: cheapCost,
      stabilityChange: -15,
      icon: 'fa-wrench',
      description: 'Temporary patch. Reduces system stability.',
      color: 'text-red-500',
      borderColor: 'border-red-500',
      hoverBg: 'hover:bg-red-500/10'
    },
    {
      type: 'standard' as const,
      name: 'Standard Repair',
      cost: standardCost,
      stabilityChange: 0,
      icon: 'fa-screwdriver-wrench',
      description: 'Proper repair. Maintains current stability.',
      color: 'text-yellow-500',
      borderColor: 'border-yellow-500',
      hoverBg: 'hover:bg-yellow-500/10'
    },
    {
      type: 'premium' as const,
      name: 'Premium Service',
      cost: premiumCost,
      stabilityChange: 15,
      icon: 'fa-microchip',
      description: 'Full overhaul. Increases system stability.',
      color: 'text-holo-green',
      borderColor: 'border-holo-green',
      hoverBg: 'hover:bg-holo-green/10'
    }
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-terminal-bg border-2 border-holo-blue rounded-lg p-6 max-w-2xl w-full mx-4
                      shadow-[0_0_40px_rgba(0,150,255,0.3)]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <i className="fas fa-server text-3xl text-holo-blue"></i>
          <div>
            <h2 className="text-xl font-bold text-holo-blue font-mono">HARDWARE FAILURE</h2>
            <p className="text-sm text-holo-blue/70 font-mono">Critical system malfunction</p>
          </div>
        </div>
        
        {/* Description */}
        <div className="bg-black/40 border border-holo-blue/30 rounded p-3 mb-4 font-mono text-sm">
          <p className="text-holo-blue/90 mb-2">
            <i className="fas fa-circle-exclamation mr-2"></i>
            Your development machine has encountered a critical hardware failure
          </p>
          <p className="text-white/70">
            Choose a repair option. Higher quality fixes improve long-term stability and reduce future repair costs.
          </p>
        </div>
        
        {/* System Status */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
          <div className="bg-black/40 border border-holo-cyan/30 rounded p-2">
            <div className="text-holo-cyan/70">Available Cash</div>
            <div className={`text-lg font-bold ${cash < cheapCost ? 'text-red-500' : 'text-holo-green'}`}>
              ${cash}
            </div>
          </div>
          <div className="bg-black/40 border border-holo-purple/30 rounded p-2">
            <div className="text-holo-purple/70">System Stability</div>
            <div className={`text-lg font-bold ${
              stability > 70 ? 'text-holo-green' : 
              stability < 30 ? 'text-red-500' : 
              'text-yellow-500'
            }`}>
              {stability}%
            </div>
          </div>
        </div>
        
        {stability > 70 && (
          <div className="bg-holo-green/10 border border-holo-green/30 rounded p-2 mb-4 text-xs font-mono text-holo-green">
            <i className="fas fa-circle-check mr-2"></i>
            High stability: 30% discount on all repairs!
          </div>
        )}
        
        {stability < 30 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded p-2 mb-4 text-xs font-mono text-red-500">
            <i className="fas fa-triangle-exclamation mr-2"></i>
            Low stability: 75% markup on all repairs!
          </div>
        )}
        
        {/* Fix Options */}
        <div className="space-y-3">
          {fixOptions.map((option) => {
            const canAfford = cash >= option.cost;
            
            return (
              <button
                key={option.type}
                onClick={() => resolveHardware(option.type)}
                disabled={!canAfford}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200
                           font-mono text-left ${option.borderColor} ${option.hoverBg}
                           ${!canAfford ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-98'}
                           ${canAfford ? 'shadow-[0_0_15px_rgba(0,150,255,0.2)]' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <i className={`fas ${option.icon} text-2xl ${option.color} mt-1`}></i>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-lg ${option.color}`}>{option.name}</span>
                      <span className={`font-bold ${canAfford ? option.color : 'text-red-500'}`}>
                        ${option.cost}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-2">{option.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={option.stabilityChange > 0 ? 'text-holo-green' : option.stabilityChange < 0 ? 'text-red-500' : 'text-yellow-500'}>
                        Stability: {option.stabilityChange > 0 ? '+' : ''}{option.stabilityChange}%
                      </span>
                      {!canAfford && (
                        <span className="text-red-500">
                          <i className="fas fa-circle-xmark mr-1"></i>
                          Insufficient funds
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Warning Text */}
        <div className="mt-4 text-center text-xs text-holo-blue/60 font-mono">
          ⚠️ You must choose a repair option to continue
        </div>
      </div>
    </div>
  );
};
