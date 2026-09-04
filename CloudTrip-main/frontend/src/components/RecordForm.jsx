import { useEffect, useState } from "react";

function coerceValue(field, raw) {
  if (field.type === "number") {
    if (raw === "" || raw == null) return "";
    const n = Number(raw);
    return Number.isNaN(n) ? raw : n;
  }
  return raw;
}

export default function RecordForm({
  fields,
  initial,
  submitLabel,
  saving,
  onSubmit,
  onCancel,
}) {
  const defaults = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const [form, setForm] = useState({ ...defaults, ...(initial || {}) });

  useEffect(() => {
    setForm({
      ...Object.fromEntries(fields.map((f) => [f.name, ""])),
      ...(initial || {}),
    });
  }, [initial, fields]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field.name]: coerceValue(field, value) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {};
    for (const field of fields) {
      payload[field.name] = form[field.name];
    }
    onSubmit(payload);
  }

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <label key={field.name} className="field">
          <span>{field.label}</span>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={form[field.name] ?? ""}
              onChange={(e) => handleChange(field, e.target.value)}
              required={field.required}
              rows={3}
            />
          ) : (
            <input
              name={field.name}
              type={field.type}
              value={form[field.name] ?? ""}
              onChange={(e) => handleChange(field, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              step={field.step}
              min={field.min}
              max={field.max}
            />
          )}
        </label>
      ))}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
        <button type="button" className="btn" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
