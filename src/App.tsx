import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { Terminal } from './components/Terminal';
import { FileSystem } from './components/FileSystem';
import { ActionButtons } from './components/ActionButtons';
import { ProgressBar } from './components/ProgressBar';
import { Stats } from './components/Stats';
import { Automations } from './components/Automations';
import { FatigueBar } from './components/FatigueBar';
import { CashDisplay } from './components/CashDisplay';
import { EventModal } from './components/EventModal';
import { NewGameModal } from './components/NewGameModal';

function App() {
  const tick = useGameStore(state => state.tick);
  const projectName = useGameStore(state => state.projectName);
  const level = useGameStore(state => state.level);
  const addTerminalLine = useGameStore(state => state.addTerminalLine);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  
  // Game loop - runs every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 100);
    
    return () => clearInterval(interval);
  }, [tick]);
  
  // Welcome message on mount
  useEffect(() => {
    addTerminalLine({
      text: '╔═══════════════════════════════════════════╗',
      type: 'success'
    });
    addTerminalLine({
      text: '║   IDLE VIBE TYCOON - AI CODE SIMULATOR  ║',
      type: 'success'
    });
    addTerminalLine({
      text: '╚═══════════════════════════════════════════╝',
      type: 'success'
    });
    addTerminalLine({
      text: '',
      type: 'output'
    });
    addTerminalLine({
      text: `$ Initializing project: ${projectName}`,
      type: 'command'
    });
    addTerminalLine({
      text: '$ Loading holographic development environment...',
      type: 'info'
    });
    addTerminalLine({
      text: '✓ System ready. Start clicking to code!',
      type: 'success'
    });
    addTerminalLine({
      text: '',
      type: 'output'
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0d1838] to-[#0a0e27] text-white p-4">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-[1800px] mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold font-mono mb-2">
                <span className="text-holo-cyan">IDLE</span>
                <span className="text-holo-pink mx-2">VIBE</span>
                <span className="text-holo-blue">TYCOON</span>
              </h1>
              <p className="text-holo-cyan/60 text-sm font-mono">
                AI-Powered Code Simulation · Holographic Development Environment
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <CashDisplay />
              <button
                onClick={() => setShowNewGameModal(true)}
                className="px-3 py-2 bg-holo-pink/10 hover:bg-holo-pink/20 border border-holo-pink/30 hover:border-holo-pink/50 rounded-lg transition-all group"
                title="Start a new game"
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-rotate-right text-holo-pink text-sm group-hover:rotate-180 transition-transform duration-300"></i>
                  <div>
                    <div className="text-xs text-holo-pink/60 font-mono">NEW</div>
                    <div className="text-sm text-holo-pink font-mono font-bold">GAME</div>
                  </div>
                </div>
              </button>
              <div className="px-4 py-2 bg-holo-cyan/10 border border-holo-cyan/30 rounded-lg">
                <div className="text-xs text-holo-cyan/60 font-mono">SESSION</div>
                <div className="text-sm text-holo-cyan font-mono font-bold">ACTIVE</div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Grid Layout - 3 Column Design */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - Action Buttons & Stats */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Action Buttons */}
            <div className="bg-terminal-bg/50 backdrop-blur-sm border border-holo-cyan/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-holo-cyan/20">
                <i className="fas fa-terminal text-holo-cyan text-sm"></i>
                <h3 className="text-sm font-bold text-holo-cyan font-mono">CODING ACTIONS</h3>
              </div>
              <ActionButtons />
            </div>
            
            {/* Fatigue Bar */}
            <div className="bg-terminal-bg/50 backdrop-blur-sm border border-holo-pink/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-holo-pink/20">
                <i className="fas fa-battery-half text-holo-pink text-sm"></i>
                <h3 className="text-sm font-bold text-holo-pink font-mono">FATIGUE</h3>
              </div>
              <FatigueBar />
            </div>
            
            {/* Stats */}
            <div className="bg-terminal-bg/50 backdrop-blur-sm border border-holo-purple/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-holo-purple/20">
                <i className="fas fa-chart-line text-holo-purple text-sm"></i>
                <h3 className="text-sm font-bold text-holo-purple font-mono">STATISTICS</h3>
              </div>
              <Stats />
            </div>
          </div>
          
          {/* Center Column - Terminal & FileSystem (Visual Focus) */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            {/* Terminal - Largest */}
            <div className="h-[500px]">
              <Terminal />
            </div>
            
            {/* FileSystem - Second Largest */}
            <div className="h-[350px]">
              <FileSystem />
            </div>
          </div>
          
          {/* Right Column - Progress & Automations */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Progress */}
            <div className="bg-terminal-bg/50 backdrop-blur-sm border border-holo-green/30 rounded-lg p-4 sticky top-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-holo-green/20">
                <i className="fas fa-tasks text-holo-green text-sm"></i>
                <h3 className="text-sm font-bold text-holo-green font-mono">PROGRESS</h3>
              </div>
              <ProgressBar />
            </div>
            
            {/* Automations */}
            <div className="bg-terminal-bg/50 backdrop-blur-sm border border-holo-blue/30 rounded-lg p-4">
              <Automations />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-8 text-center text-holo-cyan/40 text-xs font-mono">
          <p>IDLE VIBE TYCOON v1.0.0 · Built with React + TypeScript + Vite</p>
          <p className="mt-1">Click to code · Automate to scale · Deliver to level up</p>
        </footer>
      </div>
      
      {/* Event Modals */}
      <EventModal />
      
      {/* New Game Modal */}
      <NewGameModal 
        isOpen={showNewGameModal} 
        onClose={() => setShowNewGameModal(false)} 
      />
    </div>
  );
}

export default App;
