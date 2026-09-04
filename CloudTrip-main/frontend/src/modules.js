import { CONFIG } from "./config";
import { apiRequest } from "./api";

export const UsersApi = {
  list: () => apiRequest(CONFIG.USER_API, "/users"),
  get: (id) => apiRequest(CONFIG.USER_API, `/users/${id}`),
  create: (user) => apiRequest(CONFIG.USER_API, "/users", "POST", user),
  update: (id, user) => apiRequest(CONFIG.USER_API, `/users/${id}`, "PUT", user),
  remove: (id) => apiRequest(CONFIG.USER_API, `/users/${id}`, "DELETE"),
};

export const FlightsApi = {
  list: () => apiRequest(CONFIG.FLIGHT_API, "/flights"),
  get: (id) => apiRequest(CONFIG.FLIGHT_API, `/flights/${id}`),
  create: (flight) => apiRequest(CONFIG.FLIGHT_API, "/flights", "POST", flight),
  update: (id, flight) =>
    apiRequest(CONFIG.FLIGHT_API, `/flights/${id}`, "PUT", flight),
  remove: (id) => apiRequest(CONFIG.FLIGHT_API, `/flights/${id}`, "DELETE"),
  search: (from, to) =>
    apiRequest(
      CONFIG.FLIGHT_API,
      `/flights/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    ),
};

export const HotelsApi = {
  list: () => apiRequest(CONFIG.HOTEL_API, "/hotels"),
  get: (id) => apiRequest(CONFIG.HOTEL_API, `/hotels/${id}`),
  create: (hotel) => apiRequest(CONFIG.HOTEL_API, "/hotels", "POST", hotel),
  update: (id, hotel) =>
    apiRequest(CONFIG.HOTEL_API, `/hotels/${id}`, "PUT", hotel),
  remove: (id) => apiRequest(CONFIG.HOTEL_API, `/hotels/${id}`, "DELETE"),
  search: (location) =>
    apiRequest(
      CONFIG.HOTEL_API,
      `/hotels/search?location=${encodeURIComponent(location)}`
    ),
};

export const ItinerariesApi = {
  list: () => apiRequest(CONFIG.ITINERARY_API, "/itineraries"),
  get: (id) => apiRequest(CONFIG.ITINERARY_API, `/itineraries/${id}`),
  create: (itinerary) =>
    apiRequest(CONFIG.ITINERARY_API, "/itineraries", "POST", itinerary),
  update: (id, itinerary) =>
    apiRequest(CONFIG.ITINERARY_API, `/itineraries/${id}`, "PUT", itinerary),
  remove: (id) =>
    apiRequest(CONFIG.ITINERARY_API, `/itineraries/${id}`, "DELETE"),
  generate: (id) =>
    apiRequest(CONFIG.ITINERARY_API, `/itineraries/${id}/generate`, "POST"),
};
