# Quick Reference Guide
## Common Commands & Patterns

**Version:** 2.0.0  
**Last Updated:** November 2025

---

## Common Commands

### Development

```bash
# Start all services
pnpm dev

# Start specific service
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter ui dev

# Build all packages
pnpm build

# Build specific package
pnpm --filter ui build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Figma Sync

```bash
# Sync design tokens
pnpm --filter figma-sync sync:tokens

# Sync components
pnpm --filter figma-sync sync:components

# Sync everything
pnpm --filter figma-sync sync
```

### Database

```bash
# Run migrations
pnpm --filter database migrate:dev

# Generate Prisma client
pnpm --filter database generate

# Reset database
pnpm --filter database reset
```

---

## Common Patterns

### Creating a New Component

```typescript
// packages/ui/src/components/NewComponent/NewComponent.tsx
import { tokens } from '../../theme';

export interface NewComponentProps {
  title: string;
}

export function NewComponent({ title }: NewComponentProps) {
  return <div>{title}</div>;
}
```

### Creating a New API Endpoint

```typescript
// services/api/src/feature/feature.controller.ts
@Controller('api/feature')
export class FeatureController {
  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
```

### Using React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@thoughtweaver/api-client';

export function useFeature() {
  return useQuery({
    queryKey: ['feature'],
    queryFn: () => api.feature.findAll(),
  });
}
```

### Adding a New Page

```typescript
// apps/web/src/app/(main)/new-page/page.tsx
import { PageLayout } from '@thoughtweaver/ui';

export default function NewPage() {
  return (
    <PageLayout>
      <h1>New Page</h1>
    </PageLayout>
  );
}
```

---

## Environment Variables

### Required Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Figma
FIGMA_TOKEN=
FIGMA_FILE_KEY=

# API
API_URL=http://localhost:4000

# Database
DATABASE_URL=
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git commit -m "feat: add new feature"

# Push branch
git push origin feature/new-feature

# Create PR on GitHub
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Clear Cache

```bash
# Clear pnpm cache
pnpm store prune

# Clear build cache
pnpm clean
```

### Reset Dependencies

```bash
# Remove node_modules
rm -rf node_modules **/node_modules

# Reinstall
pnpm install
```

---

**Last Updated**: November 2025

