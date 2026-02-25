# Development Guide - EstateFlow Pro

This guide will help you get started with developing EstateFlow Pro.

## Prerequisites

- Node.js 18+ (or use `nvm`)
- Bun or npm package manager
- Git

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd estateflow-pro

# 2. Install dependencies
bun install
# or
npm install

# 3. Setup environment variables
cp .env.example .env.development
# Edit .env.development as needed

# 4. Start development server
bun run dev
# or
npm run dev

# Visit http://localhost:5173
```

## Available Scripts

```bash
# Start development server with HMR
bun run dev

# Build for production
bun run build

# Build in development mode (debugging)
bun run build:dev

# Preview production build locally
bun run preview

# Run linting
bun run lint

# Run tests once
bun run test

# Run tests in watch mode
bun run test:watch
```

## Project Structure

```
src/
├── components/        # React components
│   ├── ui/           # shadcn/ui components
│   └── ...           # Feature components
├── pages/            # Page components (route handlers)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
│   ├── logger.ts     # Logging utility
│   ├── api-client.ts # API client
│   └── utils.ts      # General utilities
├── types/            # TypeScript type definitions
├── data/             # Mock/static data
└── App.tsx           # Main app component
```

## Architecture Overview

### State Management
- **React Query** (@tanstack/react-query) for server state
- **React Hooks** for component state
- **React Context** can be added for app-wide state

### Component Library
- **shadcn/ui** for pre-built, customizable components
- **Radix UI** as underlying component primitives
- **Tailwind CSS** for styling

### Styling
- **Tailwind CSS** for utility-first styling
- CSS files for component-specific styles
- Dark mode support via `next-themes`

## Development Workflow

### Creating a New Component

```tsx
// src/components/MyComponent.tsx
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

export const MyComponent = () => {
  const handleClick = () => {
    logger.info('Button clicked');
  };

  return (
    <Button onClick={handleClick}>
      Click me
    </Button>
  );
};
```

### Making API Calls

```tsx
import { useApi } from '@/hooks/use-api';

const MyComponent = () => {
  const { data, loading, error, execute } = useApi<Property[]>();

  const fetchProperties = async () => {
    try {
      await execute('/properties');
    } catch (error) {
      console.error('Failed to fetch properties');
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button onClick={fetchProperties}>Fetch</button>
    </div>
  );
};
```

### Using Custom Hooks

```tsx
import { useDebounce } from '@/hooks/use-debounce';
import { usePaginate } from '@/hooks/use-paginate';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useDebounce(searchTerm, 300);
  const { page, nextPage, prevPage, pageSize } = usePaginate({
    pageSize: 20,
  });

  // Use debouncedTerm and page for API calls
};
```

### Logging

The project includes a structured logger for development and production:

```tsx
import { logger } from '@/lib/logger';

logger.debug('Debug message', { data: 'optional' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', errorObject);
```

## Type Safety

The project uses TypeScript with strict type checking. All major entities have type definitions in `src/types/index.ts`:

```tsx
import type { Property, Agent, DashboardStats } from '@/types';

// Now you have full type safety
const property: Property = {
  id: '1',
  name: 'Luxury Penthouse',
  // ... other required fields
};
```

## Error Handling

The app includes an `ErrorBoundary` component to catch React errors:

```tsx
// In App.tsx or main layout
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

API errors are automatically logged and can be handled:

```tsx
const { error } = useApi<Property[]>({
  onError: (error) => {
    console.error('API Error:', error.message);
    // Show user-friendly error message
  },
});
```

## Environment Variables

Create a `.env.development` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
VITE_ENABLE_ANALYTICS=false
```

Access them in your code:

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

## Code Quality

### Linting
```bash
bun run lint
```

The project uses ESLint with React and TypeScript rules.

### Type Checking
```bash
# TypeScript will check types during build
bun run build
```

### Testing
```bash
# Run tests
bun run test

# Watch mode
bun run test:watch
```

## Common Tasks

### Adding a New Page

1. Create file in `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`:
   ```tsx
   <Route path="/my-page" element={<MyPage />} />
   ```
3. Add navigation link in `src/components/AppSidebar.tsx`

### Adding a New API Endpoint

1. Use the `apiClient` utility:
   ```tsx
   import { apiClient } from '@/lib/api-client';
   
   const response = await apiClient.get<Property[]>('/properties');
   ```

2. Or create a dedicated service file:
   ```tsx
   // src/services/propertyService.ts
   export const fetchProperties = () => 
     apiClient.get<Property[]>('/properties');
   ```

### Styling Components

Use Tailwind CSS classes:

```tsx
<div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow">
  <span>Hello</span>
</div>
```

For component-specific styles:

```tsx
// Component file or companion CSS file
<div className={styles.container}>...</div>
```

## Debugging

### Browser DevTools
- Use React DevTools browser extension for component inspection
- Use Redux DevTools for state debugging (if Redux is added)

### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## Performance Tips

1. **Use React.memo** for expensive components
2. **Lazy load routes** with React.lazy
3. **Optimize images** before adding to project
4. **Monitor bundle size** with `bun run build`
5. **Use usePaginate** to avoid loading all data at once

## Contributing

- Write clear commit messages
- Follow the existing code style
- Add tests for new features
- Update types when adding new entities

## Troubleshooting

### Port already in use
```bash
# Change port in vite.config.ts or
lsof -i :5173
kill -9 <PID>
```

### Module not found
- Check import paths use `@/` alias
- Verify files exist in the specified location
- Run `bun install` to ensure dependencies

### TypeScript errors
```bash
# Rebuild TypeScript
rm -rf node_modules/.vite
bun run dev
```

## Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Router Documentation](https://reactrouter.com)

## Need Help?

Check the following:
1. Error messages in terminal/console
2. TypeScript errors in IDE
3. Browser DevTools Network tab for API issues
4. Check environment variables are set correctly
