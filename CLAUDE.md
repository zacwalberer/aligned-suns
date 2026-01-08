# Project Rules

## Core Principle
Always ask for confirmation before making major changes. This includes:
- New features or functionality
- Architectural decisions
- Database schema changes
- Adding new dependencies
- Refactoring existing code
- Changes affecting multiple files

## Tech Stack
- **Framework**: Next.js (latest stable, App Router)
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS (utility classes only, no custom CSS)
- **Deployment**: Vercel

---

## Code Style

### TypeScript (Strict Mode)
- Full type safety end-to-end
- Zero `any` types - no exceptions
- Always define explicit types for function parameters and return values
- Prefer interfaces over type aliases for object shapes
- Named exports over default exports
- Functional components + hooks only (no class components)

### React/Next.js
- Use Server Components by default, Client Components only when needed
- Keep components small and focused
- Named exports only

---

## Design System

### Component-Only Architecture
Use primitive components for all UI:
- `Button` - all clickable actions
- `Card` - content containers
- `Input` - form fields
- Build complex UI by composing these primitives

### Spacing Scale (strictly enforced)
Only use these values:
- `4px` (p-1, m-1, gap-1)
- `8px` (p-2, m-2, gap-2)
- `12px` (p-3, m-3, gap-3)
- `16px` (p-4, m-4, gap-4)
- `20px` (p-5, m-5, gap-5)
- `24px` (p-6, m-6, gap-6)
- `32px` (p-8, m-8, gap-8)

No arbitrary spacing values like `p-[13px]` or `mt-[22px]`.

### Colors
- Use predefined Tailwind color palette only
- No arbitrary hex values (`bg-[#FF5733]` is forbidden)
- Define custom colors in `tailwind.config.ts` if needed, not inline

### Utility Naming Conventions
- Prefer semantic class grouping: layout → spacing → typography → colors → effects
- Example: `flex items-center gap-4 text-sm text-gray-700`

---

## What NOT To Do (Anti-Patterns)

### Forbidden Design Patterns
- **No gradients** - use flat, solid colors
- **No neumorphism** - no soft UI / embossed effects
- **No glassmorphism** - no frosted glass / blur backgrounds
- **No pseudo-depth effects** - no excessive shadows to fake 3D
- **No over-rounded corners** - use `rounded`, `rounded-md`, or `rounded-lg` max
- **No unnecessary micro-interactions** - animations must serve a purpose
- **No arbitrary spacing** - stick to the spacing scale above
- **No generic icon abuse** - don't sprinkle Heroicons everywhere for decoration

### Forbidden Code Patterns
- No custom CSS files (use Tailwind utilities only)
- No `any` types
- No default exports
- No class components
- No inline styles (`style={{ }}`)

---

## Development Approach
- Understand the request fully before writing code
- Propose an approach and wait for approval on non-trivial changes
- Keep changes focused and minimal
- Don't add unrequested features

## What I Can Do Without Asking
- Bug fixes with obvious solutions
- Typo corrections
- Reading files to understand the codebase
- Running tests, linting, or type checking
- Small, isolated changes explicitly requested
