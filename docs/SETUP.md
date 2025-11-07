# 🚀 Quick Development Setup

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version
```

If you don't have Node.js 18+, download from: https://nodejs.org/

## Setup Steps

```bash
# 1. Navigate to project directory
cd idle-vibe

# 2. Install all dependencies
npm install

# 3. Start development server
npm run dev
```

The game should automatically open at `http://localhost:3000`

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

## Project Status Check

After `npm install`, verify everything is set up:

```bash
# Check if all packages installed
ls node_modules | wc -l
# Should show 200+ packages

# Verify TypeScript compilation
npx tsc --noEmit
# Should show no errors

# Test Vite config
npx vite --version
```

## Common Issues

### Port 3000 already in use
```bash
# Kill process on port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Verify tsconfig is correct
cat tsconfig.json

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

## Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

## Browser Compatibility

Works best in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

- Use Chrome DevTools to monitor FPS
- Keep terminal history under 50 lines
- Disable animations if FPS drops below 30

## Next Steps

1. Read `README.md` for full documentation
2. Explore `src/store/gameStore.ts` for game logic
3. Customize colors in `tailwind.config.js`
4. Test game balance by playing through level 5

Happy coding! 🎮✨
