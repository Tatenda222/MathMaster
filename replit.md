# Calculator App

## Overview

This is a modern calculator application built with React and Express, featuring a clean interface with shadcn/ui components and TypeScript. The application includes a calculator with history tracking, memory functions, and error handling capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React hooks with local state management
- **Routing**: wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: Configured for PostgreSQL with Drizzle ORM
- **Storage**: Currently using in-memory storage with interface for database migration
- **Session Management**: Prepared for PostgreSQL session storage

### Key Design Decisions
- **Monorepo Structure**: Client and server code in separate directories with shared schema
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Component Architecture**: Modular UI components with consistent styling
- **Development Experience**: Hot reload with Vite, error overlays, and development tooling

## Key Components

### Frontend Components
- **Calculator**: Main calculator interface with display, buttons, and history
- **UI Components**: Comprehensive set of shadcn/ui components (buttons, cards, dialogs, etc.)
- **Error Handling**: Toast notifications and error boundaries
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend Components
- **Storage Interface**: Abstracted storage layer supporting both memory and database implementations
- **Route Registration**: Centralized route management system
- **Middleware**: Request logging, error handling, and JSON parsing
- **Development Tools**: Hot reload and error reporting

### Database Schema
- **Users Table**: Basic user structure with id, username, and password fields
- **Validation**: Zod schemas for type-safe data validation
- **ORM**: Drizzle ORM for type-safe database operations

## Data Flow

1. **Frontend State**: Calculator state managed locally with React hooks
2. **API Communication**: TanStack Query for server state management
3. **Database Operations**: Drizzle ORM with PostgreSQL for persistence
4. **Error Handling**: Centralized error management with user-friendly messages

## External Dependencies

### Frontend Dependencies
- **@radix-ui/***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

### Backend Dependencies
- **express**: Web framework
- **drizzle-orm**: Type-safe ORM
- **@neondatabase/serverless**: PostgreSQL driver
- **zod**: Runtime type validation

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **drizzle-kit**: Database migration tool

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds the React app to `dist/public`
2. **Backend**: esbuild bundles the Express server to `dist/index.js`
3. **Database**: Drizzle migrations in `migrations/` directory

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)

### Development Workflow
- **Local Development**: `npm run dev` starts both frontend and backend with hot reload
- **Database Management**: `npm run db:push` applies schema changes
- **Type Checking**: `npm run check` validates TypeScript

### Production Deployment
- **Build**: `npm run build` creates production assets
- **Start**: `npm start` runs the production server
- **Static Assets**: Served from `dist/public`

## Notes

- The application is currently set up with in-memory storage but configured for PostgreSQL migration
- All UI components follow shadcn/ui patterns for consistency
- The calculator includes advanced features like history tracking and memory functions
- Error handling is implemented throughout the application stack
- The codebase uses modern React patterns with hooks and functional components