import { ProjectNameParts, ButtonLabel } from '../types/game';

/**
 * Procedural Generation System
 * Creates unique project names and button labels for each reset
 */

const PROJECT_PARTS: ProjectNameParts = {
  prefixes: [
    'Neo', 'Quantum', 'Cyber', 'Holo', 'Neural', 'Void', 
    'Apex', 'Prime', 'Ultra', 'Meta', 'Hyper', 'Nexus',
    'Stellar', 'Cosmic', 'Nebula', 'Aurora', 'Eclipse', 'Zenith'
  ],
  themes: [
    'Task', 'Sync', 'Flow', 'Wave', 'Pulse', 'Shift',
    'Link', 'Hub', 'Net', 'Core', 'Forge', 'Grid',
    'Cloud', 'Matrix', 'Vault', 'Portal', 'Stream', 'Beacon'
  ],
  suffixes: [
    'AI', 'Pro', 'Suite', 'Lab', 'Engine', 'System',
    'Platform', 'Framework', 'Studio', 'Workspace', 'App', 'OS'
  ]
};

const ACTION_VERBS = [
  'Debug', 'Optimize', 'Refactor', 'Deploy', 'Compile', 'Test',
  'Scan', 'Fix', 'Patch', 'Update', 'Build', 'Analyze'
];

const CODE_TARGETS = [
  'NeuralNet', 'Algorithm', 'Module', 'Pipeline', 'Database', 'API',
  'Interface', 'Backend', 'Frontend', 'Middleware', 'Cache', 'Service',
  'Framework', 'Library', 'Component', 'Function', 'Schema', 'Query'
];

/**
 * Generate a unique project name
 */
export const generateProjectName = (seed?: number): string => {
  const random = seed !== undefined ? seededRandom(seed) : Math.random;
  
  const prefix = PROJECT_PARTS.prefixes[Math.floor(random() * PROJECT_PARTS.prefixes.length)];
  const theme = PROJECT_PARTS.themes[Math.floor(random() * PROJECT_PARTS.themes.length)];
  const suffix = PROJECT_PARTS.suffixes[Math.floor(random() * PROJECT_PARTS.suffixes.length)];
  
  return `${prefix}${theme} ${suffix}`;
};

/**
 * Generate dynamic button labels based on project theme
 */
export const generateButtonLabels = (projectName: string): ButtonLabel[] => {
  const seed = projectName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = () => seededRandom(seed)();
  
  return [
    {
      action: ACTION_VERBS[Math.floor(random() * ACTION_VERBS.length)],
      target: CODE_TARGETS[Math.floor(random() * CODE_TARGETS.length)]
    },
    {
      action: ACTION_VERBS[Math.floor(random() * ACTION_VERBS.length)],
      target: CODE_TARGETS[Math.floor(random() * CODE_TARGETS.length)]
    },
    {
      action: ACTION_VERBS[Math.floor(random() * ACTION_VERBS.length)],
      target: CODE_TARGETS[Math.floor(random() * CODE_TARGETS.length)]
    },
    {
      action: 'Run',
      target: 'E2E Tests'
    }
  ];
};

/**
 * Generate pseudo-code lines for terminal
 */
export const generatePseudoCode = (action: string, level: number): string[] => {
  const templates = [
    `// ${action} initiated at level ${level}`,
    `function ${action.toLowerCase().replace(/\s+/g, '_')}() {`,
    `  const result = await process.execute();`,
    `  if (result.success) {`,
    `    console.log("✓ ${action} completed");`,
    `    return { status: 'success', level: ${level} };`,
    `  }`,
    `}`,
    ``,
    `$ git commit -m "feat: ${action.toLowerCase()}"`,
    `[main ${Math.random().toString(36).substr(2, 7)}] feat: ${action.toLowerCase()}`,
    ` ${Math.floor(Math.random() * 20) + 1} files changed, ${Math.floor(Math.random() * 200) + 50} insertions(+)`,
  ];
  
  return templates;
};

/**
 * Generate file system structure
 */
export const generateFileSystem = (projectName: string): any => {
  const baseName = projectName.toLowerCase().replace(/\s+/g, '-');
  
  return {
    name: '/',
    type: 'directory',
    path: '/',
    isOpen: true,
    children: [
      {
        name: 'projects',
        type: 'directory',
        path: '/projects',
        isOpen: true,
        children: [
          {
            name: baseName,
            type: 'directory',
            path: `/projects/${baseName}`,
            isOpen: true,
            children: [
              {
                name: 'src',
                type: 'directory',
                path: `/projects/${baseName}/src`,
                isOpen: false,
                children: [
                  { name: 'main.ts', type: 'file', path: `/projects/${baseName}/src/main.ts` },
                  { name: 'core.ts', type: 'file', path: `/projects/${baseName}/src/core.ts` },
                  { name: 'utils.ts', type: 'file', path: `/projects/${baseName}/src/utils.ts` },
                ]
              },
              {
                name: 'tests',
                type: 'directory',
                path: `/projects/${baseName}/tests`,
                isOpen: false,
                children: [
                  { name: 'e2e.test.ts', type: 'file', path: `/projects/${baseName}/tests/e2e.test.ts` },
                ]
              },
              { name: 'package.json', type: 'file', path: `/projects/${baseName}/package.json` },
              { name: 'tsconfig.json', type: 'file', path: `/projects/${baseName}/tsconfig.json` },
              { name: 'README.md', type: 'file', path: `/projects/${baseName}/README.md` },
            ]
          }
        ]
      }
    ]
  };
};

/**
 * Seeded random number generator for consistent procedural generation
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}
