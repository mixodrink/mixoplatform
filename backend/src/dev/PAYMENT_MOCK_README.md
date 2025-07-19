# Payment Mock System Documentation

This mock payment system allows you to simulate the payment terminal behavior for frontend development and testing without requiring a real payment terminal.

## Overview

The mock system replicates the same payment flow as the production system:
1. Check terminal state
2. Start terminal
3. Read card
4. Authorize payment
5. Commit payment

## Endpoints

### Main Payment Endpoints
- `POST /api/payment/start` - Start payment process
- `POST /api/payment/stop` - Stop payment process
- `GET /api/payment/terminal/status` - Get terminal status

### Development Configuration Endpoints
- `POST /api/payment/dev/config` - Set mock configuration
- `GET /api/payment/dev/config` - Get current mock configuration
- `POST /api/payment/dev/scenario/:scenario` - Set predefined error scenarios

## Usage Examples

### 1. Basic Payment Flow
```javascript
// Start payment
const response = await fetch('/api/payment/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ authorizedAmount: 100 })
});

// Success response (200)
{
  "sessionId": "mock-session-1642512345678",
  "transactionId": "txn-abc123def",
  "authorizedAmount": 100,
  "commitAmount": 100,
  "status": "committed",
  "timestamp": "2025-01-18T10:30:00.000Z",
  "cardData": {
    "cardNumber": "**** **** **** 1234",
    "cardType": "VISA",
    "expiryDate": "12/25"
  },
  "terminalId": "MOCK-TERMINAL-001",
  "message": "Payment processed successfully"
}
```

### 2. Configure Mock Behavior
```javascript
// Set custom configuration
await fetch('/api/payment/dev/config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    config: {
      terminalOnline: true,
      terminalState: 'IDLE',
      responseDelay: 2000, // 2 seconds delay
      simulateErrors: {
        cardRead: true // Simulate card read error
      }
    }
  })
});
```

### 3. Use Predefined Error Scenarios
```javascript
// Simulate terminal offline
await fetch('/api/payment/dev/scenario/terminal-offline', { method: 'POST' });

// Simulate card read error
await fetch('/api/payment/dev/scenario/card-read-error', { method: 'POST' });

// Reset to normal operation
await fetch('/api/payment/dev/scenario/reset', { method: 'POST' });
```

## Available Error Scenarios

| Scenario | Description |
|----------|-------------|
| `terminal-offline` | Terminal is offline |
| `terminal-busy` | Terminal is busy/not idle |
| `card-read-error` | Card reading fails |
| `authorization-error` | Payment authorization fails |
| `commit-error` | Payment commit fails |
| `all-errors` | Enable all error types |
| `reset` | Reset to normal operation |

## Response Status Codes

- `200` - Success
- `400` - Bad request (invalid amount, etc.)
- `423` - Terminal unavailable (not idle/offline)
- `500` - Server error
- `503` - Service unavailable

## Error Response Format
```json
{
  "error": true,
  "message": "Error description"
}
```

## Terminal Status Response
```json
{
  "online": true,
  "state": "IDLE",
  "terminalId": "MOCK-TERMINAL-001",
  "lastUpdate": "2025-01-18T10:30:00.000Z"
}
```

## Integration in Your Project

1. **For Development**: Use the mock router instead of the production payment router
2. **For Testing**: Configure different scenarios to test error handling
3. **For Demo**: Show realistic payment flow with customizable timing

### Example Integration in Server
```typescript
// In your server.ts or main app file
if (process.env.NODE_ENV === 'development') {
  app.use('/api/payment', paymentMockRouter);
} else {
  app.use('/api/payment', paymentRouter); // Production router
}
```

## Frontend Testing Examples

### React Hook for Payment
```javascript
const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startPayment = async (amount) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/payment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorizedAmount: amount })
      });
      
      if (!response.ok) {
        throw new Error(`Payment failed: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { startPayment, loading, error };
};
```

### Testing Different Scenarios
```javascript
// Test terminal offline scenario
await fetch('/api/payment/dev/scenario/terminal-offline', { method: 'POST' });
// Now test how your frontend handles this error

// Test card read error
await fetch('/api/payment/dev/scenario/card-read-error', { method: 'POST' });
// Test error handling in your UI

// Reset for next test
await fetch('/api/payment/dev/scenario/reset', { method: 'POST' });
```

## Configuration Options

```typescript
interface MockConfig {
  terminalOnline: boolean;        // Terminal connectivity
  terminalState: 'IDLE' | 'BUSY' | 'OFFLINE'; // Terminal state
  simulateErrors: {
    terminalCheck: boolean;       // Fail terminal check
    terminalStart: boolean;       // Fail terminal start
    cardRead: boolean;           // Fail card reading
    authorize: boolean;          // Fail authorization
    commit: boolean;             // Fail commit
    stop: boolean;               // Fail stop
  };
  responseDelay: number;         // Response delay in milliseconds
  cardData: {
    cardNumber: string;          // Mock card number
    cardType: string;            // Mock card type
    expiryDate: string;          // Mock expiry date
  };
}
```

This mock system provides a comprehensive testing environment for your payment frontend without requiring actual payment hardware.
