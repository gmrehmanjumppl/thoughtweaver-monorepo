# Thoughtweaver - Phase 1 Development Proposal

**Document Date:** November 11, 2025  
**Timeline:** 3 Months (2 Developers)  
**Status:** Proposal

---

## Executive Summary

**Product Vision:** Thoughtweaver empowers individuals to unlock creative potential through AI-powered ideation, structured workflows, and multi-perspective thinking with multiple AI assistants.

**Goal:** Transform prototype into a market-ready product with real AI integration, authentication, billing, and administrative capabilities.

---

## Development Timeline

**Month 1:** Foundation & Infrastructure (Auth, Database, Basic AI Integration)  
**Month 2:** Core Features (Workflows, Assistants, Context, File Uploads)  
**Month 3:** Billing, Admin Portal, Testing & Production Readiness

---

## PART 1: AUTHENTICATION & USER MANAGEMENT

- Real OAuth authentication (Google/Apple) using Supabase Auth
- User profile management with persistent data
- Session management with refresh tokens
- Account settings page
- Password reset flow
- Email service integration for notifications and user engagement cadence

### Data & Storage

- PostgreSQL database via Supabase
- Core data models:
  - Users (profiles, preferences, settings)
  - Conversations (title, messages, context, workflow, assistants)
  - Workflows (name, steps, configuration, custom flag)
  - Assistants (personality, system prompts, custom flag)
  - Context (conversation-level, user-level)
  - Messages (content, role, assistant_id, metadata)
- Row Level Security (RLS) policies
- Data persistence layer (API service)
- File storage for avatars (Supabase Storage)

---

## PART 2: CORE PRODUCT FEATURES

### AI Conversations & Workflows

- Real-time AI conversations with multiple assistants
- Message history and persistence
- Conversation management (search, filter, rename, delete, export to Markdown)
- 8-10 preset workflows with linear step execution
- Workflow selection at conversation start
- Workflow progress indicator
- Custom workflow builder with drag-and-drop step ordering
- Workflow recommendations sidebar with AI problem detection

### Assistant System

- Library of default assistants with personality profiles (OCEAN model)
- Multi-assistant selection and mid-conversation switching
- Real AI responses using assistant-specific system prompts
- Personality visualization with radar charts
- Assistant identification in responses
- Custom assistant creation:
  - AI-generated system prompts (based on name, description, industry/domain)
  - Personality configuration with sliders
  - Color/avatar customization
  - Save, edit, and delete (default assistants cannot be deleted)
- Custom assistants visible only to creator

### Context Management

- System-wide context selection (applied to all interactions)
- User can add and edit contexts
- Context selection/change at any time
- Context passed to AI with each message
- System-inferred context extraction
- User-created and system-inferred contexts are separate and both editable
- Mixed human/system context with clear visibility
- Visual context builder with templates
- Context diff view (show what changed)

### LLM Management

- Support for 7 models: GPT-5, GPT-5 mini, Claude Sonnet 4.5, Claude Haiku 4.5, Gemini 2.5 Pro, Gemini 2.5 Flash, Grok-4
- Single model selection per conversation
- Per-message model selection (choose different model for each prompt)
- Model switching mid-conversation
- Model configuration page
- Model displayed in conversation UI
- Secure API key management (stored securely in Supabase)
- Rate limiting per model
- Regenerate response button
- Basic response quality feedback (like/dislike) stored for future insights

### Prompt & Input

- Text input (primary method)
- Range of preset/example prompts
- Example prompts modal
- "Build my own prompt" template
- AI-powered "Improve my prompt" feature
- File attachments (PDF, TXT, DOCX)
- Upload to Supabase Storage
- Extract text content from files
- Files included in conversation context

### Self-Improving System

- Built-in evals system for AI outputs
- LLM self-judging with human escalation
- Quality gates and approval workflows
- Usage analytics for product insights

---

## PART 3: BILLING & METERED BILLING

### Stripe Integration

- Payment processing and webhook handling
- Subscription management (Free and Pro tiers)
- Billing page with transaction history
- Invoice generation

### Subscription Tiers

- Free tier: 10 conversations/month, 100 messages/month, 3 AI assistants max
- Pro tier ($29/month): Metered by credits, unlimited assistants, ability to buy top-up credits

### Usage Tracking

- Conversation count
- Message count
- Token usage per LLM
- Cost tracking
- Usage limits enforcement
- Credit-based billing system
- Usage dashboard

---

## PART 4: ADMIN PORTAL

### Admin Authentication & Access

- Role-based access control (Admin, TW Team, Beta, User)
- Superuser access for global configuration
- Single-page web application interface
- Instance-based separation for future enterprise features

### Navigation & UX Essentials

- Single-page interface with tab navigation
- Loading states and error messages
- Confirmation dialogs for destructive actions

### Core Entity Management

**Superuser Access:**

**Assistant Management:**
- Superuser login to edit Assistants globally:
  - Add new assistant with basic configuration
  - Edit existing assistant details (inc prompt, personality, default model, avatar)
  - Enable/disable assistant status toggle
  - Delete assistant (with confirmation)

**Workflow Management:**
- Superuser login to edit Workflows globally:
  - Add new workflow with step-by-step builder
  - Edit workflow configuration
  - Enable/disable workflow
  - Delete workflow (with confirmation)

**External Data Import/Export:**
- Export all or selected data (done via database and DB Admin role)
- Import all or selected data (done via database and DB Admin role)

**Single Page Web App:**

**User/Billing Account Management:**
- View all user accounts (name, email, role, status, last active)
- Anything for billing management that isn't in Stripe
- Add new user account
- Disable/enable user accounts
- Assign user roles (Admin, TW Team, Beta, User) - note: We may give Beta users early access to new features
- Delete user account (with confirmation)

### Basic Observability Dashboard

- System status overview:
  - Total active assistants, prompts, workflows
  - Active users count
  - System health indicator (all online/partial/offline)
- Service status indicators:
  - Show online/offline status for each assistant
  - Show online/offline status for each LLM model
  - Last heartbeat timestamp

### LLM Spend Tracking (Basic)

- Total spend to date (single aggregated number)
- Spend by model
- Today's spend (current day total)
- Manual cost entry/adjustment capability
- Easy export/access to spend data for external manipulation and display

### LLM Model Management

- View all configured LLM models
- Add new LLM model configuration
- Edit model parameters (temperature, max tokens, etc.)
- Enable/disable models
- Test model connection/availability
- Model usage statistics (requests, avg latency)

---

## PART 5: DEVELOPMENT & QUALITY

### Component-Based Architecture

- Modular, reusable component structure
- Dependency injection or alternatives
- Clear component organization
- Shared component library

### Testing & Quality

- Test-driven development framework
- Built-in evals system for AI outputs
- LLM self-judging with human escalation
- Quality gates and approval workflows
- Automated testing suite (unit, integration, E2E)

### Test-Driven Development (TDD)

**Methodology:**
- Write tests first (Red-Green-Refactor cycle)
- Minimum 80% test coverage for core business logic
- TDD applied to all features and bug fixes

**Testing Strategy:**
- Unit tests for business logic, services, components
- Integration tests for API endpoints, database, external services
- E2E tests for critical user flows
- AI testing with mocks, prompt validation, evals system

**Tools:**
- Backend: Jest/Vitest
- Frontend: Vitest/React Testing Library
- E2E: Playwright or Cypress
- Mocking: MSW
- AI Testing: Custom evals framework

**Quality Assurance:**
- Tests must pass before merge
- Coverage gates in CI/CD
- Performance and security testing
- Pre-commit hooks for test execution

### Version Control & Rollback

- GitHub integration
- Commit proposal system
- Versioning for:
  - Workflows
  - Assistants
  - Prompts
  - System configuration
- Rollback procedures
- Change history and audit trail

### Development Workflow

- CI/CD pipeline setup
- Automated deployment workflows

---

## PART 6: SECURITY & COMPLIANCE

- SSL/TLS encryption
- OAuth via Google and Apple
- Secure API key storage
- Row Level Security (RLS) policies
- GDPR compliance features:
  - Data portability
  - Right to deletion
  - Privacy controls
  - Ability to delete account and remove data
  - Data export for compliance

### User Experience

**Navigation & Layout:**
- Use existing navigation system
- Pages: Home, Conversations, Workflows, Assistants, Preferences, Account, Billing, Select LLMs
- Maintain responsive design
- Keep conversation history in sidebar

**Visual Design:**
- Maintain current design system
- Ensure loading states for all async operations
- Comprehensive error handling with user-friendly messages
- Loading spinners for AI responses

---

## Technical Stack

**Backend:** NestJS API, Supabase (PostgreSQL, Auth, Storage)  
**Frontend:** Next.js, Tailwind CSS v4.0, Shadcn/ui  
**AI:** Vercel AI SDK (multiple providers)  
**Payments:** Stripe  
**Testing:** Jest/Vitest, Playwright/Cypress, MSW  
**Development:** TypeScript, TDD, CI/CD, GitHub

---

## Success Criteria

**Users can:**
1. Sign in with Google/Apple
2. Start real AI conversations with multiple assistants
3. Use workflows to structure ideation
4. Create and customize assistants
5. Manage context to improve AI responses
6. Upload files for AI reference
7. Subscribe and manage billing
8. Export conversations

**Administrators can:**
1. Manage all core entities (assistants, prompts, workflows, users)
2. Export/import data for external editing
3. Monitor system health and service status
4. Track LLM spending and costs
5. Manage LLM models and configurations

---

## Assumptions & Dependencies

**Client Responsibilities:**
- Provide API keys for AI providers
- Set up Supabase and Stripe accounts
- Review and approve features (48-hour feedback for critical decisions)

**External Dependencies:**
- AI provider API availability
- Supabase and Stripe service availability

---

**Prepared by:** Development Team  
**Date:** November 11, 2025  
**Version:** 3.0

