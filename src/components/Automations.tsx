import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber, calculateUpgradeCost, calculateProductionRate } from '../utils/formulas';

export const Automations: React.FC = () => {
  const automations = useGameStore(state => state.automations);
  const codePoints = useGameStore(state => state.codePoints);
  const prestigeMultiplier = useGameStore(state => state.prestigeMultiplier);
  const buyAutomation = useGameStore(state => state.buyAutomation);
  
  const handleBuy = (automationId: string) => {
    buyAutomation(automationId);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-holo-blue/20">
        <i className="fas fa-cogs text-holo-blue"></i>
        <h3 className="text-lg font-bold text-holo-blue font-mono">AUTOMATION SYSTEMS</h3>
      </div>
      
      {automations.map((automation) => {
        const cost = calculateUpgradeCost(automation.baseCost, automation.currentLevel);
        const production = calculateProductionRate(automation.baseProductionRate, automation.currentLevel) * prestigeMultiplier;
        const canAfford = codePoints >= cost;
        
        return (
          <button
            key={automation.id}
            onClick={() => handleBuy(automation.id)}
            disabled={!canAfford}
            className={`
              w-full relative group
              px-4 py-3 rounded-lg
              border transition-all duration-200
              text-left
              ${canAfford 
                ? 'border-holo-blue bg-terminal-bg/80 hover:bg-holo-blue/10 hover:border-holo-blue hover:shadow-[0_0_15px_rgba(0,136,255,0.3)] cursor-pointer active:scale-[0.98]' 
                : 'border-terminal-dim/30 bg-terminal-bg/50 cursor-not-allowed opacity-60'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`text-2xl ${canAfford ? 'text-holo-blue' : 'text-terminal-dim'}`}>
                <i className={`fas ${automation.icon}`}></i>
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h4 className={`font-mono font-bold text-sm ${canAfford ? 'text-holo-blue' : 'text-terminal-dim'}`}>
                      {automation.name}
                    </h4>
                    <p className={`text-xs mt-1 ${canAfford ? 'text-holo-blue/60' : 'text-terminal-dim/60'}`}>
                      {automation.description}
                    </p>
                  </div>
                  
                  {/* Level badge */}
                  <div className={`
                    px-2 py-1 rounded text-xs font-mono font-bold whitespace-nowrap
                    ${canAfford ? 'bg-holo-blue/20 text-holo-blue' : 'bg-terminal-dim/20 text-terminal-dim'}
                  `}>
                    Lv. {automation.currentLevel}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-holo-blue/20">
                  <div className="flex gap-4 text-xs font-mono">
                    <div>
                      <span className={canAfford ? 'text-holo-blue/60' : 'text-terminal-dim/60'}>Cost: </span>
                      <span className={`font-bold ${canAfford ? 'text-holo-cyan' : 'text-terminal-dim'}`}>
                        {formatNumber(cost)}
                      </span>
                    </div>
                    {production > 0 && (
                      <div>
                        <span className={canAfford ? 'text-holo-blue/60' : 'text-terminal-dim/60'}>Prod: </span>
                        <span className={`font-bold ${canAfford ? 'text-holo-green' : 'text-terminal-dim'}`}>
                          {formatNumber(production)}/s
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {canAfford && (
                    <div className="text-holo-cyan text-xs font-mono">
                      <i className="fas fa-arrow-up mr-1"></i>
                      UPGRADE
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Hover glow */}
            {canAfford && (
              <div className="absolute -inset-1 bg-gradient-to-r from-holo-blue/0 via-holo-blue/30 to-holo-blue/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};
