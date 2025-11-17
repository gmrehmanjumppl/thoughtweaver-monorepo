# Thoughtweaver - AI-Powered Ideation and Creative Thinking Platform

## Phase 1 Development Proposal

---

## Executive Summary

**Product Name:** Thoughtweaver

**Document Date:** November 11, 2025

**Document Status:** Phase 1 Development Proposal

### Product Vision

Thoughtweaver empowers individuals and teams to unlock their creative potential through AI-powered ideation, structured workflows, and multi-perspective thinking. Users engage with multiple AI assistants simultaneously, each offering unique perspectives, to enhance problem-solving, brainstorming, and decision-making.

### Proposal Overview

**Timeline:** 3 Months (November 2025 - January 2026)  
**Team:** 2 Developers  
**Goal:** Build a market-ready product with core value proposition

This proposal outlines the development of Phase 1, transforming Thoughtweaver into a fully functional, production-ready application with real AI integration, user authentication, billing, and administrative capabilities.

---

## Development Timeline

### Month 1: Foundation & Core Infrastructure
**Weeks 1-4**

- Backend infrastructure setup (database, API)
- User authentication system (Google/Apple OAuth)
- Database design and implementation
- AI integration framework
- Basic conversation system

**Deliverable:** Users can sign in, create conversations, and receive real AI responses

### Month 2: Core Features & Integration
**Weeks 5-8**

- Complete workflow system with step execution
- Assistant management (default + custom)
- Context management system
- File attachment functionality
- Prompt improvement feature
- Model selection and switching

**Deliverable:** All core features functional with real AI integration

### Month 3: Billing, Admin & Production Readiness
**Weeks 9-12**

- Stripe billing integration
- Usage tracking and limits
- Admin portal development
- Testing and quality assurance
- Performance optimization
- Security and compliance (GDPR)
- Final refinements

**Deliverable:** Production-ready application ready for launch

---

## PART 1: AUTHENTICATION & USER MANAGEMENT

### Authentication System

**Phase 1 Deliverables:**
- ✅ OAuth authentication with Google and Apple
- ✅ User profile management with persistent data
- ✅ Secure session management with refresh tokens
- ✅ Account settings page
- ✅ Password reset flow

### User Management

- ✅ User registration and onboarding
- ✅ Profile management (name, email, avatar)
- ✅ User preferences and settings
- ✅ Account deletion with data removal

### Mail Server & Cadence Setup

- ✅ Email service integration for notifications
- ✅ Automated email cadence for user engagement
- ✅ Transactional emails (welcome, password reset, billing)

---

## PART 2: CORE PRODUCT FEATURES

### 2.1 AI Conversations & Workflow System

**Conversation Interface:**
- ✅ Real-time AI conversations with multiple assistants
- ✅ Multi-turn conversation flow
- ✅ Message history and persistence
- ✅ Conversation library with search and filter
- ✅ Conversation renaming and deletion
- ✅ Export conversations to Markdown
- ✅ Editable conversation titles

**Workflow Management:**
- ✅ 8-10 preset workflows for structured ideation
- ✅ Workflow selection at conversation start
- ✅ Linear workflow execution (AI follows steps sequentially)
- ✅ Workflow progress indicator
- ✅ Custom workflow builder with drag-and-drop
- ✅ Workflow step configuration
- ✅ Workflow templates
- ✅ Workflow recommendation sidebar with AI problem detection

### 2.2 Assistant System

**Core Assistant Features:**
- ✅ Library of default assistants with unique personalities
- ✅ Multi-assistant selection for conversations
- ✅ Real AI responses using assistant-specific system prompts
- ✅ Assistant personality profiles (OCEAN model)
- ✅ Personality visualization with radar charts
- ✅ Assistant identification in responses
- ✅ Change assistants mid-conversation

**Custom Assistant Creation:**
- ✅ Assistant creator interface
- ✅ Assistant editor for modifications
- ✅ AI-generated system prompts based on name, description, and industry
- ✅ Personality configuration with sliders
- ✅ Color and avatar customization
- ✅ Save custom assistants to database
- ✅ Delete custom assistants (default assistants cannot be deleted)
- ✅ Custom assistants visible only to creator

### 2.3 Context Management

**Context System:**
- ✅ System-wide context selection (applied to all interactions)
- ✅ User-created contexts
- ✅ System-inferred context extraction
- ✅ Context selection and change at any time
- ✅ Context passed to AI with each message
- ✅ Mixed human/system context with clear visibility
- ✅ Both user-created and system-inferred contexts are editable

**Context Builder:**
- ✅ Visual context builder interface
- ✅ Context templates
- ✅ Context editing and management
- ✅ Context diff view (show what changed)

### 2.4 LLM Management

**Model Selection & Configuration:**
- ✅ Support for 7 AI models:
    - GPT-5
    - GPT-5 mini
    - Claude Sonnet 4.5
    - Claude Haiku 4.5
    - Gemini 2.5 Pro
    - Gemini 2.5 Flash
    - Grok-4
- ✅ Single model selection per conversation
- ✅ Per-message model selection (choose different model for each prompt)
- ✅ Model switching mid-conversation
- ✅ Model configuration page
- ✅ Model displayed in conversation UI
- ✅ Secure API key management
- ✅ Rate limiting per model

**Response Management:**
- ✅ Regenerate response button
- ✅ Basic response quality feedback (like/dislike)
- ✅ Store feedback for future insights

### 2.5 Prompt & Input Features

**Prompt Features:**
- ✅ Text input for conversations
- ✅ Range of preset/example prompts
- ✅ Example prompts modal
- ✅ "Build my own prompt" template
- ✅ AI-Powered "Improve my prompt" feature

**Input Methods:**
- ✅ Text input (primary method)
- ✅ File attachment support (PDF, TXT, DOCX)
- ✅ File upload to storage
- ✅ Text content extraction from files
- ✅ Files included in conversation context

### 2.6 Self-Improving System

**AI & Prompts:**
- ✅ AI-powered prompt improvement
- ✅ AI-generated assistant system prompts
- ✅ Context-aware prompt suggestions

**AI as a Judge:**
- ✅ Built-in evaluation system for AI outputs
- ✅ LLM self-judging with human escalation
- ✅ Quality gates and approval workflows
- ✅ Response quality feedback collection

**Product Improvement:**
- ✅ Usage analytics for product insights
- ✅ User behavior tracking
- ✅ Feature usage metrics
- ✅ Data collection for continuous improvement

### 2.7 User Experience

**Navigation & Layout:**
- ✅ Intuitive navigation system
- ✅ Pages: Home, Conversations, Workflows, Assistants, Preferences, Account, Billing, Select LLMs
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Conversation history in sidebar

**Visual Design:**
- ✅ Consistent design system
- ✅ Loading states for all async operations
- ✅ Comprehensive error handling with user-friendly messages
- ✅ Loading spinners for AI responses
- ✅ Accessibility features (keyboard navigation, ARIA labels)

---

## PART 3: BILLING & METERED BILLING

### Stripe Integration

**Phase 1 Deliverables:**
- ✅ Stripe payment processing integration
- ✅ Subscription management
- ✅ Payment webhook handling
- ✅ Billing page with real transaction history
- ✅ Invoice generation and management

### Subscription Tiers

**Free Tier:**
- 10 conversations per month
- 100 messages per month
- Maximum 3 AI assistants

**Pro Tier ($29/month):**
- Metered billing by credits
- Unlimited assistants
- Ability to purchase top-up credits
- Unlimited conversations and messages

### Usage Tracking & Limits

- ✅ Real-time usage tracking:
    - Conversation count
    - Message count
    - Token usage per LLM
    - Cost tracking
- ✅ Usage limits enforcement
- ✅ Usage dashboard for users
- ✅ Billing alerts and notifications

### Credits & Metering

- ✅ Credit-based billing system
- ✅ Metering based on various platforms (tokens, API calls)
- ✅ Credit purchase and top-up
- ✅ Credit balance display
- ✅ Usage history and reports

---

## PART 4: ADMIN PORTAL

### Admin Authentication & Roles

**Phase 1 Deliverables:**
- ✅ Admin authentication system
- ✅ Role-based access control (Admin, TW Team, Beta, User)
- ✅ Superuser access for global configuration
- ✅ Instance-based separation for future enterprise features

### User & Account Management

**User Management:**
- ✅ View all user accounts (name, email, role, status, last active)
- ✅ Add new user accounts
- ✅ Disable/enable user accounts
- ✅ Assign user roles
- ✅ Delete user accounts (with confirmation)

**Billing Management:**
- ✅ Billing management features not in Stripe
- ✅ Manual billing adjustments
- ✅ Subscription management
- ✅ Usage monitoring per user

### Assistant & Workflow Management

**Assistant Management:**
- ✅ Add new assistants with basic configuration
- ✅ Edit existing assistant details (prompt, personality, default model, avatar)
- ✅ Enable/disable assistant status toggle
- ✅ Delete assistants (with confirmation)

**Workflow Management:**
- ✅ Add new workflows with step-by-step builder
- ✅ Edit workflow configuration
- ✅ Enable/disable workflows
- ✅ Delete workflows (with confirmation)

### LLM Spend Tracking

**Basic Spend Analytics:**
- ✅ Total spend to date (single aggregated number)
- ✅ Spend by model (breakdown table)
- ✅ Today's spend (current day total)
- ✅ Manual cost entry/adjustment capability
- ✅ Easy export/access to spend data for external manipulation

### Reports & Analytics

**Instance Reports:**
- ✅ System health monitoring
- ✅ User activity reports
- ✅ Usage statistics
- ✅ Performance metrics
- ✅ Instance-based reporting for enterprise separation

### External Data Management

- ✅ Export all or selected data (via database and DB Admin role)
- ✅ Import all or selected data (via database and DB Admin role)
- ✅ Data synchronization capabilities

---

## PART 5: DEVELOPMENT & QUALITY ASSURANCE

### Development Approach

**Component-Based Architecture:**
- ✅ Modular, reusable component structure
- ✅ Dependency injection or alternatives
- ✅ Clear component organization
- ✅ Shared component library

**Development Workflow:**
- ✅ CI/CD pipeline setup
- ✅ Automated deployment workflows
- ✅ Version control with GitHub
- ✅ Code review process
- ✅ Development environment setup

### Testing & Quality

**Test-Driven Development (TDD) Methodology:**
- ✅ TDD approach: Write tests first, then implement functionality (Red-Green-Refactor cycle)
- ✅ TDD framework implementation (Jest, Vitest, or similar)
- ✅ Test coverage requirement: Minimum 80% for core business logic
- ✅ TDD applied to all new features and bug fixes
- ✅ Tests written before implementation for:
    - API endpoints and services
    - Business logic and utilities
    - Component functionality
    - AI integration layers

**Testing Strategy by Layer:**

**Unit Tests:**
- ✅ All core business logic and utilities
- ✅ Service layer functions
- ✅ Helper functions and utilities
- ✅ Component logic (React components)
- ✅ Mocks and dependency injection for isolated testing
- ✅ Test coverage: 80%+ for critical paths

**Integration Tests:**
- ✅ API endpoint testing (NestJS controllers)
- ✅ Database operations and queries
- ✅ External service integrations (Stripe, Supabase)
- ✅ Authentication and authorization flows
- ✅ File upload and processing

**End-to-End (E2E) Tests:**
- ✅ Critical user flows:
    - User registration and login
    - Conversation creation and messaging
    - Workflow execution
    - Assistant creation
    - Billing and subscription
- ✅ Admin portal workflows
- ✅ Cross-browser testing for major flows

**AI-Specific Testing:**
- ✅ AI response validation and quality checks
- ✅ LLM integration testing with mocks
- ✅ Prompt template testing
- ✅ Assistant system prompt validation
- ✅ Context injection testing
- ✅ Built-in evals system for AI outputs
- ✅ LLM self-judging with human escalation

**Automated Testing:**
- ✅ Automated test suite execution in CI/CD
- ✅ Pre-commit hooks for test execution
- ✅ Test coverage reporting and tracking
- ✅ Test result notifications
- ✅ Parallel test execution for faster feedback

**Quality Assurance:**
- ✅ Quality gates: Tests must pass before merge
- ✅ Code coverage gates (minimum thresholds)
- ✅ Performance testing for critical paths
- ✅ Security testing and vulnerability scanning
- ✅ Manual testing for UX and edge cases
- ✅ Regression testing before releases

**Testing Tools & Frameworks:**
- ✅ Backend: Jest/Vitest for NestJS
- ✅ Frontend: Vitest/React Testing Library for Next.js
- ✅ E2E: Playwright or Cypress
- ✅ Mocking: MSW (Mock Service Worker) for API mocking
- ✅ Coverage: Istanbul/NYC for coverage reports
- ✅ AI Testing: Custom evals framework for LLM outputs

### Version Control & Rollback

- ✅ GitHub integration
- ✅ Commit proposal system
- ✅ Versioning for:
    - Workflows
    - Assistants
    - Prompts
    - System configuration
- ✅ Rollback procedures
- ✅ Change history and audit trail

---

## PART 6: SECURITY & COMPLIANCE

### Security

- ✅ SSL/TLS encryption
- ✅ OAuth via Google and Apple
- ✅ Secure API key storage
- ✅ Row Level Security (RLS) policies
- ✅ Data encryption at rest and in transit

### GDPR Compliance

- ✅ Data portability features
- ✅ Right to deletion (account and data removal)
- ✅ Privacy controls
- ✅ Data export for compliance
- ✅ User consent management
- ✅ Privacy policy integration

---

## Technical Stack

**Backend:**
- NestJS API framework
- Supabase (PostgreSQL database, Auth, Storage)
- Vercel AI SDK for LLM integration

**Frontend:**
- Next.js (migrated from React prototype)
- Tailwind CSS v4.0
- Shadcn/ui components

**Services:**
- Stripe for payments
- Supabase for database and authentication
- Multiple AI providers (OpenAI, Anthropic, Google, xAI)

**Development:**
- TypeScript
- Test-driven development
- CI/CD pipeline
- GitHub for version control

---

## Success Criteria

By the end of Phase 1, the application will enable users to:

1. Sign up and log in securely with Google or Apple
2. Start real AI conversations with multiple assistants
3. Use workflows to structure their ideation process
4. Create and customize their own assistants
5. Manage context to improve AI responses
6. Upload files (PDF, DOCX, TXT) for AI to reference
7. Subscribe to Pro tier and manage billing
8. Export and manage their conversations
9. Administrators can manage users, assistants, workflows, and track spending

---

## Assumptions & Dependencies

### Client Responsibilities

- Provide API keys for AI providers (OpenAI, Anthropic, Google, xAI)
- Set up Supabase account and provide access
- Set up Stripe account and provide access
- Review and approve features during development
- Provide feedback within 48 hours for critical decisions

### External Dependencies

- AI provider API availability and rate limits
- Supabase service availability
- Stripe service availability

---

## Next Steps

1. **Review & Approval** - Client reviews this proposal
2. **Kickoff Meeting** - Align on priorities and communication
3. **Environment Setup** - Configure development environments
4. **Sprint Planning** - Begin Month 1 development

---

**Prepared by:** Development Team  
**Date:** November 11, 2025  
**Version:** 2.0
