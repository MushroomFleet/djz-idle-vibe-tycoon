import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewGameModal({ isOpen, onClose }: NewGameModalProps) {
  const resetGame = useGameStore(state => state.resetGame);
  const addTerminalLine = useGameStore(state => state.addTerminalLine);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsConfirming(true);
    
    // Add terminal message
    addTerminalLine({
      text: '🔄 Resetting game to initial state...',
      type: 'info'
    });
    
    // Small delay for visual feedback
    setTimeout(() => {
      resetGame();
      onClose();
      setIsConfirming(false);
      
      // The welcome message will be shown by App.tsx's useEffect
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-terminal-bg border-2 border-holo-pink rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl shadow-holo-pink/20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-holo-pink/30">
          <i className="fas fa-rotate-right text-holo-pink text-xl"></i>
          <h2 className="text-xl font-bold text-holo-pink font-mono">NEW GAME</h2>
        </div>

        {/* Warning Message */}
        <div className="mb-6 space-y-2">
          <p className="text-white/90 font-mono text-sm">
            Are you sure you want to start a new game?
          </p>
          <div className="bg-holo-pink/10 border border-holo-pink/30 rounded p-3">
            <p className="text-holo-pink/90 font-mono text-xs">
              ⚠️ This will permanently delete all progress:
            </p>
            <ul className="mt-2 space-y-1 text-white/70 font-mono text-xs ml-4">
              <li>• All levels and deliveries</li>
              <li>• Code points and cash</li>
              <li>• Automations and upgrades</li>
              <li>• Statistics and achievements</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="flex-1 px-4 py-2 bg-holo-cyan/20 hover:bg-holo-cyan/30 border border-holo-cyan/40 text-holo-cyan rounded font-mono text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-times mr-2"></i>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="flex-1 px-4 py-2 bg-holo-pink/20 hover:bg-holo-pink/30 border border-holo-pink/40 text-holo-pink rounded font-mono text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConfirming ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Resetting...
              </>
            ) : (
              <>
                <i className="fas fa-rotate-right mr-2"></i>
                Confirm Reset
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
