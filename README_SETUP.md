# Seller Platform Frontend

A professional Next.js frontend for the Seller Platform.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture

**Modular Design:**
- `src/components/` - Reusable UI components
- `src/modules/` - Feature modules (auth, properties, etc.)
- `src/constants/` - Centralized colors and config
- `src/store/` - Zustand state management
- `src/lib/` - API clients and utilities

## Features

✅ Login & Registration with JWT  
✅ Centralized color theme system  
✅ Reusable components (Button, Input, Card, Alert)  
✅ Zustand state management  
✅ Axios API client with token refresh  
✅ TypeScript & Tailwind CSS  

## Environment

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Color Theme

Edit `src/constants/colors.ts` for consistent theme changes across the entire app.

**Current Theme:**
- Primary: Sky Blue (#0ea5e9)
- Success: Green (#22c55e)
- Warning: Amber (#f59e0b)
- Error: Red (#ef4444)
- Neutral: Grayscale

## Build & Deploy

```bash
npm run build
npm start
```
