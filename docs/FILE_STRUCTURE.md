# 📁 FitMySpace - File Structure

This structure follows engineering best practices, focusing on:

- **Atomic Design** for component organization
- **Accessibility** as a priority (WCAG AA)
- **Testability** with co-located tests
- **Scalability** for future growth

## Complete Structure

```
fitMySpace/
├── public/                           # Static files
│   ├── images/                       # Product images and assets
│   ├── fonts/                        # Custom fonts (if needed)
│   ├── mockServiceWorker.js          # MSW Worker
│   └── favicon.ico
│
├── docs/                             # Project Documentation
│   ├── FILE_STRUCTURE.md             # This file
│   ├── IMPLEMENTATION_SUMMARY.md     # Summary of implementation details
│   ├── REQUIREMENTS.md               # User requirements
│   └── ROADMAP.md                    # Project roadmap
│
├── src/                              # Main source code
│   │
│   ├── app/                          # Next.js 16 App Router
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Home page (main search page)
│   │   ├── loading.tsx               # Global loading UI
│   │   ├── error.tsx                 # Global error boundary (Next.js)
│   │   ├── not-found.tsx             # 404 page
│   │   ├── providers.tsx             # Providers (React Query, Error Boundary)
│   │   ├── globals.css               # TailwindCSS 4 @theme + global styles
│   │   │
│   │   ├── about/                    # About Page (SSG)
│   │   │   └── page.tsx
│   │   │
│   │   ├── recent/                   # Recent Arrivals (ISR)
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── products/                 # Product Details (SSR)
│   │       └── [id]/
│   │           ├── page.tsx
│   │           └── loading.tsx
│   │   │
│   │   └── api/                      # (Optional) API Routes if needed
│   │
│   ├── components/                   # Atomic Design Pattern
│   │   │
│   │   ├── atoms/                    # Primitive components (Radix UI base)
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Badge/
│   │   │   ├── Icon/
│   │   │   ├── Spinner/
│   │   │   ├── Skeleton/
│   │   │   └── SkipLink/             # Accessibility Skip Link
│   │   │
│   │   ├── molecules/                # Composite components
│   │   │   ├── SearchInput/          # Input + Button
│   │   │   ├── FilterSelect/         # Select + Label + Clear
│   │   │   ├── ProductBadge/         # Badge + Icon
│   │   │   ├── SkeletonCard/         # Skeleton for cards
│   │   │   └── EmptyState/           # Empty state with message
│   │   │
│   │   ├── organisms/                # Complex components
│   │   │   ├── Navbar/               # Complete navigation
│   │   │   ├── Footer/               # Footer
│   │   │   ├── ProductCard/          # Complete product card
│   │   │   ├── ProductGrid/          # Responsive product grid
│   │   │   ├── FilterBar/            # Combined filter bar
│   │   │   ├── SearchBar/            # Complete search bar
│   │   │   ├── SearchResults/        # Search results
│   │   │   ├── ProductDetail/        # Product details
│   │   │   └── ErrorBoundary/        # Custom error boundary
│   │   │
│   │   └── templates/                # Page templates
│   │       └── PageLayout/           # Base Layout (Navbar + Footer + Container + SkipLink)
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useProducts.ts            # Hooks for products
│   │   ├── useSearch.ts              # Hook for search
│   │   ├── useFilters.ts             # Hook for filters
│   │   └── useA11y.ts                # (Future) Accessibility hooks
│   │
│   ├── lib/                          # Utilities & Configurations
│   │   ├── react-query.ts            # React Query configuration
│   │   ├── utils.ts                  # Utility functions
│   │   ├── constants.ts              # Application constants
│   │   ├── a11y.ts                   # Accessibility utilities
│   │   └── image-placeholder.ts      # Image placeholder generator
│   │
│   ├── types/                        # TypeScript Definitions
│   │   ├── index.ts                  # Main types (Product, Store, Room)
│   │   └── accessibility.ts          # Accessibility related types
│   │
│   ├── mocks/                        # MSW Mock Data
│   │   ├── handlers.ts               # MSW Handlers
│   │   ├── data.ts                   # Mock Data (seed data)
│   │   ├── browser.ts                # MSW Browser Setup
│   │   ├── server.ts                 # MSW Server Setup (Node)
│   │
│   └── __tests__/                    # Integration/E2E Tests
│       ├── setup.ts                  # Test setup
│       ├── utils.tsx                 # Test utilities
│       ├── a11y/                     # Accessibility Tests
│       │   ├── atoms.a11y.test.tsx
│       │   ├── molecules.a11y.test.tsx
│       │   ├── organisms.a11y.test.tsx
│       │   └── pages.a11y.test.tsx
│
├── .husky/                           # Git Hooks
│   ├── pre-commit                    # Pre-commit hook
│   └── _/
│
├── jest.config.js                    # Jest Configuration
├── jest.setup.js                     # Jest Setup (MSW, RTL)
├── next.config.js                    # Next.js Configuration
├── tsconfig.json                     # TypeScript Configuration
├── eslint.config.mjs                 # ESLint 9 (Flat Config)
├── .prettierrc                       # Prettier + sort-imports
├── .prettierignore
├── .lintstagedrc.json
├── .gitignore
├── package.json
└── README.md
```

## Structure Principles

### 1. Atomic Design

- **Atoms**: Reusable primitive components (Button, Input, Badge)
- **Molecules**: Combinations of atoms (SearchInput = Input + Button)
- **Organisms**: Complex components (ProductCard, Navbar, FilterBar)
- **Templates**: Page layouts (PageLayout)

### 2. Test Organization

- Unit tests co-located in `__tests__` directories inside each component folder
- Integration tests in `src/__tests__/`
- Accessibility tests in `src/__tests__/a11y/`
- Centralized setup in `jest.setup.js`

### 3. Accessibility

- Components follow WCAG AA standards
- ESLint with `eslint-plugin-jsx-a11y` enabled
- `SkipLink` component for keyboard navigation
- TypeScript types ensuring accessibility props
- Automated accessibility testing with `jest-axe`

### 4. Separation of Concerns

- `hooks/`: Reusable logic
- `lib/`: Configurations and utilities
- `types/`: TypeScript definitions
- `mocks/`: Mock data for development/testing

### 5. Next.js 16 App Router

- `app/`: File-based routing
- `loading.tsx`: Automatic Loading states (Suspense)
- `error.tsx`: Per-route Error boundaries
- SSR/ISR/SSG implemented as needed

## Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useProducts.ts`)
- **Utils**: camelCase (`utils.ts`, `constants.ts`)
- **Types**: camelCase (`index.ts`, `accessibility.ts`)
- **Tests**: `.test.tsx` or `.test.ts` alongside the file

## Next Steps

1.  Maintain this structure as the project scales.
2.  Ensure every new component has a corresponding test file.
3.  Keep the `docs/` folder updated with architectural decisions.
