# 📚 EstateFlow Pro - Module Index

This file serves as a quick reference for all the new modules and utilities added to the project.

## 📁 Directory Structure Overview

```
src/
├── lib/
│   ├── logger.ts           → Structured logging utility
│   ├── api-client.ts       → HTTP client for API calls
│   ├── storage.ts          → Type-safe storage access
│   └── utils.ts            → General utilities
├── services/
│   ├── property.service.ts → Property operations
│   ├── agent.service.ts    → Agent operations
│   ├── dashboard.service.ts → Dashboard operations
│   └── index.ts            → Service exports
├── hooks/
│   ├── use-api.ts          → API call hook
│   ├── use-debounce.ts     → Debounce hook
│   ├── use-paginate.ts     → Pagination hook
│   ├── use-mobile.tsx      → Mobile detection
│   ├── use-toast.ts        → Toast notifications
│   └── index.ts            → Hook exports
├── types/
│   └── index.ts            → Type definitions
├── constants/
│   └── index.ts            → App constants
├── utils/
│   ├── validation.ts       → Form validation
│   └── index.ts            → Utility exports
└── components/
    └── ErrorBoundary.tsx   → Error handling
```

## 🔍 Module Reference

### Core Libraries (`src/lib/`)

#### `logger.ts`
**Purpose**: Structured logging with development formatting
**Key Functions**: 
- `logger.debug()`, `logger.info()`, `logger.warn()`, `logger.error()`
**Usage**:
```tsx
import { logger } from '@/lib/logger';
logger.info('Message', { data: value });
```

#### `api-client.ts`
**Purpose**: HTTP client for all API requests
**Key Functions**: 
- `apiClient.get<T>()`, `post<T>()`, `put<T>()`, `patch<T>()`, `delete<T>()`
- `setToken()`, `clearToken()`
**Usage**:
```tsx
import { apiClient } from '@/lib/api-client';
const data = await apiClient.get<MyType>('/endpoint');
```

#### `storage.ts`
**Purpose**: Type-safe localStorage/sessionStorage operations
**Key Functions**: 
- `storage.getItem<T>()`, `setItem<T>()`, `removeItem()`
- `storage.getSessionItem<T>()`, `setSessionItem<T>()`, `removeSessionItem()`
**Usage**:
```tsx
import { storage } from '@/lib/storage';
storage.setItem('key', value);
const data = storage.getItem<Type>('key');
```

### Service Layer (`src/services/`)

#### `property.service.ts`
**Methods**:
- `getProperties(filters?)` - Get all properties with pagination
- `getProperty(id)` - Get single property
- `createProperty(data)` - Create new property
- `updateProperty(id, data)` - Update property
- `deleteProperty(id)` - Delete property
- `searchProperties(query)` - Search properties

**Usage**:
```tsx
import { propertyService } from '@/services';
const props = await propertyService.getProperties({ page: 1 });
```

#### `agent.service.ts`
**Methods**:
- `getAgents()` - Get all agents
- `getAgent(id)` - Get single agent
- `getAgentPerformance(id)` - Get performance metrics
- `getAgentProperties(id)` - Get agent's properties

**Usage**:
```tsx
import { agentService } from '@/services';
const agents = await agentService.getAgents();
```

#### `dashboard.service.ts`
**Methods**:
- `getStats()` - Dashboard statistics
- `getRevenueData(period)` - Revenue analytics
- `getAgentPerformanceData()` - Agent performance
- `getPortalStats()` - Portal statistics

**Usage**:
```tsx
import { dashboardService } from '@/services';
const stats = await dashboardService.getStats();
```

### Custom Hooks (`src/hooks/`)

#### `use-api.ts`
**Purpose**: Manage API calls with loading and error states
**Returns**: `{ data, loading, error, execute }`
**Usage**:
```tsx
import { useApi } from '@/hooks/use-api';
const { data, loading, error, execute } = useApi<Type[]>();
await execute('/endpoint');
```

#### `use-debounce.ts`
**Purpose**: Debounce value changes
**Returns**: Debounced value
**Usage**:
```tsx
import { useDebounce } from '@/hooks/use-debounce';
const debouncedTerm = useDebounce(searchTerm, 300);
```

#### `use-paginate.ts`
**Purpose**: Manage pagination state
**Returns**: `{ page, pageSize, nextPage, prevPage, goToPage, reset, offset }`
**Usage**:
```tsx
import { usePaginate } from '@/hooks/use-paginate';
const { page, pageSize, nextPage } = usePaginate({ pageSize: 20 });
```

#### `use-mobile.tsx`
**Purpose**: Detect mobile viewport
**Returns**: Boolean
**Usage**:
```tsx
import { useMobile } from '@/hooks/use-mobile';
const isMobile = useMobile();
```

### Type Definitions (`src/types/`)

#### `index.ts`
**Types**:
- `BaseEntity` - Base with id and timestamps
- `Property` - Real estate property
- `Agent` - Real estate agent
- `DashboardStats` - Dashboard statistics
- `PaginatedResponse<T>` - Paginated list response
- `AuthUser` - Authenticated user
- `AuthState` - Auth state

**Usage**:
```tsx
import type { Property, Agent } from '@/types';
const property: Property = { /* ... */ };
```

### Utilities (`src/utils/`)

#### `validation.ts`
**Schemas**: `propertySchema`, `searchSchema`, `paginationSchema`
**Functions**: `validateFormData<T>(schema, data)`
**Usage**:
```tsx
import { propertySchema, validateFormData } from '@/utils/validation';
const { data, errors } = validateFormData(propertySchema, values);
```

### Constants (`src/constants/`)

#### `index.ts`
**Exports**:
- `APP_CONFIG` - App configuration
- `ROUTES` - Route paths
- `PROPERTY_TYPES`, `PROPERTY_STATUS` - Enums
- `PAGINATION` - Pagination defaults
- `API_ENDPOINTS` - API endpoint paths
- `UI_CONFIG` - UI configuration
- `ERROR_MESSAGES` - Error messages
- `SUCCESS_MESSAGES` - Success messages

**Usage**:
```tsx
import { ROUTES, PROPERTY_TYPES } from '@/constants';
```

### Components (`src/components/`)

#### `ErrorBoundary.tsx`
**Purpose**: Catch and handle React component errors
**Already integrated in**: `App.tsx`
**Usage**: Wraps the entire app
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## 📊 Quick Import Guide

```tsx
// Logging
import { logger } from '@/lib/logger';

// API & Network
import { apiClient } from '@/lib/api-client';
import { propertyService, agentService, dashboardService } from '@/services';
import { useApi } from '@/hooks/use-api';

// Storage
import { storage } from '@/lib/storage';

// Form & Validation
import { propertySchema, validateFormData } from '@/utils/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Hooks
import { useDebounce } from '@/hooks/use-debounce';
import { usePaginate } from '@/hooks/use-paginate';
import { useMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks';

// Types
import type { Property, Agent, DashboardStats } from '@/types';

// Constants
import { ROUTES, PROPERTY_TYPES, APP_CONFIG } from '@/constants';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
```

## 🎯 Common Workflows

### Fetch Data from API
```tsx
import { propertyService } from '@/services';

const properties = await propertyService.getProperties({ 
  page: 1, 
  pageSize: 10 
});
```

### Build a List Component with Pagination
```tsx
import { useApi } from '@/hooks/use-api';
import { usePaginate } from '@/hooks/use-paginate';
import type { Property } from '@/types';

export const PropertyList = () => {
  const { page, pageSize, nextPage, prevPage } = usePaginate();
  const { data, loading, error, execute } = useApi<Property[]>();

  useEffect(() => {
    execute(`/properties?page=${page}&pageSize=${pageSize}`);
  }, [page, pageSize]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.map(p => <PropertyCard key={p.id} property={p} />)}
      <button onClick={prevPage}>Previous</button>
      <button onClick={nextPage}>Next</button>
    </div>
  );
};
```

### Create Form with Validation
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema } from '@/utils/validation';
import { propertyService } from '@/services';

export const PropertyForm = () => {
  const { register, handleSubmit, formState: { errors } } = 
    useForm({ resolver: zodResolver(propertySchema) });

  const onSubmit = async (data) => {
    try {
      const property = await propertyService.createProperty(data);
      logger.info('Property created', property);
    } catch (error) {
      logger.error('Failed to create property', error);
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>/* ... */</form>;
};
```

### Implement Search with Debounce
```tsx
import { useDebounce } from '@/hooks/use-debounce';
import { propertyService } from '@/services';

export const PropertySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useDebounce(searchTerm, 300);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (debouncedTerm) {
      propertyService.searchProperties(debouncedTerm)
        .then(setResults)
        .catch(error => logger.error('Search failed', error));
    }
  }, [debouncedTerm]);

  return (
    <div>
      <input 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)}
      />
      {results.map(r => <div key={r.id}>{r.name}</div>)}
    </div>
  );
};
```

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `ENHANCEMENT_SUMMARY.md` | Overview of enhancements |
| `DEVELOPMENT.md` | Complete development guide |
| `QUICK_REFERENCE.md` | Quick code snippets |
| `API_INTEGRATION.md` | API integration guide |
| `GETTING_STARTED.md` | Onboarding checklist |
| `MODULE_INDEX.md` | This file |

## 🚀 Next Steps

1. **Choose a feature to build**
2. **Import the necessary modules**
3. **Follow the patterns from Quick Reference**
4. **Use the TypeScript intellisense**
5. **Check the browser console logs**
6. **Deploy when ready**

## 💡 Pro Tips

1. **Always use types**: `useApi<Property[]>()` not `useApi()`
2. **Use services**: They encapsulate API logic
3. **Leverage logger**: It's already integrated
4. **Check docs**: QUICK_REFERENCE.md has examples for everything
5. **Type safety**: Let TypeScript guide you

---

**Happy Developing! 🎉**
