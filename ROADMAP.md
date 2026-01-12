# 🗺️ Project Roadmap & Execution Plan (FRONTEND)

## Phase 1: Environment Setup & Tooling 🏗️
- [ ] Initialize Next.js project with TypeScript and App Router.
- [ ] Install and configure TailwindCSS 4.
- [ ] Setup ESLint, Prettier, and Prettier-plugin-sort-imports.
- [ ] Configure Husky for pre-commit hooks.
- [ ] Initialize Jest and React Testing Library environment.
- [ ] Setup `new-component` templates for faster development.

## Phase 2: Architecture & Data Mocking ⚙️
- [ ] Configure MSW (Mock Service Worker) with realistic product data.
- [ ] Setup React Query Provider and basic fetch services.
- [ ] Define TypeScript Interfaces for Products, Stores, and Rooms.

## Phase 3: UI Foundation (The Home Edit Style) 🎨
- [ ] Create Global Styles and Typography settings in Tailwind 4.
- [ ] Develop Base UI Components with Radix UI (Button, Input, Select, Dialog).
- [ ] Implement Layout components (Navbar, Footer, Container).

## Phase 4: Feature Implementation 🚀
- [ ] **Search Engine:** Build the Home page with the search bar and logic.
- [ ] **Results Grid:** Create the product card and responsive grid.
- [ ] **Filtering System:** Implement Room and Store filters using React Query state.
- [ ] **Recent Arrivals:** Build the page using ISR (Incremental Static Regeneration).
- [ ] **About Page:** Static page with project details.

## Phase 5: Testing & Quality Assurance 🧪
- [ ] Unit tests for individual components.
- [ ] Integration tests for the search and filter flow using RTL and MSW.
- [ ] Accessibility audit using Axe or similar tools to ensure WCAG compliance.

## Phase 6: Deployment & Portfolio Polish ✨
- [ ] Deploy to Vercel.
- [ ] Finalize README.md with screenshots and technical decisions.
- [ ] Optimization of Core Web Vitals (LCP, FID, CLS).