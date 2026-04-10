# Seller Platform Frontend

A modern Next.js frontend for the Seller Platform - a seller-focused real estate platform.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages (login, register)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── modules/               # Feature modules (auth, properties, etc)
│   └── auth/
│       └── pages/         # Auth page components
├── components/            # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Alert.tsx
├── constants/             # Constants and config
│   └── colors.ts          # Centralized color palette
├── store/                 # Zustand state management
│   └── authStore.ts       # Auth store
└── lib/                   # Utility functions
    └── api.ts             # Axios API client
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Features

- ✅ Modular architecture with feature-based folders
- ✅ Centralized color theme system
- ✅ Reusable UI components
- ✅ Zustand state management
- ✅ JWT authentication integration
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ ESLint configuration

## Color System

Colors are centralized in `src/constants/colors.ts`. Update there for consistent theme changes across the app.

### Theme Colors
- **Primary**: Blue (#0ea5e9)
- **Success**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Grayscale

## Build

```bash
npm run build
npm start
```

## Next Steps

- Add property listing module
- Add document upload functionality
- Add admin dashboard
- Implement email verification flow
- Add profile management
