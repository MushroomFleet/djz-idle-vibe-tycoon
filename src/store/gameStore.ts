import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  
  // Fatigue actions
  sleep: () => void;
  
  // Event actions
  triggerRandomEvent: () => 'bugs' | 'hardware' | 'none';
  closeModal: () => void;
  
  // Bugs modal actions
  clickBugsModal: () => void;
  
  // Hardware modal actions
  resolveHardware: (fixType: 'cheap' | 'standard' | 'premium') => void;
  
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

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
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
  
  // Fatigue system
  fatigueLevel: 0,
  maxFatigue: 300,
  isFatigued: false,
  dayCount: 0,
  sleepDebt: 0,
  
  // Economy
  cash: 1200,
  marketDirection: 'up',
  lastPayment: 0,
  
  // Events
  eventTriggered50: false,
  eventTriggered90: false,
  activeModal: null,
  
  // Hardware/Stability
  stability: 50,
  
  // Bugs modal
  bugsClicksRequired: 0,
  bugsClicksProgress: 0,
  
  // Actions
  click: (buttonId: string) => {
    const state = get();
    
    // Check if modal is active - prevent game clicks
    if (state.activeModal !== null) return;
    
    const button = state.actionButtons.find(b => b.id === buttonId);
    
    if (!button) return;
    
    const now = Date.now();
    if (now - button.lastUsed < button.cooldown) return;
    if (state.codePoints < button.baseCost) return;
    
    const progressGain = calculateClickProgress(button.baseProgress, state.level) * state.prestigeMultiplier;
    const newProgress = Math.min(100, state.progress + progressGain);
    
    // Generate code points based on button's baseProgress value
    const codePointsGained = button.baseProgress * state.prestigeMultiplier;
    const netCodePoints = state.codePoints + codePointsGained - button.baseCost;
    
    // Increment fatigue
    let newFatigueLevel = state.fatigueLevel + 1;
    let newDayCount = state.dayCount;
    let newCash = state.cash;
    let newSleepDebt = state.sleepDebt;
    
    // Auto-sleep when fatigue reaches max
    if (newFatigueLevel >= state.maxFatigue) {
      newDayCount = state.dayCount + 1;
      
      // Apply sleep debt from previous day as starting fatigue
      newFatigueLevel = Math.min(state.sleepDebt, state.maxFatigue);
      newSleepDebt = 0;
      
      // Check for rent payment every 30 days
      const rentDue = newDayCount % 30 === 0;
      if (rentDue) {
        newCash = state.cash - 2000;
        get().addTerminalLine({
          text: '🏠 RENT DUE: $2,000 deducted',
          type: newCash < 0 ? 'error' : 'info'
        });
      }
      
      get().addTerminalLine({
        text: `💤 Auto-sleep triggered. Day ${newDayCount}`,
        type: 'success'
      });
      
      if (state.sleepDebt > 0) {
        get().addTerminalLine({
          text: `⚠️ Sleep debt penalty: Starting fatigue at ${newFatigueLevel}`,
          type: 'info'
        });
      }
    }
    
    // Toggle market direction randomly (50/50 chance)
    const newMarketDirection = Math.random() < 0.5 ? 'up' : 'down';
    
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
    
    // Check for event triggers at 50% and 90%
    let eventModal: 'none' | 'bugs' | 'hardware' | null = null;
    if (!state.eventTriggered50 && newProgress >= 50 && state.progress < 50) {
      eventModal = get().triggerRandomEvent();
      set({ eventTriggered50: true });
    } else if (!state.eventTriggered90 && newProgress >= 90 && state.progress < 90) {
      eventModal = get().triggerRandomEvent();
      set({ eventTriggered90: true });
    }
    
    // Only set activeModal if there's an actual modal to show (not 'none')
    const newActiveModal = (eventModal === 'bugs' || eventModal === 'hardware') ? eventModal : state.activeModal;
    
    set({
      codePoints: netCodePoints,
      progress: newProgress,
      totalClicks: state.totalClicks + 1,
      fatigueLevel: newFatigueLevel,
      isFatigued: false, // Never block - auto-sleep handles this
      dayCount: newDayCount,
      cash: newCash,
      sleepDebt: newSleepDebt,
      marketDirection: newMarketDirection,
      activeModal: newActiveModal,
      actionButtons: state.actionButtons.map(b => 
        b.id === buttonId ? { ...b, lastUsed: now } : b
      )
    });
    
    // Check for app delivery (only block if there's an actual modal showing)
    if (newProgress >= 100 && eventModal !== 'bugs' && eventModal !== 'hardware') {
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
    
    // Calculate payment based on market direction
    const basePayment = 600;
    let paymentModifier: number;
    
    if (state.marketDirection === 'up') {
      // Market up: 101% to 200%
      paymentModifier = Math.random() + 1.01; // 1.01 to 2.01
    } else {
      // Market down: 50% to 99%
      paymentModifier = Math.random() * 0.49 + 0.5; // 0.50 to 0.99
    }
    
    const payment = Math.floor(basePayment * paymentModifier);
    const newCash = state.cash + payment;
    
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
      text: `💰 Payment: $${payment} (Market ${state.marketDirection === 'up' ? '↑' : '↓'})`,
      type: state.marketDirection === 'up' ? 'success' : 'info'
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
      cash: newCash,
      lastPayment: payment,
      eventTriggered50: false,
      eventTriggered90: false,
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
    // Clear localStorage
    localStorage.removeItem('idle-vibe-tycoon-save');
    
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
      actionButtons: createInitialActionButtons(),
      fatigueLevel: 0,
      maxFatigue: 300,
      isFatigued: false,
      dayCount: 0,
      sleepDebt: 0,
      cash: 1200,
      marketDirection: 'up',
      lastPayment: 0,
      eventTriggered50: false,
      eventTriggered90: false,
      activeModal: null,
      stability: 50,
      bugsClicksRequired: 0,
      bugsClicksProgress: 0,
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
  },
  
  // Fatigue actions
  sleep: () => {
    const state = get();
    
    const newDayCount = state.dayCount + 1;
    
    // Check for rent payment every 30 days
    let newCash = state.cash;
    const rentDue = newDayCount % 30 === 0;
    
    if (rentDue) {
      newCash = state.cash - 2000;
      get().addTerminalLine({
        text: '🏠 RENT DUE: $2,000 deducted',
        type: rentDue && newCash < 0 ? 'error' : 'info'
      });
    }
    
    get().addTerminalLine({
      text: `💤 Slept for the night. Day ${newDayCount}`,
      type: 'success'
    });
    
    set({
      fatigueLevel: 0,
      isFatigued: false,
      dayCount: newDayCount,
      cash: newCash
    });
  },
  
  // Event actions
  triggerRandomEvent: () => {
    const rand = Math.random();
    
    if (rand < 0.33) {
      // Nothing happens
      return 'none';
    } else if (rand < 0.66) {
      // Bugs modal
      const clicksRequired = Math.floor(Math.random() * 101) + 50; // 50-150 clicks
      set({
        activeModal: 'bugs',
        bugsClicksRequired: clicksRequired,
        bugsClicksProgress: 0
      });
      get().addTerminalLine({
        text: '⚠️ DEPENDENCY CONFLICT DETECTED!',
        type: 'error'
      });
      return 'bugs';
    } else {
      // Hardware modal
      set({
        activeModal: 'hardware'
      });
      get().addTerminalLine({
        text: '⚠️ HARDWARE FAILURE!',
        type: 'error'
      });
      return 'hardware';
    }
  },
  
  closeModal: () => {
    set({
      activeModal: null,
      bugsClicksRequired: 0,
      bugsClicksProgress: 0
    });
  },
  
  // Bugs modal actions
  clickBugsModal: () => {
    const state = get();
    
    if (state.activeModal !== 'bugs') return;
    
    const newProgress = state.bugsClicksProgress + 1;
    
    if (newProgress >= state.bugsClicksRequired) {
      // Resolved!
      get().addTerminalLine({
        text: '✓ Dependencies resolved!',
        type: 'success'
      });
      get().closeModal();
    } else {
      set({
        bugsClicksProgress: newProgress
      });
    }
  },
  
  // Hardware modal actions
  resolveHardware: (fixType: 'cheap' | 'standard' | 'premium') => {
    const state = get();
    
    if (state.activeModal !== 'hardware') return;
    
    // Base costs
    const baseCosts = {
      cheap: 100,
      standard: 300,
      premium: 600
    };
    
    // Stability modifiers
    const stabilityChanges = {
      cheap: -15,
      standard: 0,
      premium: 15
    };
    
    // Apply stability modifier to cost
    let costModifier = 1;
    if (state.stability > 70) {
      costModifier = 0.7; // 30% discount for high stability
    } else if (state.stability < 30) {
      costModifier = 1.75; // 75% markup for low stability
    }
    
    const cost = Math.floor(baseCosts[fixType] * costModifier);
    
    // Check if can afford
    if (state.cash < cost) {
      get().addTerminalLine({
        text: '❌ Insufficient funds!',
        type: 'error'
      });
      return;
    }
    
    const newStability = Math.max(0, Math.min(100, state.stability + stabilityChanges[fixType]));
    
    set({
      cash: state.cash - cost,
      stability: newStability
    });
    
    get().addTerminalLine({
      text: `✓ Hardware repaired with ${fixType} fix ($${cost})`,
      type: 'success'
    });
    get().addTerminalLine({
      text: `Stability: ${newStability}%`,
      type: 'info'
    });
    
    get().closeModal();
  }
}),
    {
      name: 'idle-vibe-tycoon-save',
      partialize: (state) => ({
        // Persist everything except terminal lines and file system
        codePoints: state.codePoints,
        progress: state.progress,
        level: state.level,
        projectName: state.projectName,
        automations: state.automations,
        upgrades: state.upgrades,
        totalClicks: state.totalClicks,
        totalAppsDelivered: state.totalAppsDelivered,
        prestigeMultiplier: state.prestigeMultiplier,
        lastTick: state.lastTick,
        isPaused: state.isPaused,
        actionButtons: state.actionButtons,
        fatigueLevel: state.fatigueLevel,
        maxFatigue: state.maxFatigue,
        isFatigued: state.isFatigued,
        dayCount: state.dayCount,
        sleepDebt: state.sleepDebt,
        cash: state.cash,
        marketDirection: state.marketDirection,
        lastPayment: state.lastPayment,
        eventTriggered50: state.eventTriggered50,
        eventTriggered90: state.eventTriggered90,
        activeModal: state.activeModal,
        stability: state.stability,
        bugsClicksRequired: state.bugsClicksRequired,
        bugsClicksProgress: state.bugsClicksProgress,
      }),
    }
  )
);
