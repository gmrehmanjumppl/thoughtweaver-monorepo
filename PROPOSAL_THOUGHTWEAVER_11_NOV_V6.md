# Thoughtweaver - Phase 1 Development Proposal

**Document Date:** November 11, 2025  
**Timeline Assessment:** 3-4 Months (2 Developers + AI Assistance)  
**Status:** Proposal with Timeline Analysis

---

## Executive Summary

**Product Vision:** Thoughtweaver empowers individuals to unlock creative potential through AI-powered ideation, structured workflows, and multi-perspective thinking with multiple AI assistants.

**Goal:** Transform prototype into a market-ready product with real AI integration, authentication, billing, and administrative capabilities.

**Timeline Assessment:** With AI assistance, this project is feasible in 3-4 months. A 4-month timeline provides better quality and risk mitigation.

---

## Timeline Analysis

### Complexity Assessment

**High Complexity Areas:**
- Multi-LLM integration (7 different providers with varying APIs)
- Multi-assistant conversation orchestration
- Workflow execution engine with step-by-step AI coordination
- Metered billing system with credit management
- AI-powered features (prompt improvement, evals system, self-judging)
- File processing and text extraction (PDF, DOCX, TXT)

**Moderate Complexity:**
- Admin portal with comprehensive entity management
- Context management system
- Stripe integration with webhooks
- TDD implementation with 80% coverage

**Standard Complexity:**
- Authentication and user management
- Database design and RLS policies
- Basic CRUD operations
- UI components and responsive design

### Recommended Timeline Options

#### Option 1: Aggressive Timeline (3 Months)
**Feasibility:** Possible with AI assistance, but high risk

**Pros:**
- Faster time to market
- Lower cost

**Cons:**
- Limited buffer for unexpected issues
- May compromise on testing coverage
- Higher stress on team
- Less time for refinement

**Risk Level:** High - Requires everything to go perfectly

#### Option 2: Realistic Timeline (4 Months) ⭐ **RECOMMENDED**
**Feasibility:** Realistic with AI assistance

**Pros:**
- Adequate time for quality implementation
- Proper testing and bug fixing
- Time for refinements and polish
- Lower risk of delays
- Better work-life balance

**Cons:**
- Slightly longer timeline
- Slightly higher cost

**Risk Level:** Low-Medium - Provides buffer for issues

---

## Recommended Development Timeline (4 Months)

### Month 1: Foundation & Core Infrastructure
**Weeks 1-4**

**Week 1-2: Setup & Authentication**
- Project setup and architecture
- Database design and migration
- Supabase configuration
- OAuth authentication (Google/Apple)
- User profile management
- Session management

**Week 3-4: Data Layer & Basic AI**
- Complete data models implementation
- RLS policies setup
- API service layer
- Basic AI integration (1-2 models initially)
- File storage setup
- Email service integration

**Deliverable:** Users can sign in, basic database operations working, one AI model integrated

---

### Month 2: Core Features Development
**Weeks 5-8**

**Week 5-6: Conversations & Assistants**
- Conversation system with persistence
- Multi-assistant selection and responses
- Assistant personality system
- Custom assistant creation
- LLM integration for remaining models (5-6 models)
- Message storage and retrieval

**Week 7-8: Workflows & Context**
- Workflow execution engine
- 8-10 preset workflows
- Custom workflow builder
- Context management system
- Context builder interface
- Workflow recommendations

**Deliverable:** Core conversation features working, workflows functional, context system operational

---

### Month 3: Advanced Features & Billing
**Weeks 9-12**

**Week 9-10: File Processing & Advanced Features**
- File upload and processing (PDF, DOCX, TXT)
- Text extraction from files
- AI-powered prompt improvement
- Self-improving system (evals, self-judging)
- Model switching and per-message selection

**Week 11-12: Billing Integration**
- Stripe integration setup
- Subscription management
- Usage tracking system
- Credit-based billing
- Usage limits enforcement
- Billing dashboard

**Deliverable:** All core product features complete, billing system operational

---

### Month 4: Admin Portal, Testing & Production
**Weeks 13-16**

**Week 13-14: Admin Portal**
- Admin authentication and roles
- Entity management (assistants, workflows, prompts, users)
- Observability dashboard
- LLM spend tracking
- External data import/export
- LLM model management

**Week 15: Testing & Quality Assurance**
- Complete TDD test suite
- Integration testing
- E2E testing for critical flows
- Performance testing
- Security testing
- Bug fixes and refinements

**Week 16: Production Readiness**
- Final testing and bug fixes
- Performance optimization
- Security hardening
- Documentation
- Deployment preparation
- Final polish and refinements

**Deliverable:** Production-ready application

---

## Detailed Work Breakdown

### Authentication & User Management (2 weeks)
- OAuth setup: 3 days
- User profiles: 2 days
- Session management: 2 days
- Account settings: 2 days
- Password reset: 1 day
- Email service: 2 days

### Data & Storage (1.5 weeks)
- Database design: 2 days
- Migrations: 2 days
- RLS policies: 2 days
- API service layer: 3 days
- File storage: 1 day

### AI Integration (3 weeks)
- Vercel AI SDK setup: 1 day
- Model 1-2 (GPT-5, GPT-5 mini): 3 days
- Model 3-4 (Claude models): 3 days
- Model 5-6 (Gemini models): 3 days
- Model 7 (Grok-4): 2 days
- Rate limiting and error handling: 2 days
- Testing and refinement: 3 days

### Conversations System (2 weeks)
- Conversation CRUD: 3 days
- Message storage: 2 days
- Multi-assistant orchestration: 4 days
- Conversation UI integration: 3 days

### Assistant System (2 weeks)
- Default assistants setup: 2 days
- Custom assistant creation: 3 days
- Personality system: 2 days
- AI-generated prompts: 2 days
- Assistant UI: 3 days

### Workflow System (2.5 weeks)
- Workflow execution engine: 5 days
- Preset workflows: 3 days
- Custom workflow builder: 4 days
- Workflow recommendations: 2 days

### Context Management (1.5 weeks)
- Context system design: 2 days
- Context builder: 3 days
- System-inferred context: 2 days
- Context diff view: 2 days

### File Processing (1 week)
- File upload: 2 days
- Text extraction: 3 days
- Integration: 2 days

### Billing System (2 weeks)
- Stripe setup: 2 days
- Subscription management: 3 days
- Usage tracking: 3 days
- Credit system: 2 days
- Billing dashboard: 2 days

### Admin Portal (2 weeks)
- Admin auth and roles: 2 days
- Entity management: 4 days
- Observability dashboard: 2 days
- Spend tracking: 2 days
- Import/export: 2 days

### Testing (2 weeks)
- Unit tests: 4 days
- Integration tests: 3 days
- E2E tests: 3 days
- AI testing: 2 days

### Production Readiness (1 week)
- Performance optimization: 2 days
- Security review: 2 days
- Documentation: 1 day
- Final polish: 2 days

**Total Estimated Time:** ~16 weeks (4 months)

---

## AI Assistance Impact

**With AI Assistance, we can:**
- Generate boilerplate code faster (30-40% time savings)
- Write tests more efficiently (20-30% time savings)
- Debug and fix issues faster (25-35% time savings)
- Generate documentation automatically
- Code review assistance

**Estimated Time Savings:** 25-30% overall

**Without AI:** 5-6 months  
**With AI:** 3-4 months (realistic)

---

## Risk Factors & Mitigation

### High-Risk Areas

1. **Multi-LLM Integration Complexity**
   - Risk: Different API formats, rate limits, error handling
   - Mitigation: Start with 2-3 models, expand gradually

2. **Workflow Execution Engine**
   - Risk: Complex state management, error handling
   - Mitigation: Build incrementally, extensive testing

3. **Metered Billing System**
   - Risk: Complex credit calculations, edge cases
   - Mitigation: Use Stripe's metered billing features, thorough testing

4. **TDD with 80% Coverage**
   - Risk: Time-consuming, may slow development
   - Mitigation: AI-assisted test generation, focus on critical paths first

### Mitigation Strategies

- Parallel development where possible
- Incremental feature delivery
- Weekly progress reviews
- Early integration testing
- Buffer time in each phase

---

## Timeline Comparison

| Aspect | 3 Months | 4 Months |
|--------|----------|----------|
| **Feasibility** | Possible but tight | Realistic |
| **Quality** | May be compromised | High quality |
| **Testing Coverage** | 60-70% | 80%+ |
| **Risk Level** | High | Low-Medium |
| **Team Stress** | High | Moderate |
| **Buffer for Issues** | Minimal | Adequate |
| **Refinement Time** | Limited | Sufficient |

---

## Recommendation

**Recommended Timeline: 4 Months**

While 3 months is technically possible with AI assistance, a 4-month timeline provides:
- Better code quality
- Comprehensive testing
- Time for refinements
- Lower risk of delays
- Sustainable development pace

**Alternative: 3.5 Months** (compromise option)
- Can work if some features are simplified
- Requires clear prioritization
- Higher risk but faster delivery

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
**Version:** 6.0 (Timeline Assessment)

