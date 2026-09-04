import { useCallback, useEffect, useState } from "react";
import { FlightsApi, HotelsApi, ItinerariesApi, UsersApi } from "../modules";

function emptyForm() {
  return {
    userId: "",
    flightId: "",
    hotelId: "",
    fromLocation: "",
    toLocation: "",
    startDate: "",
    endDate: "",
    budget: "",
  };
}

function formatUser(user) {
  return `#${user.id} — ${user.name} (${user.email})`;
}

function formatFlight(flight) {
  return `#${flight.id} — ${flight.flightNumber} ${flight.fromLocation}→${flight.toLocation} ($${flight.price})`;
}

function formatHotel(hotel) {
  return `#${hotel.id} — ${hotel.name}, ${hotel.location} ($${hotel.pricePerNight}/night)`;
}

export default function ItinerariesSection({ onBanner }) {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formReady, setFormReady] = useState(false);

  const loadTable = useCallback(async () => {
    setLoading(true);
    try {
      const [data, userList] = await Promise.all([
        ItinerariesApi.list(),
        UsersApi.list().catch(() => []),
      ]);
      setRows(Array.isArray(data) ? data : []);
      setUsers(Array.isArray(userList) ? userList : []);
    } catch (err) {
      setRows([]);
      onBanner({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }, [onBanner]);

  useEffect(() => {
    loadTable();
  }, [loadTable]);

  async function openForm(record = null) {
    try {
      const [userList, flightList, hotelList] = await Promise.all([
        UsersApi.list(),
        FlightsApi.list(),
        HotelsApi.list(),
      ]);
      setUsers(userList || []);
      setFlights(flightList || []);
      setHotels(hotelList || []);
      setEditing(record);
      setForm(
        record
          ? {
              userId: record.userId ?? "",
              flightId: record.flightId ?? "",
              hotelId: record.hotelId ?? "",
              fromLocation: record.fromLocation ?? "",
              toLocation: record.toLocation ?? "",
              startDate: record.startDate ?? "",
              endDate: record.endDate ?? "",
              budget: record.budget ?? "",
            }
          : emptyForm()
      );
      setFormReady(true);
      setShowForm(true);
    } catch (err) {
      setShowForm(false);
      setFormReady(false);
      onBanner({ type: "error", message: err.message });
    }
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setFormReady(false);
    setForm(emptyForm());
  }

  function handleChange(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function buildPayload() {
    return {
      userId: Number(form.userId),
      flightId: Number(form.flightId),
      hotelId: Number(form.hotelId),
      fromLocation: form.fromLocation,
      toLocation: form.toLocation,
      startDate: form.startDate,
      endDate: form.endDate,
      budget: Number(form.budget),
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editing) {
        await ItinerariesApi.update(editing.id, payload);
        onBanner({ type: "success", message: "Itinerary updated successfully" });
      } else {
        await ItinerariesApi.create(payload);
        onBanner({ type: "success", message: "Itinerary created successfully" });
      }
      closeForm();
      await loadTable();
    } catch (err) {
      onBanner({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this itinerary?")) return;
    try {
      await ItinerariesApi.remove(id);
      onBanner({ type: "success", message: "Itinerary deleted successfully" });
      await loadTable();
    } catch (err) {
      onBanner({ type: "error", message: err.message });
    }
  }

  async function handleGenerate(id) {
    setGeneratingId(id);
    try {
      await ItinerariesApi.generate(id);
      onBanner({ type: "success", message: "Itinerary cost generated" });
      await loadTable();
    } catch (err) {
      onBanner({ type: "error", message: err.message });
    } finally {
      setGeneratingId(null);
    }
  }

  const userLabel = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? formatUser(user) : `#${id}`;
  };

  return (
    <div>
      <button type="button" className="btn btn-primary" onClick={() => openForm()}>
        + Add Itinerary
      </button>

      {showForm && formReady && (
        <form className="record-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>User</span>
            <select
              required
              value={form.userId}
              onChange={(e) => handleChange("userId", e.target.value)}
            >
              <option value="">Select a user</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {formatUser(u)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Flight</span>
            <select
              required
              value={form.flightId}
              onChange={(e) => handleChange("flightId", e.target.value)}
            >
              <option value="">Select a flight</option>
              {flights.map((f) => (
                <option key={f.id} value={f.id}>
                  {formatFlight(f)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Hotel</span>
            <select
              required
              value={form.hotelId}
              onChange={(e) => handleChange("hotelId", e.target.value)}
            >
              <option value="">Select a hotel</option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {formatHotel(h)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>From</span>
            <input
              type="text"
              required
              value={form.fromLocation}
              onChange={(e) => handleChange("fromLocation", e.target.value)}
            />
          </label>
          <label className="field">
            <span>To</span>
            <input
              type="text"
              required
              value={form.toLocation}
              onChange={(e) => handleChange("toLocation", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Start date</span>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </label>
          <label className="field">
            <span>End date</span>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Budget</span>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.budget}
              onChange={(e) => handleChange("budget", e.target.value)}
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editing ? "Update" : "Create"}
            </button>
            <button type="button" className="btn" onClick={closeForm} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="empty">No itineraries yet — add one above.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Route</th>
                <th>Dates</th>
                <th>Budget</th>
                <th>Total Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{userLabel(row.userId)}</td>
                  <td>
                    {row.fromLocation} → {row.toLocation}
                  </td>
                  <td>
                    {row.startDate} → {row.endDate}
                  </td>
                  <td>{row.budget}</td>
                  <td>{row.totalCost ?? "—"}</td>
                  <td>{row.status ?? "—"}</td>
                  <td className="actions">
                    <button
                      type="button"
                      className="btn btn-edit"
                      onClick={() => openForm(row)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-delete"
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-generate"
                      disabled={generatingId === row.id}
                      onClick={() => handleGenerate(row.id)}
                    >
                      {generatingId === row.id ? "Generating…" : "Generate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
