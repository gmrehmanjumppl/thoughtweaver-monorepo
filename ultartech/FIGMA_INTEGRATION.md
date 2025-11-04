# Figma Integration Guide
## Automated Design-to-Code Sync Strategy

**Version:** 2.0.0  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Figma Setup](#figma-setup)
3. [Sync Tool Architecture](#sync-tool-architecture)
4. [Design Token Extraction](#design-token-extraction)
5. [Component Spec Extraction](#component-spec-extraction)
6. [Automated Workflow](#automated-workflow)
7. [Visual Regression Testing](#visual-regression-testing)
8. [Migration from Old Designs](#migration-from-old-designs)

---

## Overview

### Why Figma Integration?

1. **Design Consistency**: Ensures code matches designs exactly
2. **Automated Sync**: No manual token copying
3. **Design Updates**: Designer changes automatically flow to code
4. **Visual Regression**: Detects design drift automatically
5. **Developer Experience**: Developers always have latest design tokens

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│  Designer updates Figma                                 │
│  └─ Changes design tokens, components                   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  GitHub Action triggers (scheduled or manual)           │
│  └─ Runs figma-sync tool                                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Figma API extracts:                                    │
│  ├─ Design tokens (colors, spacing, typography)         │
│  ├─ Component specs (dimensions, styles)                │
│  └─ Asset references                                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Code Generation:                                       │
│  ├─ packages/ui/src/theme/tokens.ts                     │
│  ├─ Component skeletons (if new components)            │
│  └─ Asset mappings                                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Automated PR created                                   │
│  └─ Developer reviews and merges                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Visual Regression Tests run                            │
│  └─ Verify components match designs                      │
└─────────────────────────────────────────────────────────┘
```

---

## Figma Setup

### Step 1: Organize Figma File Structure

#### Recommended Structure:

```
Figma File: Thoughtweaver Design
├── 🎨 Design System
│   ├── Colors
│   │   ├── Primary
│   │   ├── Secondary
│   │   ├── Semantic (Success, Error, Warning)
│   │   └── Neutral
│   ├── Typography
│   │   ├── Font Families
│   │   ├── Font Sizes
│   │   └── Font Weights
│   ├── Spacing
│   │   └── Spacing Scale (4px, 8px, 16px, etc.)
│   └── Effects
│       ├── Shadows
│       └── Borders
│
├── 🧩 Components
│   ├── Button
│   │   ├── Primary
│   │   ├── Secondary
│   │   └── Variants
│   ├── Input
│   ├── Card
│   └── ...
│
└── 📱 Screens
    ├── Home
    ├── Conversation
    └── ...
```

### Step 2: Use Figma Variables

**Figma Variables** are the key to automated sync. Set up variables for:

#### Color Variables

```
Primary/500: #7C3AED
Primary/600: #6D28D9
Secondary/500: #6366F1
...
```

#### Spacing Variables

```
Spacing/XS: 4px
Spacing/SM: 8px
Spacing/MD: 16px
Spacing/LG: 24px
...
```

#### Typography Variables

```
Font/Size/Body: 16px
Font/Size/Heading1: 32px
Font/Weight/Regular: 400
Font/Weight/Medium: 500
...
```

### Step 3: Name Components Consistently

Use consistent naming convention:

```
Button/Primary
Button/Secondary
Input/Default
Input/Error
Card/Default
```

### Step 4: Set Up Figma API Access

1. **Create Personal Access Token**:
   - Go to Figma → Settings → Account
   - Scroll to "Personal Access Tokens"
   - Click "Create new token"
   - Name: "Thoughtweaver Sync"
   - Copy token

2. **Get File Key**:
   - Open Figma file
   - URL format: `https://www.figma.com/file/FILE_KEY/Design-Name`
   - Copy `FILE_KEY`

3. **Add to Environment**:
   ```env
   FIGMA_TOKEN=figd_your_token_here
   FIGMA_FILE_KEY=your_file_key_here
   ```

---

## Sync Tool Architecture

### Tool Structure

```
tools/figma-sync/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── sync-tokens.ts           # Token extraction
│   ├── sync-components.ts       # Component extraction
│   ├── sync-assets.ts           # Asset extraction
│   ├── generators/
│   │   ├── tokens-generator.ts  # Generate tokens.ts
│   │   ├── component-generator.ts # Generate component skeletons
│   │   └── assets-generator.ts  # Generate asset mappings
│   ├── utils/
│   │   ├── figma-client.ts      # Figma API wrapper
│   │   └── transformers.ts      # Data transformation
│   └── types.ts                 # TypeScript types
├── package.json
└── tsconfig.json
```

### Main Sync Function

```typescript
// tools/figma-sync/src/index.ts
import { syncTokens } from './sync-tokens';
import { syncComponents } from './sync-components';
import { syncAssets } from './sync-assets';

async function main() {
  console.log('🎨 Starting Figma sync...');
  
  try {
    // Sync design tokens
    await syncTokens();
    
    // Sync component specs
    await syncComponents();
    
    // Sync assets
    await syncAssets();
    
    console.log('✅ Figma sync completed successfully!');
  } catch (error) {
    console.error('❌ Figma sync failed:', error);
    process.exit(1);
  }
}

main();
```

---

## Design Token Extraction

### Token Extraction Logic

```typescript
// tools/figma-sync/src/sync-tokens.ts
import { FigmaApi } from '@figma/rest-api-sdk';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface DesignToken {
  name: string;
  value: string;
  type: 'color' | 'spacing' | 'typography' | 'effect';
  category: string;
}

async function extractTokens(file: FigmaFile): Promise<DesignToken[]> {
  const tokens: DesignToken[] = [];
  
  // Extract color variables
  const colorVariables = file.styles
    .filter(style => style.styleType === 'FILL')
    .map(style => ({
      name: style.name,
      value: extractColorValue(style),
      type: 'color' as const,
      category: extractCategory(style.name),
    }));
  
  tokens.push(...colorVariables);
  
  // Extract spacing variables
  const spacingVariables = extractSpacingVariables(file);
  tokens.push(...spacingVariables);
  
  // Extract typography variables
  const typographyVariables = extractTypographyVariables(file);
  tokens.push(...typographyVariables);
  
  return tokens;
}

function extractColorValue(style: FigmaStyle): string {
  // Convert Figma color to hex/rgb
  const paint = style.paints[0];
  if (paint.type === 'SOLID') {
    const { r, g, b } = paint.color;
    return rgbToHex(r * 255, g * 255, b * 255);
  }
  return '#000000';
}

function extractCategory(name: string): string {
  // "Primary/500" -> "primary"
  return name.split('/')[0].toLowerCase();
}
```

### Token File Generation

```typescript
// tools/figma-sync/src/generators/tokens-generator.ts
import { DesignToken } from '../types';

export function generateTokensFile(tokens: DesignToken[]): string {
  const grouped = groupTokensByCategory(tokens);
  
  return `// Auto-generated from Figma - DO NOT EDIT MANUALLY
// Last synced: ${new Date().toISOString()}

export const tokens = {
  color: {
    ${generateColorTokens(grouped.color)}
  },
  spacing: {
    ${generateSpacingTokens(grouped.spacing)}
  },
  typography: {
    ${generateTypographyTokens(grouped.typography)}
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};
`;
}

function generateColorTokens(tokens: DesignToken[]): string {
  return tokens.map(token => {
    const key = token.name.split('/')[1]?.toLowerCase() || token.name.toLowerCase();
    return `${key}: '${token.value}',`;
  }).join('\n    ');
}
```

### Output Example

```typescript
// packages/ui/src/theme/tokens.ts
export const tokens = {
  color: {
    primary500: '#7C3AED',
    primary600: '#6D28D9',
    secondary500: '#6366F1',
    success: '#10B981',
    error: '#EF4444',
    // ...
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    // ...
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    fontSize: {
      body: '1rem',      // 16px
      heading1: '2rem',  // 32px
      // ...
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
};
```

---

## Component Spec Extraction

### Component Extraction Logic

```typescript
// tools/figma-sync/src/sync-components.ts
import { FigmaApi } from '@figma/rest-api-sdk';

interface ComponentSpec {
  name: string;
  props: ComponentProp[];
  styles: ComponentStyle[];
  variants: ComponentVariant[];
}

async function extractComponentSpecs(file: FigmaFile): Promise<ComponentSpec[]> {
  const components: ComponentSpec[] = [];
  
  // Find all component instances
  const componentNodes = file.document.children
    .flatMap(findComponents)
    .filter(node => node.type === 'COMPONENT');
  
  for (const node of componentNodes) {
    const spec = extractComponentSpec(node);
    components.push(spec);
  }
  
  return components;
}

function extractComponentSpec(node: ComponentNode): ComponentSpec {
  return {
    name: node.name,
    props: extractProps(node),
    styles: extractStyles(node),
    variants: extractVariants(node),
  };
}

function extractProps(node: ComponentNode): ComponentProp[] {
  const props: ComponentProp[] = [];
  
  // Extract from component properties
  if (node.componentPropertyDefinitions) {
    for (const [key, def] of Object.entries(node.componentPropertyDefinitions)) {
      props.push({
        name: key,
        type: def.type, // 'BOOLEAN', 'TEXT', 'INSTANCE_SWAP', etc.
        defaultValue: def.defaultValue,
      });
    }
  }
  
  return props;
}

function extractStyles(node: ComponentNode): ComponentStyle[] {
  return [
    {
      property: 'width',
      value: `${node.width}px`,
    },
    {
      property: 'height',
      value: `${node.height}px`,
    },
    {
      property: 'padding',
      value: extractPadding(node),
    },
    // ... extract other styles
  ];
}
```

### Component Skeleton Generation

```typescript
// tools/figma-sync/src/generators/component-generator.ts
import { ComponentSpec } from '../types';

export function generateComponentSkeleton(spec: ComponentSpec): string {
  return `// Auto-generated from Figma - Component: ${spec.name}
// Last synced: ${new Date().toISOString()}

import { tokens } from '../../theme';

export interface ${spec.name}Props {
  ${generatePropsInterface(spec.props)}
}

export function ${spec.name}({ ${generatePropsParams(spec.props)} }: ${spec.name}Props) {
  return (
    <div className={styles.container}>
      {/* TODO: Implement component based on Figma spec */}
      {/* Styles: ${JSON.stringify(spec.styles, null, 2)} */}
    </div>
  );
}
`;
}

function generatePropsInterface(props: ComponentProp[]): string {
  return props.map(prop => {
    const type = mapFigmaTypeToTS(prop.type);
    return `${prop.name}?: ${type};`;
  }).join('\n  ');
}
```

---

## Automated Workflow

### GitHub Actions Workflow

```yaml
# .github/workflows/figma-sync.yml
name: Sync Figma Designs

on:
  schedule:
    # Run daily at 9 AM UTC
    - cron: '0 9 * * *'
  workflow_dispatch:  # Allow manual trigger
  push:
    paths:
      - '.github/workflows/figma-sync.yml'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Sync Figma tokens
        env:
          FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
          FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
        run: pnpm --filter figma-sync sync
      
      - name: Check for changes
        id: changes
        run: |
          if [ -n "$(git status --porcelain)" ]; then
            echo "has_changes=true" >> $GITHUB_OUTPUT
          else
            echo "has_changes=false" >> $GITHUB_OUTPUT
          fi
      
      - name: Create Pull Request
        if: steps.changes.outputs.has_changes == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'chore: sync design tokens from Figma'
          title: '🎨 Sync Design Tokens from Figma'
          body: |
            ## Design Token Sync
            
            This PR automatically syncs design tokens from Figma.
            
            ### Changes:
            - Design tokens updated
            - Component specs updated (if any)
            
            ### Review Checklist:
            - [ ] Review token changes
            - [ ] Verify components still work
            - [ ] Run visual regression tests
            - [ ] Merge if approved
          branch: chore/figma-sync
          labels: |
            automated
            design
            dependencies
```

### Manual Sync

```bash
# Sync tokens
pnpm --filter figma-sync sync:tokens

# Sync components
pnpm --filter figma-sync sync:components

# Sync everything
pnpm --filter figma-sync sync
```

---

## Visual Regression Testing

### Setup Chromatic

```bash
cd packages/ui
pnpm add -D chromatic @chromatic-com/storybook
```

### Configure Storybook

```typescript
// packages/ui/.storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@chromatic-com/storybook', // Add Chromatic
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

### Visual Test Workflow

```yaml
# .github/workflows/visual-tests.yml
name: Visual Regression Tests

on:
  pull_request:
    paths:
      - 'packages/ui/**'

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build Storybook
        run: pnpm --filter ui build-storybook
      
      - name: Run Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: build-storybook
          workingDir: packages/ui
```

### Component Visual Tests

```typescript
// packages/ui/src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Click me',
  },
};

// Visual regression tests run automatically on Chromatic
```

---

## Migration from Old Designs

### Step 1: Audit Current Design System

```bash
# List all current design tokens
grep -r "color\|spacing\|font" packages/ui/src/theme/

# List all components
find packages/ui/src/components -name "*.tsx" -type f
```

### Step 2: Map Old to New

Create mapping file:

```typescript
// tools/figma-sync/src/migrations/map-old-to-new.ts
export const tokenMapping = {
  // Old token → New Figma token
  'color.primary': 'Primary/500',
  'color.secondary': 'Secondary/500',
  'spacing.small': 'Spacing/SM',
  'spacing.medium': 'Spacing/MD',
  // ...
};
```

### Step 3: Migrate Components

```typescript
// Migration script
async function migrateComponent(oldComponent: Component) {
  // 1. Extract old token usage
  const oldTokens = extractTokens(oldComponent);
  
  // 2. Map to new tokens
  const newTokens = mapTokens(oldTokens, tokenMapping);
  
  // 3. Update component
  updateComponent(oldComponent, newTokens);
  
  // 4. Run tests
  await runTests(oldComponent);
}
```

### Step 4: Verify Migration

```bash
# Run visual regression tests
pnpm test:visual

# Compare old vs new
# Should show no visual differences
```

---

## Best Practices

### For Designers

1. **Use Variables**: Always use Figma variables, not hardcoded values
2. **Consistent Naming**: Follow naming convention (Category/Value)
3. **Component Organization**: Keep components organized in Figma
4. **Document Changes**: Comment on significant design changes

### For Developers

1. **Don't Edit Generated Files**: Never manually edit `tokens.ts` if it's auto-generated
2. **Review PRs**: Always review Figma sync PRs carefully
3. **Run Tests**: Run visual regression tests after merging Figma sync PRs
4. **Communicate**: Let designers know if design changes break functionality

### For Both

1. **Sync Regularly**: Set up daily sync schedule
2. **Test Changes**: Test design changes in staging before production
3. **Version Control**: Keep design files versioned
4. **Documentation**: Document design system changes

---

## Troubleshooting

### Issue: Tokens Not Syncing

**Solution**:
- Check Figma token permissions
- Verify file key is correct
- Check Figma API rate limits

### Issue: Generated Code Has Errors

**Solution**:
- Review token extraction logic
- Check Figma variable naming
- Manually fix and report issue

### Issue: Visual Tests Fail

**Solution**:
- Review design changes
- Check if changes are intentional
- Update baseline if needed

---

**Document Maintained By**: Design & Engineering Team  
**Last Updated**: November 2025  
**Related Documents**: 
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

