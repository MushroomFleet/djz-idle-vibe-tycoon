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
  
  // Fatigue system
  fatigueLevel: number;
  maxFatigue: number;
  isFatigued: boolean;
  dayCount: number;
  sleepDebt: number; // Accumulated fatigue clicks beyond max during modals
  
  // Economy
  cash: number;
  marketDirection: 'up' | 'down';
  lastPayment: number;
  
  // Events
  eventTriggered50: boolean;
  eventTriggered90: boolean;
  activeModal: 'none' | 'bugs' | 'hardware' | null;
  
  // Hardware/Stability
  stability: number; // 0-100
  
  // Bugs modal
  bugsClicksRequired: number;
  bugsClicksProgress: number;
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
