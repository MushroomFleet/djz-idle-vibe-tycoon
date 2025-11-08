import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formulas';

export const ActionButtons: React.FC = () => {
  const actionButtons = useGameStore(state => state.actionButtons);
  const codePoints = useGameStore(state => state.codePoints);
  const click = useGameStore(state => state.click);
  const level = useGameStore(state => state.level);
  
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const now = Date.now();
        const updated: Record<string, number> = {};
        
        actionButtons.forEach(button => {
          const timeLeft = Math.max(0, button.cooldown - (now - button.lastUsed));
          if (timeLeft > 0) {
            updated[button.id] = timeLeft;
          }
        });
        
        return updated;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [actionButtons]);
  
  const handleClick = (buttonId: string) => {
    const button = actionButtons.find(b => b.id === buttonId);
    if (!button) return;
    
    const now = Date.now();
    if (now - button.lastUsed < button.cooldown) return;
    if (codePoints < button.baseCost) return;
    
    click(buttonId);
  };
  
  const canAfford = (cost: number) => codePoints >= cost;
  const isOnCooldown = (buttonId: string) => (cooldowns[buttonId] || 0) > 0;
  
  const getCooldownPercent = (buttonId: string) => {
    const button = actionButtons.find(b => b.id === buttonId);
    if (!button) return 0;
    
    const timeLeft = cooldowns[buttonId] || 0;
    return (timeLeft / button.cooldown) * 100;
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {actionButtons.map((button) => {
        const onCooldown = isOnCooldown(button.id);
        const affordable = canAfford(button.baseCost);
        const disabled = onCooldown || !affordable;
        const cooldownPercent = getCooldownPercent(button.id);
        
        return (
          <button
            key={button.id}
            onClick={() => handleClick(button.id)}
            disabled={disabled}
            className={`
              relative group
              px-6 py-4 rounded-lg
              border-2 transition-all duration-200
              font-mono text-sm
              overflow-hidden
              ${disabled 
                ? 'border-terminal-dim/30 bg-terminal-bg/50 text-terminal-dim cursor-not-allowed' 
                : 'border-holo-cyan bg-terminal-bg/80 text-holo-cyan hover:bg-holo-cyan/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] cursor-pointer active:scale-95'
              }
            `}
          >
            {/* Cooldown overlay */}
            {onCooldown && (
              <div 
                className="absolute inset-0 bg-holo-cyan/20 transition-all duration-75"
                style={{ 
                  width: `${cooldownPercent}%`,
                  left: 0
                }}
              ></div>
            )}
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <i className={`fas ${button.icon} text-xl ${disabled ? 'opacity-30' : 'opacity-100'}`}></i>
                <div className="text-left flex-1">
                  <div className="font-bold text-base leading-tight">{button.name}</div>
                  <div className={`text-xs mt-1 ${disabled ? 'opacity-50' : 'opacity-70'}`}>
                    {button.description}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className={disabled ? 'opacity-50' : ''}>
                  {button.baseCost > 0 ? `Cost: ${formatNumber(button.baseCost)}` : 'Free'}
                </span>
                {button.cooldown > 0 && (
                  <span className={onCooldown ? 'text-holo-pink' : 'opacity-50'}>
                    {onCooldown 
                      ? `${(cooldowns[button.id] / 1000).toFixed(1)}s` 
                      : `CD: ${(button.cooldown / 1000).toFixed(1)}s`
                    }
                  </span>
                )}
              </div>
            </div>
            
            {/* Hover glow effect */}
            {!disabled && (
              <div className="absolute -inset-1 bg-gradient-to-r from-holo-cyan/0 via-holo-cyan/30 to-holo-cyan/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};
