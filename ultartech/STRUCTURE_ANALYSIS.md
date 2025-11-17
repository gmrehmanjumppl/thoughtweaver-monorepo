# Thoughtweaver Monorepo Structure Analysis
## Compliance with PRD Requirements & Developer Guide

**Date:** November 2025  
**Status:** Analysis & Recommendations

---

## Executive Summary

Your monorepo structure is **80% compliant** with the requirements. The foundation is solid, but some reorganization is needed to achieve full modularity and reusability for multi-platform support.

**Key Finding:** Code is currently app-specific (`apps/webnextjs`) rather than shared packages. For future platforms (mobile, desktop, etc.), you need to extract shared logic into packages.

---

## ✅ What's Working Well

### 1. Monorepo Foundation
- ✅ Turborepo setup with PNPM workspaces
- ✅ Proper workspace configuration (`pnpm-workspace.yaml`)
- ✅ Shared packages structure (`packages/*`)

### 2. Shared Packages (Good)
- ✅ `packages/types` - Centralized type definitions
- ✅ `packages/ui` - Shared UI component library
- ✅ `packages/config` - Configuration package (exists but underutilized)
- ✅ `packages/utils` - Utility functions
- ✅ Workspace dependencies (`@thoughtweaver/types`, `@thoughtweaver/ui`)

### 3. Code Organization Patterns
- ✅ Centralized exports (`contexts/index.tsx`, `hooks/index.ts`)
- ✅ Constants organization (`constants/index.ts`)
- ✅ Type definitions follow developer guide patterns

---

## ❌ What Needs Improvement

### 1. **Constants Location** (High Priority)

**Current:** `apps/webnextjs/constants/`  
**Should Be:** `packages/config/src/constants.ts` or `packages/shared/src/constants.ts`

**Issue:** Constants are app-specific, but should be shared across platforms.

**Developer Guide Says:**
```tsx
import { DEFAULT_LLM, WORKFLOWS, PAGES } from '../constants';
```

**Current Implementation:**
```tsx
import { AVAILABLE_LLM_MODELS } from '../../constants'; // ❌ Relative path
```

**Fix:** Move constants to `packages/config` and import via:
```tsx
import { DEFAULT_LLM, WORKFLOWS, PAGES } from '@thoughtweaver/config';
```

---

### 2. **Hooks Location** (High Priority)

**Current:** `apps/webnextjs/hooks/`  
**Should Be:** `packages/shared/src/hooks/` or `packages/hooks/`

**Issue:** Hooks are React-specific but business logic should be reusable.

**Developer Guide Pattern:**
```tsx
import { useNavigate, useConversation } from '../hooks';
```

**Current Implementation:**
```tsx
// ✅ Good - centralized export
export { useNavigate } from './useNavigate';
```

**Fix:** Create `packages/shared/src/hooks/` and move hooks there:
```tsx
import { useNavigate, useConversation } from '@thoughtweaver/shared/hooks';
```

**Note:** Some hooks might be Next.js-specific (like `useNavigate` with Next.js router). These can stay in `apps/webnextjs/hooks/`, but business logic hooks should be shared.

---

### 3. **Contexts Location** (High Priority)

**Current:** `apps/webnextjs/contexts/`  
**Should Be:** `packages/shared/src/contexts/` or `packages/contexts/`

**Issue:** Contexts contain business logic that should be reusable.

**Developer Guide Pattern:**
```tsx
import { useAuth, useNavigation } from '../contexts';
```

**Current Implementation:**
```tsx
// ✅ Good - centralized export
export { useAuth } from './AuthContext';
```

**Fix:** Create `packages/shared/src/contexts/` and move contexts there:
```tsx
import { useAuth, useNavigation } from '@thoughtweaver/shared/contexts';
```

**Note:** Some contexts might be framework-specific. Extract business logic to shared package, keep framework-specific wrappers in apps.

---

### 4. **Import Paths** (Medium Priority)

**Current:** Relative imports (`../../constants`, `../../hooks`)  
**Should Be:** Package imports (`@thoughtweaver/config`, `@thoughtweaver/shared`)

**Issue:** Relative paths break when code moves or is reused.

**Current:**
```tsx
import { AVAILABLE_LLM_MODELS } from '../../constants';
import { useAuth } from '../../contexts';
```

**Should Be:**
```tsx
import { AVAILABLE_LLM_MODELS } from '@thoughtweaver/config';
import { useAuth } from '@thoughtweaver/shared/contexts';
```

---

### 5. **Types Duplication** (Medium Priority)

**Current:** Types exist in both `packages/types` and `apps/webnextjs/types/`  
**Should Be:** All types in `packages/types`

**Issue:** Duplication causes type drift and maintenance issues.

**Fix:** Consolidate all types into `packages/types/src/index.ts` and remove `apps/webnextjs/types/`.

---

### 6. **Missing Shared Business Logic Package** (High Priority)

**Current:** Business logic mixed into app code  
**Should Be:** `packages/shared/` for reusable business logic

**What Should Be Shared:**
- API client utilities
- Business logic hooks (conversation management, assistant selection)
- Validation functions
- Constants
- Helper functions

**What Can Stay App-Specific:**
- Next.js routing hooks
- Next.js-specific components
- Framework-specific wrappers

---

## 📋 Recommended Structure

### Proposed Package Organization

```
packages/
├── types/              ✅ Already good
│   └── src/
│       └── index.ts
│
├── ui/                 ✅ Already good
│   └── src/
│       ├── components/
│       └── index.ts
│
├── config/             ⚠️ Needs expansion
│   └── src/
│       ├── constants.ts      ← Move from apps/webnextjs/constants
│       ├── defaults.ts
│       └── index.ts
│
├── shared/             ❌ NEEDS CREATION
│   └── src/
│       ├── hooks/           ← Move from apps/webnextjs/hooks
│       │   ├── useConversation.ts
│       │   ├── useAssistantSelection.ts
│       │   └── index.ts
│       ├── contexts/        ← Move from apps/webnextjs/contexts
│       │   ├── AuthContext.tsx
│       │   ├── ConversationContext.tsx
│       │   └── index.tsx
│       ├── api/             ← Move from apps/webnextjs/lib/api
│       │   ├── api-client.ts
│       │   ├── conversations.api.ts
│       │   └── index.ts
│       └── index.ts
│
├── utils/              ✅ Already good
│   └── src/
│       └── index.ts
│
└── sdk/                ✅ Already exists
    └── src/
        └── index.ts
```

---

## 🔧 Migration Plan

### Phase 1: Create Shared Package (Week 1)

1. **Create `packages/shared/`**
   ```bash
   mkdir -p packages/shared/src/{hooks,contexts,api}
   ```

2. **Move Constants**
   - Move `apps/webnextjs/constants/` → `packages/config/src/constants.ts`
   - Update `packages/config/package.json` exports
   - Update imports in `apps/webnextjs`

3. **Move Hooks**
   - Move business logic hooks → `packages/shared/src/hooks/`
   - Keep Next.js-specific hooks in `apps/webnextjs/hooks/`
   - Update exports

### Phase 2: Move Contexts & API (Week 1-2)

4. **Move Contexts**
   - Extract business logic from contexts
   - Move to `packages/shared/src/contexts/`
   - Create Next.js wrappers in `apps/webnextjs/contexts/` if needed

5. **Move API Client**
   - Move `apps/webnextjs/lib/api/` → `packages/shared/src/api/`
   - Make API client framework-agnostic
   - Update imports

### Phase 3: Update Imports (Week 2)

6. **Update All Imports**
   - Replace relative imports with package imports
   - Update `tsconfig.json` paths if needed
   - Test build

### Phase 4: Consolidate Types (Week 2)

7. **Consolidate Types**
   - Move all types from `apps/webnextjs/types/` → `packages/types/`
   - Remove duplicate type definitions
   - Update imports

---

## 📊 Compliance Checklist

| Requirement | Status | Notes |
|------------|--------|-------|
| Monorepo structure | ✅ | Turborepo + PNPM workspaces |
| Shared types package | ✅ | `packages/types` exists |
| Shared UI package | ✅ | `packages/ui` exists |
| Shared constants | ⚠️ | Need to move to `packages/config` |
| Shared hooks | ❌ | Need to create `packages/shared/hooks` |
| Shared contexts | ❌ | Need to create `packages/shared/contexts` |
| Shared API client | ❌ | Need to move to `packages/shared/api` |
| Package imports | ⚠️ | Some relative imports still exist |
| Type consolidation | ⚠️ | Types duplicated in app |
| Multi-platform ready | ⚠️ | Structure supports it, but code not extracted |

---

## 🎯 Priority Actions

### Immediate (This Week)
1. ✅ Create `packages/shared/` structure
2. ✅ Move constants to `packages/config`
3. ✅ Update imports to use `@thoughtweaver/config`

### Short Term (Next 2 Weeks)
4. ✅ Move hooks to `packages/shared/hooks`
5. ✅ Move contexts to `packages/shared/contexts`
6. ✅ Move API client to `packages/shared/api`
7. ✅ Consolidate types

### Long Term (Next Month)
8. ✅ Extract all business logic to shared packages
9. ✅ Create framework-specific wrappers in apps
10. ✅ Document package boundaries

---

## 💡 Key Principles for Multi-Platform Support

### 1. **Package Boundaries**
- **Shared Packages:** Framework-agnostic business logic
- **App Packages:** Framework-specific implementations

### 2. **Import Strategy**
```tsx
// ✅ Good - Package imports
import { useAuth } from '@thoughtweaver/shared/contexts';
import { DEFAULT_LLM } from '@thoughtweaver/config';
import { Button } from '@thoughtweaver/ui';

// ❌ Bad - Relative imports
import { useAuth } from '../../contexts';
import { DEFAULT_LLM } from '../../constants';
```

### 3. **What Goes Where**

**`packages/shared/`** (Business Logic):
- Hooks (business logic)
- Contexts (state management)
- API clients
- Validation functions
- Business rules

**`packages/config/`** (Configuration):
- Constants
- Defaults
- Configuration values
- Feature flags

**`packages/ui/`** (UI Components):
- Reusable UI components
- Design system components
- Layout components

**`packages/types/`** (Type Definitions):
- All TypeScript types
- API types
- Domain types

**`apps/webnextjs/`** (Next.js App):
- Next.js-specific components
- Next.js routing
- Next.js middleware
- App-specific pages

---

## 📝 Example: Before vs After

### Before (Current)
```tsx
// apps/webnextjs/components/home/HomePage.tsx
import { AVAILABLE_LLM_MODELS } from '../../constants';
import { useAuth, useNavigation } from '../../contexts';
import { useConversation } from '../../hooks';
```

### After (Recommended)
```tsx
// apps/webnextjs/components/home/HomePage.tsx
import { AVAILABLE_LLM_MODELS } from '@thoughtweaver/config';
import { useAuth, useNavigation } from '@thoughtweaver/shared/contexts';
import { useConversation } from '@thoughtweaver/shared/hooks';
```

---

## ✅ Conclusion

Your monorepo structure is **good** but needs **reorganization** for true modularity. The main issues are:

1. **Code is app-specific** instead of shared packages
2. **Relative imports** instead of package imports
3. **Missing shared package** for business logic

**Recommendation:** Follow the migration plan above to achieve full compliance with the developer guide and enable multi-platform support.

**Estimated Effort:** 1-2 weeks for full migration

---

**Last Updated:** November 2025  
**Next Review:** After migration completion

