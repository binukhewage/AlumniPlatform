# API Key & Permission System

The Alumni Platform uses a granular API Key system to authenticate and authorize requests for different clients (e.g., Analytics Dashboard, AR App).

## Authentication
Every API request (except `/api/auth` and `/api/api-keys`) requires a valid API key passed via the `x-api-key` header.

```http
GET /api/profile HTTP/1.1
Host: api.example.com
x-api-key: your-api-key-here
```

## Permission Scopes

The API enforce fine-grained permissions. Clients calling the endpoints must possess a key with the corresponding permission:

| Permission Name      | Access Scope                                                              | Affected Endpoints                                                               |
|----------------------|---------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| `read:alumni`        | Creating, reading, updating matching Alumni Profiles and Sub-Resources.   | `/api/alumni` |
| `read:analytics`     | Fetching statistics and aggregated insights.                              | `/api/analytics/*`                                                               |
| `read:alumni_of_day` | Public resources highlighting the featured alumni.                        | `/api/public/*`                                                                  |
| `*`                  | Universal bypass, grants access to all API key protected endpoints.       | Applies globally. The frontend environment key uses this for convenience.        |

## Error Responses

1. **Missing Key**
   - **401 Unauthorized**: `"API key required"`
2. **Invalid / Revoked Key**
   - **403 Forbidden**: `"Invalid or revoked API key"`
3. **Insufficient Scope**
   - **403 Forbidden**: `"Forbidden: request requires 'read:xyz' permission but API key lacks it."`

## Managing Keys
Platform admins can generate and revoke keys by calling the `/api/api-keys` endpoints, optionally supplying the `permissions` object in the POST payload.
