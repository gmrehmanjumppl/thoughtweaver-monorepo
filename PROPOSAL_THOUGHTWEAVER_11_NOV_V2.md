# Thoughtweaver - AI-Powered Ideation and Creative Thinking Platform

## Phase 1 Development Proposal (v2)

---

## Executive Summary

**Product Name:** Thoughtweaver

**Document Date:** November 11, 2025

**Document Status:** Phase 1 Development Proposal (v2)

### Product Vision

Thoughtweaver empowers individuals and teams to unlock their creative potential through AI-powered ideation, structured workflows, and multi-perspective thinking. Users engage with multiple AI assistants simultaneously, each offering unique perspectives, to enhance problem-solving, brainstorming, and decision-making.

### Proposal Overview

**Timeline:** 3 Months (November 2025 - January 2026)  
**Team:** 2 Developers  
**Goal:** Build a market-ready product with core value proposition

This proposal outlines the development of Phase 1, transforming Thoughtweaver into a fully functional, production-ready application with real AI integration, user authentication, billing, and comprehensive administrative capabilities.

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
- Complete admin portal development
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

### Core Principle

**External-First Editing:** Primary data management through external tools (spreadsheets, databases, JSON/CSV files) with bidirectional sync to the admin interface.

### Admin Authentication & Access Control

**Phase 1 Deliverables:**
- ✅ Admin authentication system with role-based access
- ✅ Role-based access control (Admin, TW Team, Beta, User, Viewer)
- ✅ Superuser access for global configuration
- ✅ Instance-based separation for future enterprise features
- ✅ Secure admin login and session management

### 4.1 Core Entity Management

**Assistants Management:**
- ✅ View all assistants in table format (name, model, status, description)
- ✅ Add new assistant with basic configuration
- ✅ Edit existing assistant details (prompt, personality, default model, avatar)
- ✅ Enable/disable assistant status toggle
- ✅ Delete assistant (with confirmation)
- ✅ Bulk operations on assistants

**Prompts Management:**
- ✅ View all prompts in table format (name, category, content preview, used by)
- ✅ Add new prompt with template support
- ✅ Edit prompt content
- ✅ Delete prompt (with warning if in use)
- ✅ View which assistants use each prompt
- ✅ Prompt categorization and tagging

**Workflows Management:**
- ✅ View all workflows in table format (name, steps count, status)
- ✅ Add new workflow with step-by-step builder
- ✅ Edit workflow configuration
- ✅ Enable/disable workflow
- ✅ Delete workflow (with confirmation)
- ✅ Workflow usage statistics

### 4.2 External Data Sync (Core Feature)

**Export Functionality:**
- ✅ Download current data as JSON or CSV
- ✅ Individual entity exports (Assistants only, Prompts only, Workflows only, etc.)
- ✅ Full system export option
- ✅ Custom export filters and selections
- ✅ Scheduled exports

**Import Functionality:**
- ✅ Upload edited files to update system
- ✅ Support JSON and CSV formats
- ✅ Validation before import (schema check, required fields)
- ✅ Preview changes before applying
- ✅ Batch import capabilities
- ✅ Import error reporting

**Sync Management:**
- ✅ Sync status indicator (show last sync time and status)
- ✅ Manual sync trigger (button to force sync from external source)
- ✅ Conflict resolution (basic last-write-wins strategy with timestamp)
- ✅ Sync history and logs
- ✅ Automated sync scheduling

### 4.3 User & Billing Account Management

**User Management:**
- ✅ View all user accounts (name, email, role, status, last active)
- ✅ Add new user account
- ✅ Disable/enable user accounts
- ✅ Assign user roles (Admin, TW Team, Beta, User, Viewer)
- ✅ Delete user account (with confirmation)
- ✅ User activity tracking
- ✅ User search and filtering

**Billing Management:**
- ✅ Billing management features not in Stripe
- ✅ Manual billing adjustments
- ✅ Subscription management
- ✅ Usage monitoring per user
- ✅ Credit allocation and adjustments
- ✅ Billing history and reports

### 4.4 Basic Observability Dashboard

**System Status Overview:**
- ✅ Total active assistants, prompts, workflows
- ✅ Active users count
- ✅ System health indicator (all online/partial/offline)
- ✅ System uptime and availability metrics
- ✅ Recent system events and alerts

**Service Status Indicators:**
- ✅ Show online/offline status for each assistant
- ✅ Show online/offline status for each LLM model
- ✅ Last heartbeat timestamp
- ✅ Service response time monitoring
- ✅ Error rate tracking

**Real-time Monitoring:**
- ✅ Live system metrics dashboard
- ✅ Active conversation count
- ✅ Current API request rate
- ✅ System resource usage
- ✅ Alert notifications for critical issues

### 4.5 LLM Spend Tracking

**Basic Spend Analytics:**
- ✅ Total spend to date (single aggregated number)
- ✅ Spend by model (breakdown table)
- ✅ Today's spend (current day total)
- ✅ Manual cost entry/adjustment capability
- ✅ Easy export/access to spend data for external manipulation
- ✅ Spend trends and patterns

**Spend Management:**
- ✅ Cost per conversation tracking
- ✅ Cost per message tracking
- ✅ Model cost comparison
- ✅ Budget alerts and warnings
- ✅ Spend forecasting

### 4.6 LLM Model Management

**Model Configuration:**
- ✅ View all configured LLM models (name, provider, status, endpoints)
- ✅ Add new LLM model configuration
- ✅ Edit model parameters (temperature, max tokens, etc.)
- ✅ Enable/disable models
- ✅ Test model connection/availability
- ✅ Model usage statistics (requests, avg latency)
- ✅ Model performance metrics

**Model Monitoring:**
- ✅ Model health status
- ✅ API rate limit tracking
- ✅ Error rate per model
- ✅ Response time analytics
- ✅ Model availability alerts

### 4.7 Reports & Analytics

**Instance Reports:**
- ✅ System health monitoring
- ✅ User activity reports
- ✅ Usage statistics
- ✅ Performance metrics
- ✅ Instance-based reporting for enterprise separation
- ✅ Custom report generation

**Usage Analytics:**
- ✅ User engagement metrics
- ✅ Feature adoption rates
- ✅ Workflow usage statistics
- ✅ Assistant popularity metrics
- ✅ Conversation patterns and trends

### 4.8 Navigation & UX Essentials

**Interface Design:**
- ✅ Single-page interface with tab navigation
- ✅ Search/filter functionality within each section
- ✅ Responsive design (desktop-first, tablet-compatible)
- ✅ Loading states and error messages
- ✅ Confirmation dialogs for destructive actions
- ✅ Bulk action capabilities
- ✅ Keyboard shortcuts for power users

**User Experience:**
- ✅ Intuitive navigation structure
- ✅ Quick access to frequently used features
- ✅ Contextual help and tooltips
- ✅ Export/import progress indicators
- ✅ Real-time updates and notifications

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

Administrators will be able to:

1. Manage all core entities (assistants, prompts, workflows, users)
2. Export and import data for external editing
3. Monitor system health and service status
4. Track LLM spending and costs
5. Manage LLM models and configurations
6. View comprehensive reports and analytics
7. Perform bulk operations on entities
8. Resolve data sync conflicts

---

## Performance Targets

**Admin Portal:**
- Page load: < 2 seconds
- Search results: < 500ms
- Import validation: < 3 seconds for 1000 records
- Export generation: < 5 seconds for full dataset
- Sync completion: < 5 seconds for typical datasets
- Real-time updates: < 2 seconds

**Main Application:**
- Initial page load: < 3 seconds
- AI response time: < 10 seconds (model dependent)
- Conversation load: < 1 second
- File upload: < 5 seconds for typical files

---

## Assumptions & Dependencies

### Client Responsibilities

- Provide API keys for AI providers (OpenAI, Anthropic, Google, xAI)
- Set up Supabase account and provide access
- Set up Stripe account and provide access
- Review and approve features during development
- Provide feedback within 48 hours for critical decisions
- Provide external data formats for sync feature (if applicable)

### External Dependencies

- AI provider API availability and rate limits
- Supabase service availability
- Stripe service availability
- Email service provider availability

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

