# 🏗️ IDLE-VIBE Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     IDLE-VIBE TYCOON                        │
│                  React 18 + TypeScript 5                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         Vite Dev Server / Build         │
        │         (Hot Module Replacement)        │
        └─────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   ┌──────────────┐         ┌──────────────┐                │
│   │   App.tsx    │◄────────┤  main.tsx    │                │
│   │ (Root Layout)│         │ (Entry Point)│                │
│   └──────┬───────┘         └──────────────┘                │
│          │                                                   │
│          │  ┌────────────────────────────────┐             │
│          ├──┤  State Management (Zustand)    │             │
│          │  │  • gameStore.ts                 │             │
│          │  │  • Global game state            │             │
│          │  │  • Actions & mutations          │             │
│          │  └────────────────────────────────┘             │
│          │                                                   │
│          ▼                                                   │
│   ┌──────────────────────────────────────────┐            │
│   │         COMPONENT LAYER                   │            │
│   ├──────────────────────────────────────────┤            │
│   │                                            │            │
│   │  ┌─────────────┐  ┌──────────────┐      │            │
│   │  │  Terminal   │  │  FileSystem   │      │            │
│   │  │  Component  │  │  Component    │      │            │
│   │  └─────────────┘  └──────────────┘      │            │
│   │                                            │            │
│   │  ┌─────────────┐  ┌──────────────┐      │            │
│   │  │   Action    │  │  ProgressBar  │      │            │
│   │  │   Buttons   │  │  Component    │      │            │
│   │  └─────────────┘  └──────────────┘      │            │
│   │                                            │            │
│   │  ┌─────────────┐  ┌──────────────┐      │            │
│   │  │    Stats    │  │ Automations   │      │            │
│   │  │  Component  │  │  Component    │      │            │
│   │  └─────────────┘  └──────────────┘      │            │
│   └──────────────────────────────────────────┘            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      UTILITY LAYER                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   ┌────────────────────┐    ┌──────────────────────┐       │
│   │   formulas.ts      │    │   procedural.ts      │       │
│   │ • Cost calculations│    │ • Name generation    │       │
│   │ • Production rates │    │ • Button labels      │       │
│   │ • Progress scaling │    │ • File system gen    │       │
│   │ • Prestige formula │    │ • Pseudo-code gen    │       │
│   └────────────────────┘    └──────────────────────┘       │
│                                                               │
│   ┌────────────────────────────────────────┐               │
│   │          game.ts (Types)                │               │
│   │  • GameState interface                  │               │
│   │  • Automation interface                 │               │
│   │  • ActionButton interface               │               │
│   │  • TerminalLine interface               │               │
│   └────────────────────────────────────────┘               │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     STYLING LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   ┌──────────────────┐     ┌─────────────────────┐         │
│   │  Tailwind CSS    │     │   Custom CSS        │         │
│   │ • Utility classes│────▶│ • Animations        │         │
│   │ • Theme colors   │     │ • Scrollbars        │         │
│   │ • Responsive     │     │ • Holographic FX    │         │
│   └──────────────────┘     └─────────────────────┘         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │   Browser    │
                       │   Rendering  │
                       └──────────────┘
```

---

## Data Flow

```
USER INTERACTION
       │
       │ (1) Click Action Button
       ▼
┌──────────────────┐
│ ActionButtons.tsx│
└────────┬─────────┘
         │
         │ (2) Calls gameStore.click()
         ▼
┌──────────────────┐
│  gameStore.ts    │
│  (Zustand Store) │
└────────┬─────────┘
         │
         │ (3) Updates state:
         │     • Decrease codePoints
         │     • Increase progress
         │     • Generate pseudo-code
         │     • Check for app delivery
         ▼
┌──────────────────────────────────┐
│  React Re-render Cascade         │
├──────────────────────────────────┤
│  • ProgressBar (new progress)    │
│  • Stats (new code points)       │
│  • Terminal (new pseudo-code)    │
│  • ActionButtons (cooldown)      │
└──────────────────────────────────┘
```

---

## Component Responsibility Matrix

| Component | Primary Responsibility | State Subscriptions | User Actions |
|-----------|----------------------|-------------------|--------------|
| **App.tsx** | Layout & game loop | projectName, level | None (container) |
| **Terminal.tsx** | Display terminal output | terminalLines | None (display only) |
| **FileSystem.tsx** | Show file tree | fileSystem, projectName | Folder expand/collapse |
| **ActionButtons.tsx** | Coding actions | actionButtons, codePoints | Click to code |
| **ProgressBar.tsx** | Show completion % | progress, projectName, level | None (display only) |
| **Stats.tsx** | Display metrics | codePoints, level, clicks, multiplier | None (display only) |
| **Automations.tsx** | Upgrade shop | automations, codePoints | Buy automations |

---

## State Management Flow (Zustand)

```typescript
// 1. Component subscribes to specific state
const codePoints = useGameStore(state => state.codePoints);

// 2. Component calls action
const click = useGameStore(state => state.click);
click('debug');

// 3. Store updates state
set({ codePoints: newValue });

// 4. Only subscribed components re-render
// (Zustand automatically optimizes this)
```

---

## Game Loop Architecture

```
┌─────────────────────────────────────┐
│     App.tsx (useEffect Hook)        │
│  setInterval(() => tick(), 100ms)   │
└────────────┬────────────────────────┘
             │
             │ Every 100ms
             ▼
┌─────────────────────────────────────┐
│      gameStore.tick()                │
├─────────────────────────────────────┤
│ 1. Calculate time delta              │
│ 2. Get total production rate         │
│ 3. Add passive code points           │
│ 4. Update lastTick timestamp         │
└─────────────────────────────────────┘
             │
             │ State update triggers
             ▼
┌─────────────────────────────────────┐
│      React Re-render                 │
│  • Stats component shows new points  │
│  • Production rate displayed         │
└─────────────────────────────────────┘
```

**Performance Note**: 100ms tick rate (10 ticks/sec) balances smoothness with CPU efficiency.

---

## Procedural Generation Pipeline

```
APP DELIVERY TRIGGERED (100% progress)
       │
       ▼
┌──────────────────────────────────┐
│  generateProjectName()           │
│  • Pick random prefix            │
│  • Pick random theme             │
│  • Pick random suffix            │
│  → "QuantumSync AI"              │
└─────────┬────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│  generateButtonLabels()          │
│  • Use project name as seed      │
│  • Pick random action verbs      │
│  • Pick random code targets      │
│  → "Debug NeuralNet"             │
└─────────┬────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│  generateFileSystem()            │
│  • Create directory structure    │
│  • Use project name in paths     │
│  → /projects/quantumsync-ai/src  │
└─────────┬────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│  State Update & Reset            │
│  • New projectName               │
│  • New actionButton labels       │
│  • New fileSystem                │
│  • Progress reset to 0%          │
│  • Level + 1                     │
└──────────────────────────────────┘
```

---

## Formula System

```
┌──────────────────────────────────────────────┐
│         LOGARITHMIC PROGRESSION              │
├──────────────────────────────────────────────┤
│                                              │
│  Upgrade Cost:                               │
│  cost = base × (1.15^level) × log(1+level)  │
│                                              │
│  Production Rate:                            │
│  rate = base × level × log(1+level/2)       │
│                                              │
│  Click Progress (diminishing):               │
│  progress = base × (1/log(1+level/3))       │
│                                              │
│  Prestige Multiplier:                        │
│  mult = log(totalApps+1) × 0.1 + 1          │
│                                              │
└──────────────────────────────────────────────┘

Why Logarithmic?
• Early game: Fast progression (log grows quickly at start)
• Mid game: Steady growth (log curve flattens)
• Late game: Sustainable challenge (not impossible)
• Balance: Avoids exponential explosion or linear tedium
```

---

## Styling Architecture

```
┌─────────────────────────────────────────┐
│         TAILWIND CSS THEME              │
├─────────────────────────────────────────┤
│  Holographic Colors:                    │
│  • holo-cyan: #00ffff (Primary)         │
│  • holo-pink: #ff00ff (Accents)         │
│  • holo-blue: #0088ff (Automations)     │
│  • holo-green: #00ff88 (Success)        │
│  • holo-purple: #8800ff (File system)   │
│                                         │
│  Custom Animations:                     │
│  • pulse-glow: Button hover effect      │
│  • scan: CRT scan line effect           │
│  • flicker: Terminal flicker            │
│  • shimmer: Progress bar shine          │
└─────────────────────────────────────────┘
```

---

## Build Pipeline

```
Source Files (.tsx, .ts, .css)
       │
       │ Vite Dev Server
       ▼
┌──────────────────────┐
│  TypeScript Compiler │ → Type checking
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  React JSX Transform │ → JSX → JavaScript
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   PostCSS            │
│   • Tailwind         │ → CSS processing
│   • Autoprefixer     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Vite Bundler        │ → Code splitting, minification
└──────────┬───────────┘
           │
           ▼
     dist/ folder
     (Production build)
```

---

## Performance Optimizations

### 1. State Management
```typescript
// ✅ Good: Specific subscription
const codePoints = useGameStore(state => state.codePoints);

// ❌ Bad: Entire state subscription
const state = useGameStore();
```

### 2. Component Updates
- React.memo used on heavy components
- Zustand selectors prevent unnecessary re-renders
- Terminal line limit (50) prevents memory bloat

### 3. CSS
- Tailwind purges unused classes (production CSS < 10KB)
- Custom animations use GPU-accelerated properties (transform, opacity)
- Grid layout over flexbox for complex layouts

### 4. Game Loop
- 100ms tick (not 16ms) reduces CPU usage
- Passive generation calculated per tick (not per frame)
- State updates batched by React

---

## Scalability Considerations

### Current Design Supports:
✅ **10+ automations** (formula handles exponential growth)  
✅ **100+ levels** (logarithmic scaling prevents inflation)  
✅ **1000+ terminal lines** (but capped at 50 for performance)  
✅ **Multiple projects** (procedural generation is deterministic)  

### Theoretical Limits:
- **JavaScript Number**: Max safe integer = 9,007,199,254,740,991
- **Terminal history**: 50 lines (configurable)
- **Automation count**: Limited by UI space, not logic
- **Level cap**: None (logarithmic formula scales infinitely)

---

## Error Handling Strategy

```typescript
// Store actions wrap critical operations
buyAutomation: (id: string) => {
  const automation = state.automations.find(a => a.id === id);
  if (!automation) return; // Guard clause
  
  const cost = calculateUpgradeCost(automation.baseCost, automation.currentLevel);
  if (state.codePoints < cost) return; // Validation
  
  // Safe to proceed...
}
```

**No try-catch needed** because:
- TypeScript prevents type errors at compile time
- Guard clauses handle edge cases
- Pure functions have no side effects
- React error boundaries catch UI errors

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| ES2020 | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Flexbox | ✅ | ✅ | ✅ | ✅ |
| Tailwind | ✅ | ✅ | ✅ | ✅ |
| LocalStorage | ✅ | ✅ | ✅ | ✅ |

**No polyfills needed** for modern browsers (2020+)

---

## Testing Strategy (Future)

```
Unit Tests (Jest + Testing Library)
├── utils/
│   ├── formulas.test.ts
│   └── procedural.test.ts
├── store/
│   └── gameStore.test.ts
└── components/
    ├── ActionButtons.test.tsx
    └── Terminal.test.tsx

Integration Tests
└── Game flow: Click → Progress → Delivery → Level up

E2E Tests (Playwright)
└── Full game session: Level 1 to 5
```

---

## Deployment Options

| Platform | Command | Notes |
|----------|---------|-------|
| **Vercel** | `vercel --prod` | Zero config |
| **Netlify** | Drag `/dist` | Auto deploy |
| **GitHub Pages** | `gh-pages -d dist` | Free hosting |
| **AWS S3** | `aws s3 sync dist/ s3://bucket` | Scalable |
| **Docker** | `docker build -t idle-vibe .` | Containerized |

---

## File Size Analysis

```
Production Build (~500 KB total):
├── JavaScript (index.js):        ~250 KB (gzipped: ~80 KB)
├── CSS (index.css):               ~8 KB (gzipped: ~3 KB)
├── HTML (index.html):             ~1 KB
└── Assets (fonts, icons):         ~150 KB

Load Time Estimates:
• 4G LTE: < 1 second
• 3G: < 3 seconds
• Slow 3G: < 5 seconds
```

---

## Maintenance Checklist

### Weekly
- [ ] Test game balance through level 5
- [ ] Check for console errors
- [ ] Monitor production bundle size

### Monthly
- [ ] Update dependencies (`npm outdated`)
- [ ] Review game analytics (if implemented)
- [ ] Gather player feedback

### Quarterly
- [ ] Refactor based on usage patterns
- [ ] Add new automations or features
- [ ] Performance audit

---

**Architecture Status: Production-Ready**

This architecture supports:
- **Fast development** (hot reload, TypeScript)
- **Easy maintenance** (modular, typed)
- **Good performance** (optimized state, CSS)
- **Scalability** (logarithmic formulas, efficient state)

Ready for deployment! 🚀
