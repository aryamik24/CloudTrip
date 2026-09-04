# CloudTrip frontend

React UI for the CloudTrip microservices. It talks to each backend **directly** (there is no API Gateway in this phase).

## Prerequisites

All four business services plus Eureka must be running, with CORS enabled:

| Service | Port |
|---|---|
| Eureka | 8761 |
| user-service | 8081 |
| flight-service | 8082 |
| hotel-service | 8083 |
| itinerary-service | 8084 |

CORS allows `http://localhost:5173` (this Vite app). Restart each service after the `CorsConfig` class was added.

## Run

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Notes

- Base URLs live in `src/config.js`. If an API Gateway is added later, point those four constants at the gateway (with service path prefixes) and leave the rest of the UI unchanged.
- There is no login screen; the backends do not have a security layer yet.
- Data refreshes when you switch tabs or after create / update / delete / generate completes.
