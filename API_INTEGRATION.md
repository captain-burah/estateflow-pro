# API Integration Guide - EstateFlow Pro

## Overview

This guide explains how to integrate your backend API with the EstateFlow Pro frontend.

## API Client Setup

The `apiClient` in `src/lib/api-client.ts` handles all HTTP requests with:
- Automatic header management
- Bearer token authentication
- Error handling and logging
- Request/response transformation

## Base Configuration

Update your API URL in `.env.development`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Using the API Client

### Direct API Calls

```tsx
import { apiClient } from '@/lib/api-client';

// GET
const response = await apiClient.get<Property[]>('/properties');

// POST
const response = await apiClient.post<Property>('/properties', {
  name: 'New Property',
  // ... other fields
});

// PUT
const response = await apiClient.put<Property>('/properties/123', {
  name: 'Updated Property'
});

// PATCH
const response = await apiClient.patch<Property>('/properties/123', {
  status: 'sold'
});

// DELETE
await apiClient.delete('/properties/123');
```

## Using Service Layers

For cleaner code, use the provided service modules:

```tsx
import { propertyService, agentService, dashboardService } from '@/services';

// Property operations
const properties = await propertyService.getProperties({ page: 1, pageSize: 10 });
const property = await propertyService.getProperty('123');
const newProperty = await propertyService.createProperty(data);
const updated = await propertyService.updateProperty('123', { status: 'sold' });
await propertyService.deleteProperty('123');
const results = await propertyService.searchProperties('Dubai Penthouse');

// Agent operations
const agents = await agentService.getAgents();
const agent = await agentService.getAgent('123');
const performance = await agentService.getAgentPerformance('123');
const properties = await agentService.getAgentProperties('123');

// Dashboard operations
const stats = await dashboardService.getStats();
const revenue = await dashboardService.getRevenueData('month');
const performance = await dashboardService.getAgentPerformanceData();
const portals = await dashboardService.getPortalStats();
```

## Using the useApi Hook

For components with loading and error states:

```tsx
import { useApi } from '@/hooks/use-api';
import type { Property } from '@/types';

export const PropertiesList = () => {
  const { data, loading, error, execute } = useApi<Property[]>({
    onSuccess: (data) => console.log('Loaded:', data),
    onError: (error) => console.error('Failed:', error.message)
  });

  const loadProperties = async () => {
    try {
      await execute('/properties', 'GET');
    } catch (error) {
      // Error is already in the error state
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && data.map(prop => <div key={prop.id}>{prop.name}</div>)}
      <button onClick={loadProperties}>Load</button>
    </div>
  );
};
```

## Authentication

### Setting a Token

```tsx
import { apiClient } from '@/lib/api-client';

// After login
const token = 'your-jwt-token';
apiClient.setToken(token);

// Token is automatically included in all subsequent requests
```

### Clearing a Token

```tsx
// On logout
apiClient.clearToken();
```

### Header Management

The client automatically adds:
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (if authenticated)

## Error Handling

### API Errors

All API errors follow this structure:

```tsx
interface ApiError {
  status: number;        // HTTP status code
  message: string;       // Error message
  data?: unknown;        // Additional error data from server
}
```

### Error Handling Patterns

```tsx
import { logger } from '@/lib/logger';

try {
  const properties = await propertyService.getProperties();
} catch (error) {
  logger.error('Failed to load properties', error);
  
  if (error.status === 401) {
    // Handle unauthorized
    redirectToLogin();
  } else if (error.status === 403) {
    // Handle forbidden
    showPermissionError();
  } else if (error.status === 404) {
    // Handle not found
    showNotFoundError();
  } else {
    // Handle other errors
    showGenericError(error.message);
  }
}
```

### Using useApi with Error Callback

```tsx
const { data, error } = useApi<Property[]>({
  onError: (error) => {
    if (error.status === 401) {
      // Handle login redirect
    } else {
      // Show error toast
      toast.error(error.message);
    }
  }
});
```

## Logging

The API client automatically logs all requests:

```tsx
import { logger } from '@/lib/logger';

// Development: Colored console output
// Production: JSON stringified logs

logger.debug('Debug message', { data: 'value' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', errorObject);
```

## Expected API Endpoints

Based on the services, your backend should implement:

### Properties
```
GET    /api/properties                 # Get all (with pagination)
GET    /api/properties/:id             # Get one
POST   /api/properties                 # Create
PATCH  /api/properties/:id             # Update
DELETE /api/properties/:id             # Delete
GET    /api/properties/search?q=query  # Search
```

### Agents
```
GET    /api/agents                     # Get all
GET    /api/agents/:id                 # Get one
GET    /api/agents/:id/performance     # Get performance metrics
GET    /api/agents/:id/properties      # Get agent's properties
```

### Dashboard
```
GET    /api/dashboard/stats            # Dashboard statistics
GET    /api/dashboard/revenue?period=month # Revenue data
GET    /api/dashboard/agent-performance    # Agent performance
GET    /api/dashboard/portal-stats         # Portal statistics
```

## Response Format

### List Response (with pagination)

```json
{
  "data": [
    {
      "id": "123",
      "name": "Property Name",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

### Single Item Response

```json
{
  "id": "123",
  "name": "Property Name",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Error Response

```json
{
  "status": 400,
  "message": "Validation failed",
  "data": {
    "errors": {
      "name": "Name is required"
    }
  }
}
```

## Query Parameters

### Pagination

```tsx
const response = await propertyService.getProperties({
  page: 1,        // 1-indexed
  pageSize: 10    // Items per page
});
```

### Filtering

```tsx
const response = await propertyService.getProperties({
  page: 1,
  pageSize: 10,
  type: 'luxury',
  city: 'Dubai'
});
```

### Search

```tsx
const results = await propertyService.searchProperties('penthouse');
// Your API should handle the 'q' query parameter
```

## Custom API Calls

For endpoints not covered by the services:

```tsx
import { apiClient } from '@/lib/api-client';

// Custom endpoint
const data = await apiClient.get<CustomType>('/custom-endpoint');
```

## Testing API Integration

### Mock Data (Development)

The app includes mock data in `src/data/dummy-data.ts` for development without a backend.

### Connect Real API

1. Update `.env.development`:
   ```env
   VITE_API_URL=http://your-api-url/api
   ```

2. Replace mock data with API calls:
   ```tsx
   // Before
   const properties = dummyProperties;
   
   // After
   const properties = await propertyService.getProperties();
   ```

## Rate Limiting & Retries

For adding retry logic:

```tsx
import { useApi } from '@/hooks/use-api';

const { data, loading, error, execute } = useApi<Property[]>();

const fetchWithRetry = async (maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await execute('/properties');
      break;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## Best Practices

1. **Use Services**: Create service functions for complex operations
2. **Type Safety**: Always provide generic type to API calls
3. **Error Handling**: Always handle potential errors
4. **Logging**: Log important operations for debugging
5. **Validation**: Validate data before sending to API
6. **Debouncing**: Debounce search and filter requests
7. **Pagination**: Use pagination for large datasets
8. **Caching**: Use React Query for automatic caching

## Troubleshooting

### CORS Errors
- Ensure backend allows requests from your frontend URL
- Check `Access-Control-Allow-Origin` header

### 401 Unauthorized
- Token may have expired
- Check token is being set correctly
- Implement token refresh logic

### 404 Not Found
- Check endpoint URL matches backend
- Verify resource ID is correct
- Check API base URL in environment

### Timeout Errors
- Increase timeout if needed
- Check backend is running
- Check network connection

## Support

For issues or questions about the API integration:
1. Check the DEVELOPMENT.md guide
2. Review the logger output in browser console
3. Check Network tab in DevTools
4. Review your backend API documentation
