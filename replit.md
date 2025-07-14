# Loan Calculator Application

## Overview

This is a full-stack loan calculator application built with a modern web stack. The application provides comprehensive loan analysis including payment calculations, amortization schedules, scenario comparisons, and interactive charts. It features a React frontend with a clean, responsive UI and an Express.js backend with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple
- **Development**: Hot module replacement with Vite integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon
- **ORM**: Drizzle ORM with type-safe queries and migrations
- **Schema**: Shared schema definitions between client and server
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Development Storage**: In-memory storage class for development/testing

## Key Components

### Frontend Components
1. **Loan Input Form**: Interactive form with sliders, inputs, and currency selection
2. **Loan Summary**: Key metrics display with color-coded cards
3. **Payment Charts**: Pie charts and line charts for visual analysis
4. **Payment Schedule**: Detailed amortization tables with yearly/monthly views
5. **Scenario Comparison**: Side-by-side comparison of different loan scenarios
6. **UI Components**: Complete shadcn/ui component library for consistent design

### Backend Components
1. **Express Server**: RESTful API with middleware for logging and error handling
2. **Storage Interface**: Abstracted storage layer supporting both memory and database implementations
3. **Route Handler**: Centralized route registration system
4. **Vite Integration**: Development server with hot reloading and SSR support

### Shared Components
1. **Schema Definitions**: Database schema with Zod validation
2. **Type Definitions**: Shared TypeScript interfaces and types
3. **Utility Functions**: Common functions used across client and server

## Data Flow

### Loan Calculation Flow
1. User inputs loan parameters (amount, rate, term, additional payments)
2. Frontend performs real-time calculations using pure functions
3. Results displayed across multiple components (summary, charts, schedules)
4. Scenario comparisons calculated automatically
5. Export functionality generates CSV reports

### Database Flow
1. User data stored in PostgreSQL via Drizzle ORM
2. Session management through PostgreSQL store
3. Schema migrations managed through Drizzle Kit
4. Type-safe database operations with automatic TypeScript inference

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL with connection pooling
- **UI Library**: Radix UI for accessible component primitives
- **Charts**: Recharts for responsive data visualization
- **Date Handling**: date-fns for date manipulation
- **Validation**: Zod for runtime type validation
- **Development**: Replit-specific tooling for cloud development

### Build Dependencies
- **TypeScript**: Full type safety across the stack
- **ESBuild**: Fast bundling for production server
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Vite Plugins**: Runtime error overlay and Replit integration

## Deployment Strategy

### Frontend-Only Architecture for GitHub Pages
The application has been configured as a static React application suitable for GitHub Pages deployment:

1. **Frontend Build**: Vite builds optimized React application to `dist/public`
2. **Static Assets**: All calculations performed client-side using pure functions
3. **No Backend Dependencies**: Loan calculations, currency formatting, and PDF generation work entirely in the browser
4. **GitHub Actions**: Automated deployment pipeline configured

### GitHub Pages Deployment
- **Repository Setup**: Configured for automatic deployment via GitHub Actions
- **Build Process**: Vite optimizes and bundles the React application
- **Static Hosting**: GitHub Pages serves the built application
- **Custom Domain**: Optional CNAME configuration available
- **Workflow File**: `.github/workflows/deploy.yml` handles automated builds

### Environment Configuration
- **Development**: NODE_ENV=development with Vite dev server on Replit
- **Production**: NODE_ENV=production with static GitHub Pages hosting
- **Client-Side Only**: All functionality works without server dependencies
- **PDF Export**: Generated client-side using jsPDF library

### Deployment Features
- **Automatic Deployment**: Push to main branch triggers GitHub Actions
- **Branch Strategy**: Builds from `main`, deploys to `gh-pages` branch  
- **URL Structure**: Available at `https://username.github.io/loan-vision/`
- **Mobile Responsive**: Optimized for all device sizes
- **Fast Loading**: Vite-optimized bundle with code splitting

The application is now a pure single-page application optimized for static hosting, with all loan calculation features working entirely in the browser. The modular architecture allows for easy extension of financial calculation features.