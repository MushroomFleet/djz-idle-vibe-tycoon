import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export const Terminal: React.FC = () => {
  const terminalLines = useGameStore(state => state.terminalLines);
  const projectName = useGameStore(state => state.projectName);
  const level = useGameStore(state => state.level);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to bottom when new lines are added
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);
  
  const getLineColor = (type: string) => {
    switch (type) {
      case 'command':
        return 'text-holo-cyan';
      case 'success':
        return 'text-holo-green';
      case 'error':
        return 'text-red-400';
      case 'info':
        return 'text-holo-blue';
      default:
        return 'text-terminal-text';
    }
  };
  
  return (
    <div className="relative bg-terminal-bg border border-holo-cyan/30 rounded-lg p-4 h-full overflow-hidden">
      {/* Holographic scan line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-holo-cyan/30 to-transparent animate-scan"></div>
      </div>
      
      {/* CRT flicker overlay */}
      <div className="absolute inset-0 bg-holo-cyan/5 mix-blend-overlay pointer-events-none animate-flicker"></div>
      
      {/* Terminal header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-holo-cyan/20">
        <div className="flex items-center gap-2">
          <i className="fas fa-terminal text-holo-cyan"></i>
          <span className="text-holo-cyan font-mono text-sm">
            VIBE TERMINAL v2.0
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-holo-green/50 border border-holo-green"></div>
        </div>
      </div>
      
      {/* Project info */}
      <div className="mb-3 font-mono text-xs text-holo-blue/70">
        <div>user@vibe-tycoon:~/projects/{projectName.toLowerCase().replace(/\s+/g, '-')}</div>
        <div>Level: {level} | Active Session</div>
      </div>
      
      {/* Terminal content */}
      <div className="font-mono text-sm h-[calc(100%-8rem)] overflow-y-auto custom-scrollbar">
        {terminalLines.length === 0 ? (
          <div className="text-terminal-dim">
            <p>$ Welcome to Idle Vibe Tycoon</p>
            <p>$ Click action buttons to start coding...</p>
            <p className="mt-2 text-holo-cyan/50">_</p>
          </div>
        ) : (
          <>
            {terminalLines.map((line) => (
              <div 
                key={line.id} 
                className={`${getLineColor(line.type)} mb-1 whitespace-pre-wrap break-words`}
              >
                {line.text}
              </div>
            ))}
            <div className="text-holo-cyan/50 animate-pulse inline-block">_</div>
          </>
        )}
        <div ref={terminalEndRef} />
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-holo-cyan/20 to-holo-blue/20 rounded-lg blur-xl -z-10 opacity-50"></div>
    </div>
  );
};
