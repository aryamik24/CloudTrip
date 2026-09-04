# ✈️ CloudTrip

CloudTrip is a Spring Boot microservices application for managing users, flights, hotels, and travel itineraries.

The project demonstrates a distributed architecture using **Spring Cloud Eureka** for service discovery, **OpenFeign** for communication between microservices, **springdoc-openapi** for API documentation, centralized exception handling, and a lightweight **React** frontend.

---

## 🏗️ Architecture

CloudTrip consists of five independent Maven-based backend services, plus a frontend:

| Service | Port | Responsibility |
|---|---|---|
| 🔎 Eureka Server | 8761 | Service discovery and registration |
| 👤 User Service | 8081 | User management |
| ✈️ Flight Service | 8082 | Flight management and route searching |
| 🏨 Hotel Service | 8083 | Hotel management and location searching |
| 🗺️ Itinerary Service | 8084 | Itinerary management, validation, and cost generation |
| 🖥️ Frontend (React + Vite) | 5173 | Web UI for all four services |

### Service Communication

- Eureka Server provides service discovery and registration.
- All four business services register themselves with Eureka.
- **OpenFeign** is used for service-to-service communication. The Itinerary Service is the coordinator:
  - **`FlightClient`** → retrieves flight details (and price) from Flight Service.
  - **`HotelClient`** → retrieves hotel details (and nightly price) from Hotel Service.
  - **`UserClient`** → validates that a `userId` exists in User Service before an itinerary can be created.
- The frontend calls all four business services **directly** on their own ports (no API Gateway in this phase — see [Not in Scope](#-not-in-scope-for-this-phase)), so **CORS** is enabled on each service for the frontend's origin.

```
                    ┌──────────────────┐
                    │   Eureka Server   │
                    │      :8761        │
                    └─────────┬────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
      ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
      │User Service │  │Flight       │  │Hotel        │
      │   :8081     │  │Service      │  │Service      │
      │             │  │   :8082     │  │   :8083     │
      └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
             │                │                │
             │   OpenFeign    │   OpenFeign    │   OpenFeign
             │  (UserClient)  │ (FlightClient) │ (HotelClient)
             └────────────────┼────────────────┘
                              ▼
                       ┌─────────────────┐
                       │ Itinerary       │
                       │ Service :8084   │
                       └────────┬────────┘
                                │
                                │ REST (browser)
                                ▼
                       ┌─────────────────┐
                       │ Frontend (React)│
                       │     :5173       │
                       └─────────────────┘
```

---

## 🚀 Features

### 👤 User Management
- Create, retrieve (all / by ID), update, and delete users

### ✈️ Flight Management
- Create, retrieve (all / by ID), update, and delete flights
- Search flights by origin and destination

### 🏨 Hotel Management
- Create, retrieve (all / by ID), update, and delete hotels
- Search hotels by location

### 🗺️ Itinerary Management
- Create, retrieve (all / by ID), update, and delete itineraries
- **User validation on create** — `createItinerary` calls User Service via `UserClient` first; an unknown `userId` is rejected with a clean 404-style JSON error instead of silently saving.
- **Cost generation combining flight + hotel** — `POST /itineraries/{id}/generate`:
  1. Fetches the flight via `FlightClient` and adds its `price`.
  2. If a `hotelId` is set, fetches the hotel via `HotelClient`, computes nights between `startDate` and `endDate` (minimum 1 night), and adds `nights × pricePerNight`.
  3. Sets `status` to `GENERATED` and persists the updated `totalCost`.

When an itinerary is first created, it starts with:
- Status: `DRAFT`
- Total Cost: `0.0`

### 📘 API Documentation (Swagger / OpenAPI)
Every business service exposes interactive API docs via **springdoc-openapi** (`springdoc-openapi-starter-webmvc-ui`), with `@Tag`/`@Operation` annotations on all controllers:

| Service | Swagger UI | Raw OpenAPI JSON |
|---|---|---|
| User Service | http://localhost:8081/swagger-ui.html | http://localhost:8081/v3/api-docs |
| Flight Service | http://localhost:8082/swagger-ui.html | http://localhost:8082/v3/api-docs |
| Hotel Service | http://localhost:8083/swagger-ui.html | http://localhost:8083/v3/api-docs |
| Itinerary Service | http://localhost:8084/swagger-ui.html | http://localhost:8084/v3/api-docs |

### 🧯 Centralized Error Handling
Each service has a `ResourceNotFoundException` + `@RestControllerAdvice`-based `GlobalExceptionHandler` that returns consistent JSON errors instead of raw stack traces or generic 500s:

```json
{
  "timestamp": "2026-09-04T10:15:30",
  "status": 404,
  "error": "Not Found",
  "message": "Itinerary not found with id: 42"
}
```

Handled cases:
- **`ResourceNotFoundException`** → 404 with a descriptive message
- **`FeignException`** (Itinerary Service only, since it's the only one calling other services) → the dependent service's actual status code (e.g. a missing flight/hotel/user surfaces as 404), wrapped in the same JSON shape
- **`MethodArgumentNotValidException`** → 400 with field-level validation messages
- **Any other exception** → 500 with a generic message (no stack trace leaked to the client)

### 🖥️ Frontend (React + Vite)
A simple web UI for all four services — see [Frontend](#-frontend) below for setup.

---

## 📡 API Endpoints

### User Service — :8081
| Method | Endpoint | Description |
|---|---|---|
| POST | `/users` | Create a user |
| GET | `/users` | Get all users |
| GET | `/users/{id}` | Get user by ID |
| PUT | `/users/{id}` | Update a user |
| DELETE | `/users/{id}` | Delete a user |

### Flight Service — :8082
| Method | Endpoint | Description |
|---|---|---|
| POST | `/flights` | Create a flight |
| GET | `/flights` | Get all flights |
| GET | `/flights/{id}` | Get flight by ID |
| PUT | `/flights/{id}` | Update a flight |
| DELETE | `/flights/{id}` | Delete a flight |
| GET | `/flights/search?from={from}&to={to}` | Search flights |

### Hotel Service — :8083
| Method | Endpoint | Description |
|---|---|---|
| POST | `/hotels` | Create a hotel |
| GET | `/hotels` | Get all hotels |
| GET | `/hotels/{id}` | Get hotel by ID |
| PUT | `/hotels/{id}` | Update a hotel |
| DELETE | `/hotels/{id}` | Delete a hotel |
| GET | `/hotels/search?location={location}` | Search hotels |

### Itinerary Service — :8084
| Method | Endpoint | Description |
|---|---|---|
| POST | `/itineraries` | Create an itinerary (validates `userId` via User Service) |
| GET | `/itineraries` | Get all itineraries |
| GET | `/itineraries/{id}` | Get itinerary by ID |
| PUT | `/itineraries/{id}` | Update an itinerary |
| DELETE | `/itineraries/{id}` | Delete an itinerary |
| POST | `/itineraries/{id}/generate` | Generate total cost from flight + hotel data |

Full interactive documentation and request/response schemas are available via each service's [Swagger UI](#-api-documentation-swagger--openapi).

---

## 🗃️ Data Models

**User**
- id, name, email, password, phone

**Flight**
- id, airline, flightNumber, fromLocation, toLocation, departureTime, arrivalTime, price, availableSeats

**Hotel**
- id, name, location, description, rating, pricePerNight, availableRooms

**Itinerary**
- id, userId, **flightId**, **hotelId**, fromLocation, toLocation, startDate, endDate, budget, totalCost, status

> `hotelId` is a newly added field, resolved via `HotelClient` during cost generation.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| ☕ Java | Programming language |
| 🌱 Spring Boot 4.1.1 | Microservice development |
| 🗄️ Spring Data JPA | Database persistence |
| 🔎 Spring Cloud Eureka | Service discovery |
| 🔗 Spring Cloud OpenFeign | Service-to-service communication |
| 📘 springdoc-openapi 3.1.0 | Swagger / OpenAPI documentation |
| 🐬 MySQL | Database |
| 📦 Maven | Build and dependency management |
| ⚛️ React 18 + Vite | Frontend UI |

---

## 🗄️ Database Architecture

Each business service uses its own MySQL database:

```
MySQL :3306
│
├── cloudtrip_users
├── cloudtrip_flights
├── cloudtrip_hotels
└── cloudtrip_itineraries
```

This keeps the data of each microservice logically separated. Databases must be created manually before first run (Hibernate creates the tables, not the schemas):

```sql
CREATE DATABASE IF NOT EXISTS cloudtrip_users;
CREATE DATABASE IF NOT EXISTS cloudtrip_flights;
CREATE DATABASE IF NOT EXISTS cloudtrip_hotels;
CREATE DATABASE IF NOT EXISTS cloudtrip_itineraries;
```

---

## ⚙️ Prerequisites

Before running CloudTrip, make sure you have:
- Java
- Maven
- MySQL (running on `localhost:3306`)
- Node.js + npm (for the frontend)
- Git

Eureka runs on `localhost:8761`.

---

## ▶️ Running the Project

### Backend

1. **Start MySQL** and create the four databases (see [Database Architecture](#-database-architecture)).

2. **Start Eureka Server**
   ```bash
   cd eureka-server
   ./mvnw spring-boot:run
   ```
   Eureka Dashboard: http://localhost:8761

3. **Start User Service**
   ```bash
   cd user-service
   ./mvnw spring-boot:run
   ```

4. **Start Flight Service**
   ```bash
   cd flight-service
   ./mvnw spring-boot:run
   ```

5. **Start Hotel Service**
   ```bash
   cd hotel-service
   ./mvnw spring-boot:run
   ```

6. **Start Itinerary Service**
   ```bash
   cd itinerary-service
   ./mvnw spring-boot:run
   ```

Each service should be started in its own terminal window, and each should register with Eureka (visible on the dashboard) within a few seconds of starting.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The frontend calls each backend service directly using the base URLs configured in `frontend/src/config.js` — update that file if you change any service's port.

> The backend services must already be running (and CORS-enabled for `http://localhost:5173`) for the frontend to load data.

---

## 🧪 Testing

Run the tests for each backend service using:
```bash
./mvnw test
```

### Manual end-to-end check
1. Create a user, a flight, and a hotel (via Swagger UI or the frontend).
2. Create an itinerary using their real IDs — confirm `status: DRAFT`, `totalCost: 0.0`.
3. Try creating an itinerary with a non-existent `userId` — confirm a clean 404 JSON error, not a 500 or stack trace.
4. Call `POST /itineraries/{id}/generate` — confirm `totalCost` = flight price + (nights × hotel price/night), and `status: GENERATED`.

---

## 🔧 Configuration

Each backend service contains its configuration in:
```
src/main/resources/application.properties
```

The default local development configuration uses:
```
MySQL  → localhost:3306
Eureka → localhost:8761
```

Each service also has a `CorsConfig` bean (`config/CorsConfig.java`) permitting requests from the frontend's origin (`http://localhost:5173`, plus `null` for direct `file://` access). Update the allowed origins there if the frontend runs on a different port or host.

**Security Note:** Do not commit database passwords, API keys, or other secrets to GitHub. Use environment variables or local configuration for sensitive values.

---

## 📁 Project Structure

```
CloudTrip/
│
├── eureka-server/
│
├── user-service/
│   └── src/main/java/com/cloudtrip/userservice/
│       ├── config/          (OpenApiConfig, CorsConfig)
│       ├── controller/
│       ├── entity/
│       ├── exception/       (ResourceNotFoundException, GlobalExceptionHandler)
│       ├── repository/
│       └── service/
│
├── flight-service/          (same structure as user-service)
│
├── hotel-service/           (same structure as user-service)
│
├── itinerary-service/
│   └── src/main/java/com/cloudtrip/itineraryservice/
│       ├── client/          (FlightClient, HotelClient, UserClient)
│       ├── config/          (OpenApiConfig, CorsConfig)
│       ├── controller/
│       ├── dto/             (FlightResponse, HotelResponse, UserResponse)
│       ├── entity/
│       ├── exception/
│       ├── repository/
│       └── service/
│
├── frontend/
│   ├── src/
│   │   ├── components/      (CrudSection, ItinerariesSection, RecordForm, Banner)
│   │   ├── api.js
│   │   ├── config.js
│   │   ├── modules.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🌐 Service Overview

```
                 CloudTrip Microservices
                         │
                         ▼
                ┌─────────────────┐
                │  Eureka Server  │
                │      :8761      │
                └────────┬────────┘
                         │
       ┌─────────────────┼──────────────────┐
       │                 │                  │
       ▼                 ▼                  ▼
 ┌───────────┐     ┌───────────┐      ┌───────────┐
 │   User    │     │   Flight  │      │   Hotel   │
 │  :8081    │     │   :8082   │      │   :8083   │
 └─────┬─────┘     └─────┬─────┘      └─────┬─────┘
       │                 │                  │
       │  OpenFeign      │  OpenFeign       │  OpenFeign
       └─────────────────┼──────────────────┘
                         ▼
                  ┌──────────────┐
                  │  Itinerary   │
                  │    :8084     │
                  └──────┬───────┘
                         │ REST
                         ▼
                  ┌──────────────┐
                  │  Frontend    │
                  │    :5173     │
                  └──────────────┘
```

---

## 📌 Project Highlights

- Microservices-based architecture with independent databases per service
- Service discovery with Eureka
- RESTful APIs documented with Swagger/OpenAPI on every service
- OpenFeign-based service-to-service communication (Flight, Hotel, and User clients)
- Centralized, consistent JSON error handling across all services
- User validation and combined flight + hotel cost calculation for itineraries
- CRUD operations for users, flights, hotels, and itineraries
- A React + Vite frontend for interacting with all services
- Maven-based project structure with automated service-level testing

---

## 🚧 Not in Scope for This Phase

- **API Gateway** (e.g. Spring Cloud Gateway) — the frontend and any external clients call each service directly on its own port for now.
- **Authentication / Authorization** (e.g. Spring Security, JWT) — no login layer exists yet; all endpoints are open.

---

## 📄 License

This project is intended for educational and development purposes.
