# 🗺️ Project Roadmap & Execution Plan (FRONTEND)

## Phase 1: Environment Setup & Tooling 🏗️

- [x] Initialize Next.js project with TypeScript and App Router.
- [x] Install and configure TailwindCSS 4.
- [x] Setup ESLint, Prettier, and Prettier-plugin-sort-imports.
- [x] Configure Husky for pre-commit hooks.
- [x] Initialize Jest and React Testing Library environment.
- [x] Setup `new-component` templates for faster development.

## Phase 2: Architecture & Data Mocking ⚙️

- [x] Configure MSW (Mock Service Worker) with realistic product data.
- [x] Setup React Query Provider and basic fetch services.
- [x] Define TypeScript Interfaces for Products, Stores, and Rooms.

## Phase 3: UI Foundation (The Home Edit Style) 🎨

- [x] Create Global Styles and Typography settings in Tailwind 4.
- [x] Develop Base UI Components with Radix UI (Button, Input, Select, Dialog).
- [x] Implement Layout components (Navbar, Footer, Container).

## Phase 4: Feature Implementation 🚀

- [x] **Search Engine:** Build the Home page with the search bar and logic.
- [x] **Results Grid:** Create the product card and responsive grid.
- [x] **Filtering System:** Implement Room and Store filters using React Query state.
- [x] **Pagination:** Implement pagination for search results.
- [x] **Recent Arrivals:** Build the page using ISR (Incremental Static Regeneration).
- [x] **About Page:** Static page with project details.
- [x] **Product Details:** Build dynamic product detail page.

## Phase 5: Testing & Quality Assurance 🧪

- [x] Unit tests for individual components (Atoms, Molecules, Organisms).
- [x] Integration tests for the search and filter flow using RTL and MSW.
- [x] Accessibility audit using `jest-axe` to ensure WCAG compliance.
