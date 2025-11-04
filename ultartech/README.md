# Ultartech Documentation
## Complete Technical Documentation for Thoughtweaver Monorepo

**Version:** 2.0.0  
**Last Updated:** November 2025

---

## Overview

This folder contains comprehensive technical documentation for migrating Thoughtweaver from a React prototype to a production-ready Next.js + NestJS monorepo architecture.

---

## Documentation Structure

### 📐 [ARCHITECTURE.md](./ARCHITECTURE.md)
**Complete architecture documentation**

- Monorepo structure and organization
- Technology stack and rationale
- Application architecture (Frontend & Backend)
- Modular UI system design
- Database schema
- API design patterns
- Deployment architecture

**Use this when**: Understanding the overall system design, planning new features, onboarding new developers.

---

### 🚀 [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
**Step-by-step developer guide**

- Prerequisites and setup instructions
- Initial project setup
- Development workflow
- Common tasks and patterns
- Troubleshooting guide

**Use this when**: Setting up development environment, learning how to work with the codebase, solving common issues.

---

### 🎨 [FIGMA_INTEGRATION.md](./FIGMA_INTEGRATION.md)
**Figma design-to-code sync strategy**

- Figma setup and organization
- Automated design token extraction
- Component spec extraction
- Visual regression testing
- Migration from old designs

**Use this when**: Setting up Figma sync, handling design updates, ensuring design consistency.

**Note**: Figma to Production sync workflow is now included in [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) (Phase 8).

### 📋 [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md)
**Final Architecture Recommendations**

- Architecture comparison and recommendations
- Repository strategy (two repos vs monorepo)
- Key decisions and rationale
- Implementation plan
- Industry standards alignment

**Use this when**: Starting the project, need to understand which architecture to implement, making key decisions about structure.

---

### 🧪 [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
**Comprehensive testing guide**

- Testing philosophy and pyramid
- Unit testing (Vitest)
- Integration testing (Jest)
- E2E testing (Playwright)
- Visual regression testing (Chromatic)
- Performance testing
- AI output testing
- Code review bot setup

**Use this when**: Writing tests, setting up CI/CD, ensuring code quality.

---

### 🔄 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
**Step-by-step migration guide**

- Migration strategy and phases
- Monorepo setup
- Component extraction
- Next.js migration
- Backend API setup
- Database migration
- Integration steps
- Testing and deployment

**Use this when**: Migrating from current React app to new monorepo, planning migration timeline.

---

### 🔑 [LLM_API_KEY_GUIDE.md](./LLM_API_KEY_GUIDE.md)
**LLM API Key Strategy**

- Individual API keys vs Vercel AI SDK comparison
- Recommended approach for Thoughtweaver
- Unified adapter pattern implementation
- Cost tracking strategy
- Security best practices

**Use this when**: Setting up LLM integrations, deciding between API keys and SDKs, implementing cost tracking.

---

## Quick Start

### For New Developers

1. **Start here**: Read [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for setup instructions
2. **Understand architecture**: Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
3. **Set up environment**: Follow Step 1-5 in Developer Guide
4. **Start coding**: Follow development workflow patterns

### For Designers

1. **Read**: [FIGMA_INTEGRATION.md](./FIGMA_INTEGRATION.md) to understand design sync process
2. **Set up**: Follow Figma setup instructions
3. **Design**: Use Figma variables and consistent naming
4. **Sync**: Design changes will automatically sync to code

### For Project Managers

1. **Migration timeline**: See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for timeline estimates
2. **Architecture overview**: Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. **Testing strategy**: Review [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) for quality assurance

---

## Documentation Principles

### Keep It Updated

- Update docs when architecture changes
- Update docs when adding new features
- Update docs when changing processes

### Write Clearly

- Use clear, concise language
- Include code examples
- Provide step-by-step instructions
- Add troubleshooting sections

### Be Comprehensive

- Cover all aspects of development
- Include edge cases
- Provide migration paths
- Document best practices

---

## Key Concepts

### Monorepo Structure

```
thoughtweaver-monorepo/
├── apps/           # Applications (web, mobile, admin)
├── packages/       # Shared packages (ui, types, utils)
├── services/       # Backend services (api, worker)
└── tools/          # Development tools (figma-sync, scripts)
```

### Modular UI System

- **Single source of truth**: All UI components in `packages/ui`
- **Design tokens**: Automatically synced from Figma
- **Platform agnostic**: Components work on web and mobile
- **Type-safe**: Full TypeScript support

### Testing Strategy

- **70% Unit Tests**: Fast, isolated component/function tests
- **20% Integration Tests**: API endpoint and module interaction tests
- **10% E2E Tests**: Critical user flow tests

### Design Sync

- **Automated**: Design tokens sync daily from Figma
- **Visual Regression**: Components tested against designs
- **Version Controlled**: Design changes tracked in Git

---

## Related Documents

### External Documentation

- **Product Requirements**: `../src/PRD.md`
- **Current Architecture**: `../src/Architecture.md`
- **Developer Guide (Current)**: `../src/DEVELOPER_GUIDE.md`

### Internal Documentation

- **Code Comments**: Inline documentation in code
- **API Documentation**: Auto-generated from OpenAPI specs
- **Component Documentation**: Storybook stories

---

## Contributing

### Adding New Documentation

1. Create new `.md` file in `ultartech/` folder
2. Follow existing documentation style
3. Include table of contents
4. Add to this README
5. Update related documents

### Updating Existing Documentation

1. Update relevant section
2. Update "Last Updated" date
3. Update version if major changes
4. Notify team of changes

---

## Support

### Questions?

- **Architecture questions**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Setup issues**: See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) troubleshooting section
- **Design sync issues**: See [FIGMA_INTEGRATION.md](./FIGMA_INTEGRATION.md)
- **Testing questions**: See [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)

### Reporting Issues

- Create GitHub issue
- Tag with `documentation` label
- Include link to relevant doc section

---

## Version History

- **v2.0.0** (November 2025): Initial monorepo architecture documentation
  - Complete architecture guide
  - Step-by-step developer guide
  - Figma integration strategy
  - Comprehensive testing strategy
  - Migration guide (includes Figma sync)
  - Architecture recommendations (final decisions)

---

**Maintained By**: Architecture & Engineering Team  
**Last Updated**: November 2025

