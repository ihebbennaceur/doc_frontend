# Next.js Frontend for Seller Platform

## Development

This project uses Next.js 15+ with TypeScript, Tailwind CSS, and modular architecture.

### Quick Start
```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Folder Structure Rules

We follow a modular, feature-based architecture:

- **`src/components/`** - Small, reusable UI components (Button, Input, Card, Alert)
- **`src/modules/`** - Feature modules (auth, properties, dashboard, etc)
  - Each module can have `pages/`, `components/`, `hooks/`, `services/`
- **`src/constants/`** - Constants (colors, config, enums)
- **`src/store/`** - Zustand state management
- **`src/lib/`** - Utility functions and API clients
- **`src/app/`** - Next.js App Router (routing only, imports from modules)

### Color Theme

All colors are defined in `src/constants/colors.ts`. To change theme:
1. Update `COLORS` object
2. Changes apply everywhere automatically
3. Never hardcode colors in components

### Component Guidelines

- Keep components small and single-purpose
- Use Zustand for state management
- Import colors from `@/constants/colors`
- Components should be in `src/components/` unless module-specific
- Module-specific components go in `src/modules/<feature>/components/`

### Adding New Features

1. Create feature folder: `src/modules/<feature>`
2. Add subdirectories: `pages/`, `components/`, `hooks/`, `services/`
3. Create route: `src/app/<feature>/`
4. Import module pages in route file

### Build

```bash
npm run build
npm start
```

## Notes

- Backend API: http://localhost:8000/api (set in `.env.local`)
- JWT tokens stored in localStorage
- Axios interceptors handle token refresh automatically
