import { create } from 'zustand';
import { GameState, Automation, ActionButton, TerminalLine } from './game';
import { 
  calculateUpgradeCost, 
  calculateClickProgress, 
  calculateProductionRate,
  calculatePrestigeMultiplier,
  calculateTotalProduction 
} from '../utils/formulas';
import { generateProjectName, generateButtonLabels, generatePseudoCode, generateFileSystem } from '../utils/procedural';

interface GameStore extends GameState {
  // Actions
  click: (buttonId: string) => void;
  tick: () => void;
  buyAutomation: (automationId: string) => void;
  deliverApp: () => void;
  resetGame: () => void;
  
  // UI State
  terminalLines: TerminalLine[];
  addTerminalLine: (line: Omit<TerminalLine, 'id' | 'timestamp'>) => void;
  clearTerminal: () => void;
  
  // File system
  fileSystem: any;
  
  // Action buttons (dynamic)
  actionButtons: ActionButton[];
  updateActionButtons: () => void;
}

const INITIAL_AUTOMATIONS: Automation[] = [
  {
    id: 'ai-assistant',
    name: 'AI Assistant Bot',
    baseProductionRate: 0.5,
    currentLevel: 0,
    baseCost: 10,
    description: 'Generates code points passively',
    icon: 'fa-robot'
  },
  {
    id: 'auto-debugger',
    name: 'Auto-Debugger',
    baseProductionRate: 2,
    currentLevel: 0,
    baseCost: 50,
    description: 'Fixes bugs automatically',
    icon: 'fa-bug'
  },
  {
    id: 'code-optimizer',
    name: 'Code Optimizer',
    baseProductionRate: 8,
    currentLevel: 0,
    baseCost: 250,
    description: 'Optimizes code for performance',
    icon: 'fa-gauge-high'
  },
  {
    id: 'ci-pipeline',
    name: 'CI/CD Pipeline',
    baseProductionRate: 32,
    currentLevel: 0,
    baseCost: 1000,
    description: 'Automates testing and deployment',
    icon: 'fa-arrows-spin'
  },
  {
    id: 'neural-coder',
    name: 'Neural Coder',
    baseProductionRate: 128,
    currentLevel: 0,
    baseCost: 5000,
    description: 'Advanced AI coding system',
    icon: 'fa-brain'
  }
];

const createInitialActionButtons = (): ActionButton[] => {
  const labels = generateButtonLabels(generateProjectName());
  return [
    {
      id: 'code',
      name: `${labels[0].action} ${labels[0].target}`,
      baseProgress: 2,
      baseCost: 0,
      description: 'Write code manually',
      icon: 'fa-code',
      cooldown: 0,
      lastUsed: 0
    },
    {
      id: 'debug',
      name: `${labels[1].action} ${labels[1].target}`,
      baseProgress: 4,
      baseCost: 5,
      description: 'Fix bugs in the code',
      icon: 'fa-bug',
      cooldown: 500,
      lastUsed: 0
    },
    {
      id: 'lint',
      name: `${labels[2].action} ${labels[2].target}`,
      baseProgress: 6,
      baseCost: 10,
      description: 'Lint and format code',
      icon: 'fa-broom',
      cooldown: 1000,
      lastUsed: 0
    },
    {
      id: 'test',
      name: labels[3].action + ' ' + labels[3].target,
      baseProgress: 10,
      baseCost: 20,
      description: 'Run end-to-end tests',
      icon: 'fa-vial',
      cooldown: 2000,
      lastUsed: 0
    }
  ];
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  codePoints: 0,
  progress: 0,
  level: 1,
  projectName: generateProjectName(),
  automations: INITIAL_AUTOMATIONS,
  upgrades: {},
  totalClicks: 0,
  totalAppsDelivered: 0,
  prestigeMultiplier: 1,
  lastTick: Date.now(),
  isPaused: false,
  terminalLines: [],
  fileSystem: generateFileSystem(generateProjectName()),
  actionButtons: createInitialActionButtons(),
  
  // Actions
  click: (buttonId: string) => {
    const state = get();
    const button = state.actionButtons.find(b => b.id === buttonId);
    
    if (!button) return;
    
    const now = Date.now();
    if (now - button.lastUsed < button.cooldown) return;
    if (state.codePoints < button.baseCost) return;
    
    const progressGain = calculateClickProgress(button.baseProgress, state.level) * state.prestigeMultiplier;
    const newProgress = Math.min(100, state.progress + progressGain);
    
    // Generate terminal output
    const pseudoCode = generatePseudoCode(button.name, state.level);
    pseudoCode.forEach((line, index) => {
      setTimeout(() => {
        get().addTerminalLine({ 
          text: line, 
          type: line.startsWith('//') ? 'info' : line.includes('✓') ? 'success' : 'output' 
        });
      }, index * 50);
    });
    
    set({
      codePoints: state.codePoints - button.baseCost,
      progress: newProgress,
      totalClicks: state.totalClicks + 1,
      actionButtons: state.actionButtons.map(b => 
        b.id === buttonId ? { ...b, lastUsed: now } : b
      )
    });
    
    // Check for app delivery
    if (newProgress >= 100) {
      setTimeout(() => get().deliverApp(), 500);
    }
  },
  
  tick: () => {
    const state = get();
    if (state.isPaused) return;
    
    const now = Date.now();
    const deltaTime = (now - state.lastTick) / 1000; // Convert to seconds
    
    const productionRate = calculateTotalProduction(state.automations) * state.prestigeMultiplier;
    const pointsGained = productionRate * deltaTime;
    
    set({
      codePoints: state.codePoints + pointsGained,
      lastTick: now
    });
  },
  
  buyAutomation: (automationId: string) => {
    const state = get();
    const automation = state.automations.find(a => a.id === automationId);
    
    if (!automation) return;
    
    const cost = calculateUpgradeCost(automation.baseCost, automation.currentLevel);
    
    if (state.codePoints < cost) return;
    
    set({
      codePoints: state.codePoints - cost,
      automations: state.automations.map(a =>
        a.id === automationId
          ? { ...a, currentLevel: a.currentLevel + 1 }
          : a
      )
    });
    
    get().addTerminalLine({
      text: `$ npm install ${automation.name.toLowerCase().replace(/\s+/g, '-')}@latest`,
      type: 'command'
    });
    get().addTerminalLine({
      text: `✓ ${automation.name} upgraded to level ${automation.currentLevel + 1}`,
      type: 'success'
    });
  },
  
  deliverApp: () => {
    const state = get();
    
    // Generate new project
    const newProjectName = generateProjectName(state.level + 1);
    const newLabels = generateButtonLabels(newProjectName);
    
    // Calculate prestige bonus
    const newPrestigeMultiplier = calculatePrestigeMultiplier(state.totalAppsDelivered + 1);
    
    get().addTerminalLine({
      text: ``,
      type: 'output'
    });
    get().addTerminalLine({
      text: `========================================`,
      type: 'success'
    });
    get().addTerminalLine({
      text: `🚀 APP DELIVERED: ${state.projectName}`,
      type: 'success'
    });
    get().addTerminalLine({
      text: `Level ${state.level} Complete!`,
      type: 'success'
    });
    get().addTerminalLine({
      text: `Prestige Multiplier: ${newPrestigeMultiplier.toFixed(2)}x`,
      type: 'info'
    });
    get().addTerminalLine({
      text: `========================================`,
      type: 'success'
    });
    get().addTerminalLine({
      text: ``,
      type: 'output'
    });
    get().addTerminalLine({
      text: `$ cd /projects/${newProjectName.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'command'
    });
    get().addTerminalLine({
      text: `Starting new project: ${newProjectName}`,
      type: 'info'
    });
    
    set({
      progress: 0,
      level: state.level + 1,
      totalAppsDelivered: state.totalAppsDelivered + 1,
      projectName: newProjectName,
      prestigeMultiplier: newPrestigeMultiplier,
      fileSystem: generateFileSystem(newProjectName),
      actionButtons: state.actionButtons.map((button, index) => ({
        ...button,
        name: index < 3 
          ? `${newLabels[index].action} ${newLabels[index].target}`
          : button.name
      }))
    });
  },
  
  resetGame: () => {
    const newProjectName = generateProjectName();
    set({
      codePoints: 0,
      progress: 0,
      level: 1,
      projectName: newProjectName,
      automations: INITIAL_AUTOMATIONS,
      upgrades: {},
      totalClicks: 0,
      totalAppsDelivered: 0,
      prestigeMultiplier: 1,
      lastTick: Date.now(),
      isPaused: false,
      terminalLines: [],
      fileSystem: generateFileSystem(newProjectName),
      actionButtons: createInitialActionButtons()
    });
  },
  
  addTerminalLine: (line) => {
    const state = get();
    const newLine: TerminalLine = {
      ...line,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    };
    
    const newLines = [...state.terminalLines, newLine];
    
    // Keep only last 50 lines
    if (newLines.length > 50) {
      newLines.shift();
    }
    
    set({ terminalLines: newLines });
  },
  
  clearTerminal: () => {
    set({ terminalLines: [] });
  },
  
  updateActionButtons: () => {
    const state = get();
    const newLabels = generateButtonLabels(state.projectName);
    set({
      actionButtons: state.actionButtons.map((button, index) => ({
        ...button,
        name: index < 3 
          ? `${newLabels[index].action} ${newLabels[index].target}`
          : button.name
      }))
    });
  }
}));
