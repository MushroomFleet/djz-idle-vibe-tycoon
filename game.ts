// Game State Types
export interface GameState {
  // Core metrics
  codePoints: number;
  progress: number; // 0-100
  level: number; // Apps delivered
  
  // Project info
  projectName: string;
  
  // Automation
  automations: Automation[];
  
  // Upgrades
  upgrades: Record<string, number>; // upgradeId -> level
  
  // Stats
  totalClicks: number;
  totalAppsDelivered: number;
  prestigeMultiplier: number;
  
  // Game loop
  lastTick: number;
  isPaused: boolean;
}

export interface Automation {
  id: string;
  name: string;
  baseProductionRate: number; // Points per second
  currentLevel: number;
  baseCost: number;
  description: string;
  icon: string;
}

export interface ActionButton {
  id: string;
  name: string;
  baseProgress: number; // Base progress added per click
  baseCost: number;
  description: string;
  icon: string;
  cooldown: number; // milliseconds
  lastUsed: number;
}

export interface TerminalLine {
  id: string;
  text: string;
  type: 'command' | 'output' | 'error' | 'success' | 'info';
  timestamp: number;
}

export interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileSystemNode[];
  isOpen?: boolean;
}

// Procedural Generation Types
export interface ProjectNameParts {
  prefixes: string[];
  themes: string[];
  suffixes: string[];
}

export interface ButtonLabel {
  action: string;
  target: string;
}
