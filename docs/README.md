# 🎮 Idle Vibe Tycoon

An AI-powered code simulation idle clicker game built with React, TypeScript, and Vite. Experience the zen of "vibe coding" in a futuristic holographic development environment!

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)

## 🌟 Features

### Core Gameplay
- **Idle Clicker Mechanics**: Click buttons to simulate coding tasks (debugging, coding, linting, testing)
- **Logarithmic Progression**: Balanced difficulty scaling that keeps the game engaging at all levels
- **Automation System**: Purchase AI assistants and tools for passive code point generation
- **Prestige System**: Deliver apps to level up with permanent multipliers
- **Procedural Generation**: Unique project names and button labels for each level

### Visual Experience
- **Holographic UI**: Sci-fi inspired interface with cyan, pink, and purple holograms
- **Streaming Terminal**: Watch pseudo-code write itself with realistic Unix terminal simulation
- **File System Explorer**: Browse a simulated holographic file tree
- **Dynamic Animations**: Scan lines, glows, flickers, and smooth transitions

### Technical Features
- **TypeScript**: Full type safety throughout the codebase
- **Zustand State Management**: Efficient global state with minimal boilerplate
- **Responsive Design**: Plays great on desktop and mobile
- **Performance Optimized**: Smooth 60 FPS with efficient rendering

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Clone the repository (or create from files)
cd idle-vibe

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:3000`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Play

### Objective
Manage a futuristic AI coding company by clicking buttons to complete projects and level up!

### Gameplay Loop

1. **Click Actions**: Start by clicking coding action buttons
   - **Code**: Write code manually (free, no cooldown)
   - **Debug**: Fix bugs (costs points, 0.5s cooldown)
   - **Lint**: Format and optimize code (costs points, 1s cooldown)
   - **Test**: Run E2E tests (costs points, 2s cooldown)

2. **Earn Code Points**: Actions generate progress toward app completion

3. **Buy Automations**: Spend code points on automation systems:
   - **AI Assistant Bot**: Basic passive generation
   - **Auto-Debugger**: Automated bug fixing
   - **Code Optimizer**: Performance tuning
   - **CI/CD Pipeline**: Continuous deployment
   - **Neural Coder**: Advanced AI coding

4. **Complete Projects**: Reach 100% progress to deliver an app

5. **Level Up**: Each delivery increases your level and prestige multiplier

6. **Repeat**: New project generates with unique name and challenges

### Progression System

The game uses **logarithmic scaling** for balanced progression:
- Early levels (1-5): Complete in 5-10 minutes
- Mid levels (6-20): Take 1-2 hours with automation
- Late game: Exponential growth balanced by logarithmic costs

**Formulas:**
- Upgrade Cost: `base × (1.15^level) × log(1 + level)`
- Production Rate: `base × level × log(1 + level/2)`
- Click Progress: `base × (1 / log(1 + level/3))` (diminishing returns)
- Prestige Multiplier: `log(total_apps + 1) × 0.1 + 1`

## 📁 Project Structure

```
idle-vibe/
├── src/
│   ├── components/          # React components
│   │   ├── ActionButtons.tsx    # Clickable coding actions
│   │   ├── Automations.tsx      # Upgrade shop
│   │   ├── FileSystem.tsx       # Holographic file tree
│   │   ├── ProgressBar.tsx      # App completion progress
│   │   ├── Stats.tsx            # Game statistics
│   │   └── Terminal.tsx         # Streaming code terminal
│   ├── store/
│   │   └── gameStore.ts         # Zustand state management
│   ├── types/
│   │   └── game.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── formulas.ts          # Game balance calculations
│   │   └── procedural.ts        # Procedural generation
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # React entry point
│   └── index.css                # Tailwind + custom styles
├── index.html
├── package.json
├── tailwind.config.js           # Tailwind theme configuration
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design Decisions

### Color Palette
- **Cyan (`#00ffff`)**: Primary UI, terminal text
- **Pink (`#ff00ff`)**: Accents, multipliers
- **Blue (`#0088ff`)**: Automation systems
- **Green (`#00ff88`)**: Success states, progress
- **Purple (`#8800ff`)**: File system, stats

### Architecture Choices

**Why Zustand?**
- Minimal boilerplate compared to Redux
- Perfect for games with frequent state updates
- No context provider hell
- Excellent TypeScript support

**Why Vite?**
- Lightning-fast HMR during development
- Optimized production builds
- First-class TypeScript support
- Modern ESM-based tooling

**Why Tailwind?**
- Rapid UI development
- Consistent design system
- Purged unused CSS in production
- Easy responsive design

## 🔧 Customization

### Adjust Game Balance

Edit `src/utils/formulas.ts`:

```typescript
// Make early game easier
export const calculateClickProgress = (baseProgress: number, level: number): number => {
  if (level < 5) return baseProgress * 1.5; // 50% bonus for first 5 levels
  // ... rest of formula
};
```

### Add New Automations

Edit `src/store/gameStore.ts`:

```typescript
{
  id: 'quantum-compiler',
  name: 'Quantum Compiler',
  baseProductionRate: 512,
  currentLevel: 0,
  baseCost: 25000,
  description: 'Harness quantum computing',
  icon: 'fa-atom'
}
```

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'holo': {
    'cyan': '#00ff00',  // Change to green
    // ...
  }
}
```

## 🐛 Troubleshooting

### Terminal not scrolling
Check that `terminalEndRef` is properly connected in `Terminal.tsx`

### Production build fails
Ensure all imports use `.tsx` extensions explicitly

### Performance issues
Reduce terminal history limit in `gameStore.ts` (currently 50 lines)

## 📊 Game Balance Tips

**For Developers:**
- Test progression through first 10 levels
- Ensure automations feel impactful (2-3x production boost)
- Keep early game fast (first delivery < 10 minutes)
- Late game should rely heavily on automation

**For Players:**
- Buy automations early and often
- Don't hoard code points
- Each level gets harder but multipliers help
- Focus on highest-level automation first

## 🚀 Future Enhancements

Potential features for v2.0:
- [ ] Save/load system (localStorage)
- [ ] Achievements system
- [ ] Multiple project themes (game dev, web3, AI)
- [ ] Sound effects and music
- [ ] Mobile app version
- [ ] Offline progression
- [ ] Prestige tree with skill branches
- [ ] Multiplayer leaderboards

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions welcome! Focus areas:
- Game balance testing and feedback
- Visual effect enhancements
- Mobile UX improvements
- Performance optimizations

## 🎮 Credits

**Game Design**: Based on idle clicker research from Kongregate, Mind Studios, and incremental games community

**Inspiration**: 
- Cookie Clicker
- Adventure Capitalist
- Cyberpunk 2077 UI
- Terminal aesthetics from Hackers (1995)

**Built with**: React, TypeScript, Vite, Tailwind CSS, Zustand, Font Awesome

---

**Made with ❤️ for the idle game community**

*Vibe on, code on!* 🌈💻✨

## 📚 Citation

### Academic Citation

If you use this codebase in your research or project, please cite:

```bibtex
@software{djz_idle-vibe_tycoon,
  title = {djz idle vibe tycoon: code simulation idle clicker game},
  author = {[Drift Johnson]},
  year = {2025},
  url = {https://github.com/MushroomFleet/djz-idle-vibe-tycoon},
  version = {1.0.0}
}
```

### Donate:


[![Ko-Fi](https://cdn.ko-fi.com/cdn/kofi3.png?v=3)](https://ko-fi.com/driftjohnson)
