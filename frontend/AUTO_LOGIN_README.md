# Auto-Login Cloud Authentication

This implementation provides automatic authentication with cloud services when the app starts, using credentials stored in environment variables.

## Setup

### 1. Environment Variables

Update your `.env` file in the frontend directory with your cloud credentials:

```env
# Cloud Authentication Credentials
VITE_CLOUD_LOGIN_EMAIL=your-email@example.com
VITE_CLOUD_LOGIN_PASSWORD=your-password

# Express Production Endpoint
VITE_EXPRESS_PROD_ENDPOINT=https://your-api-endpoint.com
```

### 2. How It Works

1. **App Initialization**: When the app starts, `useAutoLogin` hook is triggered in the `App.tsx` component
2. **Automatic Login**: The system attempts to authenticate using credentials from `.env` file
3. **Token Management**: Access and refresh tokens are stored securely in localStorage
4. **Service Calls**: All cloud service calls automatically use the stored tokens
5. **Token Refresh**: Expired tokens are automatically refreshed when needed

## Components

### AuthStore (`src/store/AuthStore.ts`)
- Zustand store for managing authentication state
- Persists tokens in localStorage
- Provides authentication status and error handling

### AutoLoginService (`src/services/AutoLoginService.ts`)
- Singleton service for handling authentication
- Manages login, token refresh, and validation
- Ensures authentication before API calls

### useAutoLogin Hook (`src/hooks/useAutoLogin.ts`)
- React hook for integrating auto-login into components
- Handles authentication on app startup
- Provides loading and error states

### Cloud Service Utils (`src/utils/cloudServiceUtils.ts`)
- Utility functions for making authenticated API calls
- Simplifies cloud service integration
- Handles automatic token management

## Usage

### Basic Usage

The authentication happens automatically when the app starts. No manual intervention needed.

### Creating Cloud Services

```typescript
import { createCloudService } from 'utils/cloudServiceUtils';

// The service will automatically authenticate if needed
const serviceData = {
  machineId: "machine-001",
  type: "mix",
  price: 5.99,
  paymentType: "card",
  cardId: "card-123",
  cardNumber: "****1234",
  sessions: 1
};

try {
  const result = await createCloudService(serviceData);
  console.log('Service created:', result);
} catch (error) {
  console.error('Service creation failed:', error);
}
```

### Checking Authentication Status

```typescript
import { isCloudAuthenticated } from 'utils/cloudServiceUtils';

const isAuth = await isCloudAuthenticated();
if (isAuth) {
  console.log('User is authenticated');
}
```

### Force Re-authentication

```typescript
import { forceCloudReAuthentication } from 'utils/cloudServiceUtils';

const success = await forceCloudReAuthentication();
if (success) {
  console.log('Re-authentication successful');
}
```

## Error Handling

### Authentication Errors

- If credentials are missing from `.env`, an error is displayed
- If login fails, the app shows an authentication error screen
- If token refresh fails, the system attempts to re-login automatically

### Service Call Errors

- If a service call fails due to authentication, tokens are automatically refreshed
- If refresh fails, a new login attempt is made
- Local services continue to work even if cloud services fail

## Integration in PaymentComponent

The `PaymentComponent` has been updated to automatically create cloud services alongside local services:

1. Creates local service (existing functionality)
2. Converts local service data to cloud format
3. Creates cloud service with automatic authentication
4. Continues with local service even if cloud fails (graceful degradation)

## Debugging

Check the browser console for authentication logs:
- "Attempting auto-login for: [email]"
- "Auto-login successful"
- "Token refresh successful"
- "Cloud service created successfully"

## Security Notes

- Tokens are stored in localStorage and will persist across browser sessions
- Environment variables should be kept secure and not committed to version control
- Consider using environment-specific `.env` files for different deployment environments
