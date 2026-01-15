# 📋 Project Requirements - Home Organizer Finder

## 1. Project Overview

A web application built with Next.js that allows users to search for home organization products across multiple e-commerce platforms using a web crawler (simulated via MSW for now). The goal is to help users find the perfect organizing solution for specific rooms or needs.

## 2. Functional Requirements (FR)

- **FR01: Global Search:** Users must be able to search for products via a text input on the home page.
- **FR02: Store Filtering:** Users must be able to filter search results by specific e-commerce stores.
- **FR03: Room Filtering:** Users must be able to filter results by room categories (e.g., Kitchen, Pantry, Bathroom, Closet, Office).
- **FR04: Recent Arrivals:** A dedicated page to display the latest items found by the crawler.
- **FR05: Product Details:** Display essential info: Photo, Price, Store Name, Product Name, Product Description, and Dimensions.
- **FR06: About Page:** Information about the project's purpose and technology.

## 3. Non-Functional Requirements (NFR)

- **NFR01: Accessibility (WCAG):** Must follow WCAG guidelines using Radix UI Primitives to ensure keyboard navigation and screen reader compatibility.
- **NFR02: Performance:** Implementation of SSR (Server-Side Rendering) for search results and ISR (Incremental Static Regeneration) for the "Recent Arrivals" page. **SSG (Static Site Generation):** For the "About" page to ensure lightning-fast loading since content changes rarely.
- **NFR03: Design System:** Minimalist UI inspired by 'The Home Edit' (clean, white-space focused, subtle rainbow accents).
- **NFR04: Internationalization:** The interface and data results must be in English.
- **NFR05: Responsiveness:** The layout must be fully responsive (Mobile, Tablet, Desktop).

## 4. Technical Stack

- **Frontend:** React, Next.js (App Router), TypeScript.
- **Styling:** TailwindCSS 4.
- **State Management & Data Fetching:** React Query (TanStack Query).
- **Components:** Radix UI Primitives.
- **Testing:** Jest, React Testing Library, and MSW (Mock Service Worker).
- **Tooling:** ESLint, Prettier (with sort-imports), Husky, new-component.
