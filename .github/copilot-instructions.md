# Copilot Instructions for Instagram Minimal

## Architecture Overview

This is an Instagram-like social media app built with **Vite + React + TypeScript**. The stack combines:
- **Frontend**: React 18 with React Router for page navigation
- **Styling**: Tailwind CSS + shadcn-ui (Radix UI primitives)
- **State**: Zustand for global UI/auth state + React Query for server data
- **Backend**: Supabase (primary) + Firebase (secondary)
- **Animations**: Framer Motion for UI interactions

### Key Data Flows
1. **Authentication**: `useAuth()` hook → `authStore` (Zustand) → `supabase.auth`
2. **Pages**: App Router defines routes in [src/App.tsx](src/App.tsx), wrapped by `AppLayout` containing header/navigation
3. **Components**: Feature-grouped in [src/components/](src/components/) → pages import and compose them
4. **UI Components**: Pre-built shadcn components in [src/components/ui/](src/components/ui/) (auto-generated, regenerate via `npx shadcn-ui@latest add`)

## Critical Patterns

### State Management
- **Zustand stores** ([src/stores/](src/stores/)): `authStore` (user/session/loading), `useUIStore` (theme/modals)
- **Access pattern**: `const { user, session } = useAuthStore()` - stores are not components
- **React Query**: Used implicitly; QueryClient initialized in [src/App.tsx](src/App.tsx) line 16

### Authentication Flow
- `useAuth()` hook ([src/hooks/useAuth.ts](src/hooks/useAuth.ts)) sets up Supabase listeners on mount
- Auth state persists via `localStorage` (configured in [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts))
- Protected routes: Check `loading` then `user` from `authStore` before rendering

### Component Composition
- **Atomic structure**: `components/ui/` (primitive), `components/[feature]/` (domain-specific)
- **Props pattern**: Components receive typed props + handlers; see `PostCard` signature at [src/components/feed/PostCard.tsx](src/components/feed/PostCard.tsx#L11)
- **Icons**: `lucide-react` library (e.g., `<Heart />`, `<MoreHorizontal />`)

### UI/UX Conventions
- **Dark mode default**: `useUIStore.theme` starts as `'dark'` 
- **Animations**: Framer Motion for micro-interactions (e.g., like heart animation in PostCard)
- **Modals**: Use shadcn `Dialog` primitives from [src/components/ui/dialog.tsx](src/components/ui/dialog.tsx)
- **Notifications**: Sonner + shadcn toasts (both initialized in App.tsx)

## Developer Workflows

### Setup & Dev
```bash
npm install          # Install deps (using Bun lockfile)
npm run dev          # Start Vite dev server on :8080
npm run build        # Production build
npm run lint         # ESLint check
```

### Import Paths
- Use `@/` alias (configured in [tsconfig.json](tsconfig.json#L4)) instead of relative paths
- Example: `import { PostCard } from '@/components/feed/PostCard'`

### Adding New UI Components
- Components from shadcn: `npx shadcn-ui@latest add [component-name]`
- Regenerates code in [src/components/ui/](src/components/ui/)

## Project-Specific Conventions

### Type Definitions
- Core types in [src/types/index.ts](src/types/index.ts): `UserProfile`, `Post`, `MediaItem`, `Reel`
- Don't duplicate type definitions; extend existing interfaces

### Feature Organization
- **Pages**: [src/pages/](src/pages/) - one per route (Home, Profile, Messages, etc.)
- **Layouts**: [src/components/layout/](src/components/layout/) - AppLayout wraps authenticated routes
- **Services**: [src/integrations/](src/integrations/) - Supabase client setup

### Supabase Integration
- Client imported via `import { supabase } from '@/integrations/supabase/client'`
- Types auto-generated in [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts)
- Uses env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

### TypeScript Config
- Loose checking enabled: `noImplicitAny: false`, `strictNullChecks: false`, `noUnusedLocals: false`
- Allows rapid prototyping but add proper types for critical flows

## Common Tasks

**Add a new page**: Create file in [src/pages/](src/pages/), export component, add Route in [src/App.tsx](src/App.tsx)

**Add a feature component**: Create folder in [src/components/](src/components/), use shadcn UI primitives, accept typed props

**State across pages**: Add to appropriate Zustand store, access via hook (e.g., `useUIStore()`)

**API calls**: Use Supabase client directly or wrap in React Query hooks

**Styling**: Tailwind classes only; theme variables defined via Tailwind config
