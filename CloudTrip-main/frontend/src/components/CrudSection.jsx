import { useCallback, useEffect, useState } from "react";
import RecordForm from "./RecordForm";

export default function CrudSection({
  addLabel,
  emptyMessage,
  columns,
  fields,
  api,
  onBanner,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setRows([]);
      onBanner({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }, [api, onBanner]);

  useEffect(() => {
    load();
  }, [load]);

  function startCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(row) {
    setEditing(row);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleSubmit(payload) {
    setSaving(true);
    try {
      if (editing) {
        await api.update(editing.id, payload);
        onBanner({ type: "success", message: "Updated successfully" });
      } else {
        await api.create(payload);
        onBanner({ type: "success", message: "Created successfully" });
      }
      closeForm();
      await load();
    } catch (err) {
      onBanner({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this record?")) return;
    try {
      await api.remove(id);
      onBanner({ type: "success", message: "Deleted successfully" });
      await load();
    } catch (err) {
      onBanner({ type: "error", message: err.message });
    }
  }

  return (
    <div>
      <button type="button" className="btn btn-primary" onClick={startCreate}>
        {addLabel}
      </button>

      {showForm && (
        <RecordForm
          fields={fields}
          initial={editing}
          submitLabel={editing ? "Update" : "Create"}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="empty">{emptyMessage}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="actions">
                    <button
                      type="button"
                      className="btn btn-edit"
                      onClick={() => startEdit(row)}
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
