# EstateFlow Pro - Development Quick Reference

## Key Files to Know

### Configuration Files
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `.env.development` - Development environment variables
- `eslint.config.js` - Linting rules

### Core Application Files
- `src/App.tsx` - Main app component with routing and providers
- `src/main.tsx` - Entry point
- `src/components/DashboardLayout.tsx` - Layout wrapper
- `src/components/AppSidebar.tsx` - Navigation sidebar

### Utilities & Services
- `src/lib/logger.ts` - Structured logging
- `src/lib/api-client.ts` - HTTP client for API calls
- `src/lib/utils.ts` - General utility functions
- `src/services/` - Business logic services
- `src/utils/validation.ts` - Form validation schemas
- `src/constants/index.ts` - App constants and configuration

### Types
- `src/types/index.ts` - Centralized type definitions

### Hooks
- `src/hooks/use-api.ts` - Hook for API calls with loading state
- `src/hooks/use-debounce.ts` - Debounce values for search
- `src/hooks/use-paginate.ts` - Pagination logic
- `src/hooks/use-mobile.tsx` - Responsive design detection

## Common Development Tasks

### Start Development Server
```bash
bun run dev
# Runs on http://localhost:5173
```

### Make an API Call
```tsx
import { propertyService } from '@/services';

const properties = await propertyService.getProperties({ page: 1, pageSize: 10 });
```

### Use API Hook with Loading State
```tsx
import { useApi } from '@/hooks/use-api';
import { propertyService } from '@/services';

const { data, loading, error, execute } = useApi<Property[]>();

// In your component
await execute('/properties');
```

### Add Form Validation
```tsx
import { propertySchema, validateFormData } from '@/utils/validation';

const { data, errors } = validateFormData(propertySchema, formValues);
```

### Fetch Data with Debounce
```tsx
import { useDebounce } from '@/hooks/use-debounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedTerm = useDebounce(searchTerm, 300);

// Use debouncedTerm for API calls
```

### Handle Pagination
```tsx
import { usePaginate } from '@/hooks/use-paginate';

const { page, pageSize, nextPage, prevPage } = usePaginate({ pageSize: 20 });
```

### Log Messages
```tsx
import { logger } from '@/lib/logger';

logger.info('User clicked button', { userId: 123 });
logger.error('API call failed', error);
```

### Use Type Definitions
```tsx
import type { Property, Agent, DashboardStats } from '@/types';

const property: Property = { /* ... */ };
```

### Create a New Page
1. Create `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`:
   ```tsx
   <Route path="/my-page" element={<MyPage />} />
   ```
3. Add navigation in `src/components/AppSidebar.tsx`

### Add a UI Component from shadcn/ui
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Use them in your component
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Click me</Button>
  </CardContent>
</Card>
```

## API Integration Pattern

### For Simple Calls
```tsx
const response = await apiClient.get<Property>('/properties/123');
```

### For Complex Queries
```tsx
// Use a service function
const properties = await propertyService.getProperties({
  page: 1,
  pageSize: 10,
  city: 'Dubai',
  type: 'luxury'
});
```

### With Error Handling
```tsx
try {
  const data = await propertyService.getProperties();
} catch (error) {
  logger.error('Failed to fetch properties', error);
  // Show user-friendly error message
}
```

## Environment Variables

### Available Variables
```env
VITE_API_URL           # API base URL
VITE_ENV              # Environment (development/production)
VITE_ENABLE_ANALYTICS # Enable analytics
VITE_APP_NAME         # Application name
VITE_APP_VERSION      # Application version
```

### Access in Code
```tsx
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

## Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ErrorBoundary   # Error boundary
│   ├── DashboardLayout # Layout component
│   └── AppSidebar      # Navigation
├── pages/              # Page components
│   ├── Dashboard
│   ├── Properties
│   └── NotFound
├── hooks/              # Custom React hooks
├── services/           # API services
├── lib/                # Utilities
│   ├── logger.ts
│   ├── api-client.ts
│   └── utils.ts
├── types/              # Type definitions
├── constants/          # App constants
├── utils/              # Utility functions
├── data/               # Mock data
├── App.tsx             # Main app
└── main.tsx            # Entry point
```

## Useful Patterns

### Service + Hook Pattern
```tsx
// Define service
const myService = {
  fetch: () => apiClient.get('/endpoint')
};

// Use in component
const { data, loading, error, execute } = useApi();
const fetchData = () => execute('/endpoint');
```

### Form with Validation
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema } from '@/utils/validation';

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(propertySchema)
  });

  const onSubmit = async (data) => {
    await propertyService.createProperty(data);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>/* ... */</form>;
};
```

### Responsive Component
```tsx
import { useMobile } from '@/hooks/use-mobile';

export const MyComponent = () => {
  const isMobile = useMobile();
  
  return (
    <div className={isMobile ? 'text-sm' : 'text-lg'}>
      {isMobile ? 'Mobile' : 'Desktop'}
    </div>
  );
};
```

## Error Boundaries

The app automatically wraps everything with an error boundary. Errors are caught and displayed gracefully:

```tsx
// Errors in any component will be caught
// and show a user-friendly error page
```

## Performance Tips

1. **Lazy Load Routes**
   ```tsx
   const MyPage = React.lazy(() => import('./pages/MyPage'));
   <Suspense fallback={<Loading />}>
     <MyPage />
   </Suspense>
   ```

2. **Memoize Components**
   ```tsx
   const MyComponent = React.memo(({ data }) => {
     return <div>{data}</div>;
   });
   ```

3. **Use Pagination**
   ```tsx
   const { page, pageSize } = usePaginate({ pageSize: 20 });
   ```

4. **Debounce Search**
   ```tsx
   const debouncedSearch = useDebounce(searchTerm, 300);
   ```

## Debugging

### React DevTools
- Install React Developer Tools browser extension
- Inspect component hierarchy and props

### Browser Console
- Check `logger` output with color-coded levels
- All API calls are logged

### VS Code
- Set breakpoints in source files
- Use Debug Console to inspect variables

## Common Commands

```bash
# Development
bun run dev              # Start dev server
bun run dev -- --port 3000  # Custom port

# Building
bun run build            # Production build
bun run build:dev        # Development build (debugging)
bun run preview          # Preview production build

# Testing & Quality
bun run test             # Run tests
bun run test:watch       # Watch mode
bun run lint             # Check code quality

# Type Checking
# (Automatic on save in VS Code with TypeScript extension)
```

## Troubleshooting

**Port 5173 in use?**
```bash
lsof -i :5173
kill -9 <PID>
```

**Module not found?**
- Check path uses `@/` alias
- Verify file exists
- Run `bun install`

**TypeScript errors?**
- Save file to trigger type checking
- Run `bun run build` to see all errors
- Check `tsconfig.json` path mappings

**API calls failing?**
- Check `VITE_API_URL` in `.env.development`
- Check browser Network tab
- Look at logger output in console

## Resources

- [Vite](https://vitejs.dev) - Build tool
- [React](https://react.dev) - UI library
- [React Router](https://reactrouter.com) - Routing
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [React Query](https://tanstack.com/query) - Server state management
- [Zod](https://zod.dev) - Schema validation

## Next Steps

1. ✅ Environment is set up and ready
2. 🔗 Connect API endpoint (update `VITE_API_URL` in `.env.development`)
3. 📝 Replace mock data with real API calls
4. 🎨 Customize styling and branding
5. 🧪 Add tests for components and services
6. 📦 Set up CI/CD pipeline
7. 🚀 Deploy to production
