# AI Chatbot Application

## Overview

This is a full-stack AI chatbot application that provides conversational interfaces with AI assistants. The application features a clean, minimal black and white dark mode aesthetic inspired by ChatGPT, Linear, and Discord. Users can create multiple conversations, send messages, and receive AI-generated responses powered by OpenAI's API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React with TypeScript**: Component-based UI using functional components and hooks
- **Vite**: Development server and build tool for fast HMR and optimized production builds
- **Wouter**: Lightweight routing library for client-side navigation
- **TanStack Query (React Query)**: Server state management, caching, and data synchronization

**UI Component System**
- **shadcn/ui**: Radix UI primitives with custom styling (New York variant)
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Design System**: Monochrome palette (black, white, grayscale) with strict adherence to minimal aesthetic
- **Typography**: Inter font family via Google Fonts CDN
- **Responsive Layout**: Mobile-first design with collapsible sidebar navigation

**State Management Pattern**
- Server state managed via React Query with aggressive caching (`staleTime: Infinity`)
- Local UI state managed with React hooks (useState, useRef)
- Global UI providers: Toast notifications, Tooltips, Sidebar state

### Backend Architecture

**Server Framework**
- **Express.js**: RESTful API server with middleware-based architecture
- **TypeScript**: Type-safe server implementation with ESM modules
- **HTTP Server**: Native Node.js HTTP server for both API and Vite middleware

**API Design**
- **RESTful Endpoints**:
  - `GET /api/conversations` - List all conversations
  - `POST /api/conversations` - Create new conversation
  - `GET /api/conversations/:id/messages` - Fetch conversation messages
  - `POST /api/conversations/:id/messages` - Send message and receive AI response
  - `PATCH /api/conversations/:id` - Update conversation title
  - `DELETE /api/conversations/:id` - Delete conversation

**Request/Response Flow**
- JSON request/response bodies with Zod schema validation
- Error handling with appropriate HTTP status codes
- Request logging middleware tracking method, path, status, and duration

### Data Storage

**Database Strategy**
- **Development**: In-memory storage implementation (`MemStorage` class)
- **Production Ready**: Drizzle ORM configured for PostgreSQL with Neon serverless driver
- **Schema Definition**: Type-safe schema using Drizzle ORM and Zod for validation

**Data Models**
- **Conversations**: ID, title, timestamps (createdAt, updatedAt)
- **Messages**: ID, conversationId, role (user/assistant), content, timestamp
- **Storage Interface**: Abstract `IStorage` interface allows swapping between memory and database implementations

**Database Configuration**
- Drizzle Kit configured for PostgreSQL dialect
- Migrations directory: `./migrations`
- Schema location: `./shared/schema.ts`
- Connection via `DATABASE_URL` environment variable

### External Dependencies

**Third-Party Services**
- **OpenAI API**: GPT-based chat completions for AI responses
  - API key required via `OPENAI_API_KEY` environment variable
  - Streaming responses for real-time message generation
  - Model: Configurable (default likely GPT-3.5/4)

**Database Service**
- **Neon Postgres**: Serverless PostgreSQL database (configured but not actively used in current implementation)
  - Connection via `@neondatabase/serverless` driver
  - Prepared for production deployment with Drizzle ORM

**Development Tools**
- **Replit-specific Plugins**: Development banners, error modals, and cartographer for enhanced Replit IDE experience

**UI Component Libraries**
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
  - Dialog, Dropdown, Popover, Toast, Sidebar, and 20+ other components
  - Provides accessibility features (ARIA, keyboard navigation)

**Utility Libraries**
- **date-fns**: Date formatting and manipulation
- **clsx & tailwind-merge**: Conditional class name composition
- **class-variance-authority**: Type-safe component variants
- **nanoid**: Unique ID generation

### Authentication & Session Management

**Current State**: No authentication system implemented
- Application currently uses in-memory storage without user accounts
- Sessions not required for current single-user development mode

**Prepared Infrastructure**
- `connect-pg-simple` package installed for PostgreSQL session store
- Can be integrated with Express session middleware when multi-user support is needed