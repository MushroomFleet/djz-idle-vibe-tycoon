import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface FileSystemNodeProps {
  node: any;
  depth: number;
}

const FileSystemNode: React.FC<FileSystemNodeProps> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(node.isOpen || false);
  
  const indent = depth * 20;
  
  if (node.type === 'file') {
    return (
      <div 
        className="flex items-center gap-2 py-1 hover:bg-holo-cyan/10 rounded px-2 transition-colors cursor-pointer"
        style={{ paddingLeft: `${indent}px` }}
      >
        <i className="fas fa-file-code text-holo-blue text-xs"></i>
        <span className="font-mono text-xs text-terminal-text/80">{node.name}</span>
      </div>
    );
  }
  
  return (
    <div>
      <div 
        className="flex items-center gap-2 py-1 hover:bg-holo-cyan/10 rounded px-2 transition-colors cursor-pointer"
        style={{ paddingLeft: `${indent}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas ${isOpen ? 'fa-folder-open' : 'fa-folder'} text-holo-cyan text-xs`}></i>
        <span className="font-mono text-xs text-terminal-text">{node.name}</span>
        {node.children && (
          <i className={`fas fa-chevron-${isOpen ? 'down' : 'right'} text-holo-cyan/50 text-xs ml-auto`}></i>
        )}
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map((child: any, index: number) => (
            <FileSystemNode key={child.path || index} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileSystem: React.FC = () => {
  const fileSystem = useGameStore(state => state.fileSystem);
  const projectName = useGameStore(state => state.projectName);
  
  return (
    <div className="relative bg-terminal-bg border border-holo-purple/30 rounded-lg p-4 h-full overflow-hidden">
      {/* Holographic effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-holo-purple/5 to-transparent pointer-events-none"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-holo-purple/20">
        <div className="flex items-center gap-2">
          <i className="fas fa-folder-tree text-holo-purple"></i>
          <span className="text-holo-purple font-mono text-sm">FILE EXPLORER</span>
        </div>
        <div className="text-xs text-holo-purple/50 font-mono">
          HOLO-FS v3.2
        </div>
      </div>
      
      {/* Project name badge */}
      <div className="mb-3 px-3 py-2 bg-holo-purple/10 border border-holo-purple/30 rounded">
        <div className="text-xs text-holo-purple/70 font-mono mb-1">ACTIVE PROJECT</div>
        <div className="text-sm text-holo-purple font-bold">{projectName}</div>
      </div>
      
      {/* File tree */}
      <div className="overflow-y-auto custom-scrollbar h-[calc(100%-10rem)]">
        <FileSystemNode node={fileSystem} depth={0} />
      </div>
      
      {/* Stats */}
      <div className="mt-3 pt-3 border-t border-holo-purple/20">
        <div className="text-xs text-holo-purple/50 font-mono space-y-1">
          <div className="flex justify-between">
            <span>Files:</span>
            <span className="text-holo-purple">12</span>
          </div>
          <div className="flex justify-between">
            <span>Directories:</span>
            <span className="text-holo-purple">4</span>
          </div>
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-holo-purple/20 to-holo-pink/20 rounded-lg blur-xl -z-10 opacity-40"></div>
    </div>
  );
};
