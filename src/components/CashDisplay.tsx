import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formulas';

export const CashDisplay: React.FC = () => {
  const cash = useGameStore(state => state.cash);
  const marketDirection = useGameStore(state => state.marketDirection);
  const dayCount = useGameStore(state => state.dayCount);
  
  const isMarketUp = marketDirection === 'up';
  
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-terminal-bg/50 border border-holo-green/30 rounded-lg">
      {/* Market Indicator */}
      <div className={`text-2xl ${isMarketUp ? 'text-green-500' : 'text-red-500'}`}>
        {isMarketUp ? '↑' : '↓'}
      </div>
      
      {/* Cash Amount */}
      <div>
        <div className="text-xs text-holo-green/60 font-mono">CASH</div>
        <div className={`text-xl font-bold font-mono ${cash < 0 ? 'text-red-500' : 'text-holo-green'}`}>
          ${formatNumber(Math.abs(cash))}
          {cash < 0 && <span className="text-xs ml-1">(DEBT)</span>}
        </div>
      </div>
      
      {/* Day Counter */}
      <div className="ml-auto">
        <div className="text-xs text-holo-cyan/60 font-mono">DAY</div>
        <div className="text-xl font-bold text-holo-cyan font-mono">
          {dayCount}
        </div>
      </div>
    </div>
  );
};
