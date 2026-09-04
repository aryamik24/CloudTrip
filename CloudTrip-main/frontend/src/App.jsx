import { useCallback, useState } from "react";
import Banner from "./components/Banner";
import CrudSection from "./components/CrudSection";
import ItinerariesSection from "./components/ItinerariesSection";
import { FlightsApi, HotelsApi, UsersApi } from "./modules";

const TABS = [
  { id: "users", label: "Users" },
  { id: "flights", label: "Flights" },
  { id: "hotels", label: "Hotels" },
  { id: "itineraries", label: "Itineraries" },
];

const USER_FIELDS = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "phone", label: "Phone", type: "text" },
];

const FLIGHT_FIELDS = [
  { name: "airline", label: "Airline", type: "text", required: true },
  { name: "flightNumber", label: "Flight number", type: "text", required: true },
  { name: "fromLocation", label: "From", type: "text", required: true },
  { name: "toLocation", label: "To", type: "text", required: true },
  {
    name: "departureTime",
    label: "Departure time",
    type: "text",
    required: true,
    placeholder: "e.g. 2026-09-10T14:30",
  },
  {
    name: "arrivalTime",
    label: "Arrival time",
    type: "text",
    required: true,
    placeholder: "e.g. 2026-09-10T16:45",
  },
  { name: "price", label: "Price", type: "number", required: true, step: "0.01", min: "0" },
  {
    name: "availableSeats",
    label: "Available seats",
    type: "number",
    required: true,
    step: "1",
    min: "1",
  },
];

const HOTEL_FIELDS = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "location", label: "Location", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
  {
    name: "rating",
    label: "Rating",
    type: "number",
    required: true,
    step: "0.1",
    min: "0.1",
    max: "5",
  },
  {
    name: "pricePerNight",
    label: "Price per night",
    type: "number",
    required: true,
    step: "0.01",
    min: "0",
  },
  {
    name: "availableRooms",
    label: "Available rooms",
    type: "number",
    required: true,
    step: "1",
    min: "1",
  },
];

export default function App() {
  const [tab, setTab] = useState("users");
  const [banner, setBanner] = useState(null);

  const onBanner = useCallback((next) => setBanner(next), []);

  return (
    <div className="app">
      <header>
        <h1>✈️ CloudTrip</h1>
        <nav>
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? "active" : ""}
              onClick={() => {
                setBanner(null);
                setTab(item.id);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main>
        <Banner banner={banner} onDismiss={() => setBanner(null)} />

        {tab === "users" && (
          <CrudSection
            addLabel="+ Add User"
            emptyMessage="No users yet — add one above."
            api={UsersApi}
            fields={USER_FIELDS}
            onBanner={onBanner}
            columns={[
              { key: "id", label: "ID" },
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
            ]}
          />
        )}

        {tab === "flights" && (
          <CrudSection
            addLabel="+ Add Flight"
            emptyMessage="No flights yet — add one above."
            api={FlightsApi}
            fields={FLIGHT_FIELDS}
            onBanner={onBanner}
            columns={[
              { key: "id", label: "ID" },
              { key: "airline", label: "Airline" },
              { key: "flightNumber", label: "Flight #" },
              {
                key: "route",
                label: "Route",
                render: (row) => `${row.fromLocation} → ${row.toLocation}`,
              },
              { key: "departureTime", label: "Departure" },
              { key: "arrivalTime", label: "Arrival" },
              { key: "price", label: "Price" },
              { key: "availableSeats", label: "Seats" },
            ]}
          />
        )}

        {tab === "hotels" && (
          <CrudSection
            addLabel="+ Add Hotel"
            emptyMessage="No hotels yet — add one above."
            api={HotelsApi}
            fields={HOTEL_FIELDS}
            onBanner={onBanner}
            columns={[
              { key: "id", label: "ID" },
              { key: "name", label: "Name" },
              { key: "location", label: "Location" },
              { key: "rating", label: "Rating" },
              { key: "pricePerNight", label: "Price/night" },
              { key: "availableRooms", label: "Rooms" },
            ]}
          />
        )}

        {tab === "itineraries" && <ItinerariesSection onBanner={onBanner} />}
      </main>
    </div>
  );
}
