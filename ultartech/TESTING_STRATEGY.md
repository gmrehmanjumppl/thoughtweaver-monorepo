# Testing Strategy
## Comprehensive Testing Guide for Thoughtweaver

**Version:** 2.0.0  
**Last Updated:** November 2025

---

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Pyramid](#testing-pyramid)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [E2E Testing](#e2e-testing)
6. [Visual Regression Testing](#visual-regression-testing)
7. [Performance Testing](#performance-testing)
8. [AI Output Testing](#ai-output-testing)
9. [Code Review Bot](#code-review-bot)
10. [CI/CD Testing](#cicd-testing)

---

## Testing Philosophy

### Principles

1. **Test Coverage**: Aim for 80%+ code coverage
2. **Test Everything**: Test UI, API, utilities, and integrations
3. **Test Early**: Write tests alongside code
4. **Test Fast**: Unit tests should run in seconds
5. **Test Reliable**: Tests should be deterministic and stable
6. **Test Maintainable**: Tests should be easy to understand and update

### Testing Goals

- **Prevent Regressions**: Catch bugs before they reach production
- **Document Behavior**: Tests serve as documentation
- **Enable Refactoring**: Confident code changes
- **Improve Quality**: Higher code quality overall

---

## Testing Pyramid

```
        /\
       /E2E\         10% - End-to-End Tests
      /------\
     /INTEGRATION\   20% - Integration Tests
    /------------\
   /    UNIT      \  70% - Unit Tests
  /----------------\
```

### Distribution

- **Unit Tests (70%)**: Fast, isolated, test individual functions/components
- **Integration Tests (20%)**: Test module interactions, API endpoints
- **E2E Tests (10%)**: Test critical user flows end-to-end

---

## Unit Testing

### Framework: Vitest

**Why Vitest?**
- Fast (powered by Vite)
- Compatible with Jest API
- Great TypeScript support
- Excellent watch mode

### Setup

```bash
cd packages/ui
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**`packages/ui/vitest.config.ts`**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.stories.tsx',
        '**/*.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**`packages/ui/src/test/setup.ts`**:
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

### Component Testing

```typescript
// packages/ui/src/components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByText('Click'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    const { container } = render(<Button variant="primary">Click</Button>);
    expect(container.firstChild).toHaveClass('button--primary');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Hook Testing

```typescript
// packages/ui/src/hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Utility Testing

```typescript
// packages/utils/src/date.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime } from './date';

describe('date utilities', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-11-03T10:00:00Z');
    expect(formatDate(date)).toBe('Nov 3, 2025');
  });

  it('formats relative time correctly', () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
  });
});
```

### Running Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test Button.test.tsx

# Run tests matching pattern
pnpm test --grep "Button"
```

---

## Integration Testing

### API Integration Tests

**Framework**: Jest + Supertest

```typescript
// services/api/test/conversations.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConversationsService } from '../src/conversations/conversations.service';

describe('Conversations API (Integration)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/conversations', () => {
    it('should create a conversation', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/conversations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Conversation',
          prompt: 'Test prompt',
          selectedAssistants: ['all-rounder'],
          selectedLLM: 'gpt-5-mini',
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Test Conversation');
    });

    it('should validate required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/conversations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/conversations/:id', () => {
    it('should return conversation by id', async () => {
      // Create conversation first
      const createResponse = await request(app.getHttpServer())
        .post('/api/conversations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test',
          prompt: 'Test',
          selectedAssistants: ['all-rounder'],
          selectedLLM: 'gpt-5-mini',
        });

      const conversationId = createResponse.body.data.id;

      // Get conversation
      const response = await request(app.getHttpServer())
        .get(`/api/conversations/${conversationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(conversationId);
    });

    it('should return 404 for non-existent conversation', async () => {
      await request(app.getHttpServer())
        .get('/api/conversations/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
```

### Database Integration Tests

```typescript
// services/api/test/database.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../src/conversations/entities/conversation.entity';
import { ConversationsService } from '../src/conversations/conversations.service';

describe('ConversationsService (Integration)', () => {
  let service: ConversationsService;
  let repository: Repository<Conversation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: getRepositoryToken(Conversation),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
    repository = module.get<Repository<Conversation>>(
      getRepositoryToken(Conversation),
    );
  });

  it('should create conversation in database', async () => {
    const dto = {
      title: 'Test',
      prompt: 'Test prompt',
      userId: 'user-123',
      selectedAssistants: ['all-rounder'],
      selectedLLM: 'gpt-5-mini',
    };

    const conversation = await service.create(dto);

    expect(conversation).toBeDefined();
    expect(conversation.id).toBeDefined();
    expect(conversation.title).toBe(dto.title);

    // Verify in database
    const saved = await repository.findOne({ where: { id: conversation.id } });
    expect(saved).toBeDefined();
  });
});
```

---

## E2E Testing

### Framework: Playwright

**Why Playwright?**
- Cross-browser testing (Chromium, Firefox, WebKit)
- Auto-waiting and retries
- Network interception
- Mobile device emulation

### Setup

```bash
cd apps/web
pnpm add -D @playwright/test
pnpm exec playwright install
```

**`apps/web/playwright.config.ts`**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// apps/web/e2e/conversation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Conversation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/');
  });

  test('user can create a conversation', async ({ page }) => {
    await page.goto('/');
    
    // Fill prompt
    await page.fill('[data-testid="prompt-input"]', 'How to build a startup?');
    
    // Select assistant
    await page.click('[data-testid="assistant-all-rounder"]');
    
    // Start conversation
    await page.click('[data-testid="start-weaving-button"]');
    
    // Wait for conversation to load
    await expect(page.locator('[data-testid="conversation-title"]'))
      .toBeVisible({ timeout: 10000 });
    
    // Verify conversation was created
    await expect(page.locator('[data-testid="conversation-view"]'))
      .toBeVisible();
  });

  test('user can send a message in conversation', async ({ page }) => {
    // Create conversation first
    await page.goto('/');
    await page.fill('[data-testid="prompt-input"]', 'Test prompt');
    await page.click('[data-testid="start-weaving-button"]');
    await page.waitForURL(/\/conversations\/.+/);
    
    // Send message
    await page.fill('[data-testid="message-input"]', 'Follow-up question');
    await page.click('[data-testid="send-message-button"]');
    
    // Wait for response
    await expect(page.locator('[data-testid="assistant-message"]').last())
      .toBeVisible({ timeout: 30000 });
  });

  test('user can switch assistants mid-conversation', async ({ page }) => {
    // Create conversation
    await page.goto('/');
    await page.fill('[data-testid="prompt-input"]', 'Test');
    await page.click('[data-testid="start-weaving-button"]');
    await page.waitForURL(/\/conversations\/.+/);
    
    // Switch assistant
    await page.click('[data-testid="assistant-selector"]');
    await page.click('[data-testid="assistant-creative"]');
    
    // Verify assistant changed
    await expect(page.locator('[data-testid="active-assistant-creative"]'))
      .toBeVisible();
  });
});
```

### Running E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run tests in UI mode
pnpm test:e2e:ui

# Run specific test file
pnpm test:e2e conversation.spec.ts

# Run tests in headed mode
pnpm test:e2e --headed

# Generate HTML report
pnpm test:e2e --reporter=html
```

---

## Visual Regression Testing

### Framework: Chromatic / Percy

**Setup Chromatic**:

```bash
cd packages/ui
pnpm add -D chromatic @chromatic-com/storybook
```

**`packages/ui/.storybook/main.ts`**:
```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

### Visual Test Examples

```typescript
// packages/ui/src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
  parameters: {
    chromatic: { viewports: [320, 768, 1024] },
  },
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

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button variant="primary">Default</Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button variant="primary" loading>Loading</Button>
    </div>
  ),
};
```

### Running Visual Tests

```bash
# Build Storybook
pnpm build-storybook

# Publish to Chromatic
pnpm chromatic --project-token=your-token

# Or via npm script
pnpm chromatic
```

---

## Performance Testing

### Lighthouse CI

```bash
pnpm add -D @lhci/cli
```

**`lighthouserc.js`**:
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### Load Testing

**Framework**: k6

```javascript
// load-tests/conversation-load.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const response = http.post('http://localhost:4000/api/conversations', JSON.stringify({
    title: 'Load Test',
    prompt: 'Test prompt',
    selectedAssistants: ['all-rounder'],
    selectedLLM: 'gpt-5-mini',
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token',
    },
  });

  check(response, {
    'status is 201': (r) => r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

---

## AI Output Testing

### LLM Output Evaluation

```typescript
// services/api/test/llm-output.eval.ts
import { LLMService } from '../src/llm/llm.service';
import { evaluateResponse } from '../src/llm/evaluator';

describe('LLM Output Evaluation', () => {
  let llmService: LLMService;

  beforeEach(() => {
    llmService = new LLMService(/* ... */);
  });

  it('should generate relevant responses', async () => {
    const prompt = 'What is the capital of France?';
    const response = await llmService.generateResponse({
      model: 'gpt-5-mini',
      prompt,
      systemPrompt: 'You are a helpful assistant.',
    });

    const evaluation = await evaluateResponse({
      prompt,
      response,
      criteria: ['relevance', 'accuracy', 'completeness'],
    });

    expect(evaluation.relevance).toBeGreaterThan(0.8);
    expect(evaluation.accuracy).toBeGreaterThan(0.9);
  });

  it('should handle edge cases', async () => {
    const prompt = ''; // Empty prompt
    const response = await llmService.generateResponse({
      model: 'gpt-5-mini',
      prompt,
      systemPrompt: 'You are a helpful assistant.',
    });

    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
  });
});
```

### Automated Quality Checks

```typescript
// services/api/src/llm/quality-checker.ts
export class QualityChecker {
  async checkResponse(response: string, prompt: string): Promise<QualityCheck> {
    const checks = {
      length: response.length > 10,
      relevance: await this.checkRelevance(response, prompt),
      toxicity: await this.checkToxicity(response),
      coherence: await this.checkCoherence(response),
    };

    return {
      passed: Object.values(checks).every(check => check === true),
      checks,
    };
  }

  private async checkRelevance(response: string, prompt: string): Promise<boolean> {
    // Use LLM to check relevance
    // Return true if relevant
    return true;
  }

  private async checkToxicity(response: string): Promise<boolean> {
    // Use toxicity detection API
    // Return false if toxic
    return true;
  }
}
```

---

## Code Review Bot

### Custom CodeRabbit-like Bot

**`tools/code-review/src/reviewer.ts`**:
```typescript
import { GitHub } from '@actions/github';
import { analyzeCode, checkSecurity, checkPerformance } from './analyzers';

export class CodeReviewer {
  async reviewPR(prNumber: number, repo: string, owner: string) {
    const github = new GitHub(process.env.GITHUB_TOKEN!);
    
    // Get PR diff
    const { data: diff } = await github.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });
    
    const issues: ReviewIssue[] = [];
    
    // Security check
    const securityIssues = await checkSecurity(diff);
    issues.push(...securityIssues);
    
    // Performance check
    const performanceIssues = await checkPerformance(diff);
    issues.push(...performanceIssues);
    
    // Code quality check
    const qualityIssues = await analyzeCode(diff);
    issues.push(...qualityIssues);
    
    // Post review comments
    for (const issue of issues) {
      await github.pulls.createReviewComment({
        owner,
        repo,
        pull_number: prNumber,
        body: issue.message,
        path: issue.file,
        line: issue.line,
        side: 'RIGHT',
      });
    }
    
    // Post overall review
    const reviewState = issues.length > 0 ? 'CHANGES_REQUESTED' : 'APPROVE';
    await github.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      body: `Found ${issues.length} issues`,
      event: reviewState,
    });
  }
}
```

---

## CI/CD Testing

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:unit
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: thoughtweaver_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm exec playwright install
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm --filter ui build-storybook
      - uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          workingDir: packages/ui
```

---

## Test Coverage Goals

### Coverage Targets

- **Overall**: 80%+
- **Critical Paths**: 95%+
- **UI Components**: 85%+
- **API Endpoints**: 90%+
- **Utilities**: 95%+

### Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# View HTML report
open coverage/index.html
```

---

## Best Practices

1. **Write Tests First**: TDD when possible
2. **Test Behavior**: Test what components do, not implementation
3. **Keep Tests Simple**: One assertion per test when possible
4. **Use Descriptive Names**: Test names should describe behavior
5. **Mock External Dependencies**: Don't rely on external services
6. **Clean Up**: Reset state between tests
7. **Run Tests Often**: Run tests during development
8. **Review Test Failures**: Fix tests, don't delete them

---

**Document Maintained By**: Testing Team  
**Last Updated**: November 2025  
**Related Documents**: 
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

