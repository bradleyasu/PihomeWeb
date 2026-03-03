import { useEffect, useMemo, useState } from "react";
import { useEventIntrospection } from "../hooks/useEventIntrospection";
import { useTriggerEvent } from "../hooks/useTriggerEvent";
import { Bolt, ContentCopy, Check, Add, Remove } from "@mui/icons-material";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import "./EventManager.css";

// ─── Types ─────────────────────────────────────────────────────

/** A single field extracted from an introspection definition object */
type FieldDef = {
  name: string;
  type: string; // "string" | "integer" | "number" | "boolean" | "list" | "object" | "json" | "event" | ...
  required: boolean;
  description?: string | null;
};

/** Raw definition object as returned by the API:
 *  { type: "image", image: { type: "string", required: true, description: "..." }, ... }
 */
type RawDef = Record<string, any>;

/** Normalised event definition */
type EventDef = {
  type: string;
  fields: FieldDef[];
};

/** Parse a raw API definition into our normalised shape */
function parseDefinition(raw: RawDef): EventDef {
  const fields: FieldDef[] = Object.entries(raw)
    .filter(([key]) => key !== "type")
    .map(([name, meta]) => ({
      name,
      type: (meta?.type ?? "string").toLowerCase(),
      required: meta?.required ?? false,
      description: meta?.description ?? null,
    }));
  return { type: raw.type, fields };
}

// ─── Key-value field component (object / json) ───────────────────────

interface KVFieldProps {
  field: FieldDef;
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}

const KVField = ({ field, value, onChange }: KVFieldProps) => {
  const entries: [string, string][] = Object.entries(value ?? {});

  const setEntry = (i: number, k: string, v: string) => {
    const next = [...entries];
    next[i] = [k, v];
    onChange(Object.fromEntries(next));
  };

  const addEntry = () => {
    onChange({ ...(value ?? {}), "": "" });
  };

  const removeEntry = (i: number) => {
    const next = entries.filter((_, idx) => idx !== i);
    onChange(Object.fromEntries(next));
  };

  return (
    <div className="ef-field">
      <label className="ef-label">
        {field.name}
        {field.required && <span className="ef-required">*</span>}
        <span className="ef-type-badge">object</span>
      </label>
      <div className="ef-kv-items">
        {entries.map(([k, v], i) => (
          <div key={i} className="ef-kv-row">
            <input
              className="ef-input ef-kv-key"
              value={k}
              onChange={(e) => setEntry(i, e.target.value, v)}
              placeholder="key"
            />
            <input
              className="ef-input ef-kv-val"
              value={v}
              onChange={(e) => setEntry(i, k, e.target.value)}
              placeholder="value"
            />
            <button
              type="button"
              className="ef-list-btn ef-list-btn--remove"
              onClick={() => removeEntry(i)}
              title="Remove"
            >
              <Remove sx={{ fontSize: 14 }} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="ef-list-btn ef-list-btn--add"
          onClick={addEntry}
        >
          <Add sx={{ fontSize: 13 }} />
          Add property
        </button>
      </div>
      {field.description && <span className="ef-hint">{field.description}</span>}
    </div>
  );
};

// ─── Single field input ──────────────────────────────────────────────

interface FieldInputProps {
  field: FieldDef;
  value: any;
  onChange: (v: any) => void;
  allDefs: EventDef[];
}

const FieldInput = ({ field, value, onChange, allDefs }: FieldInputProps) => {
  const label = (
    <label className="ef-label">
      {field.name}
      {field.required && <span className="ef-required">*</span>}
      {field.type !== "string" && (
        <span className="ef-type-badge">{field.type}</span>
      )}
    </label>
  );

  // boolean → toggle
  if (field.type === "boolean") {
    return (
      <div className="ef-field">
        <div className="ef-toggle-row">
          <span className="ef-toggle-label">
            {field.name}
            {field.required && <span className="ef-required">*</span>}
          </span>
          <button
            type="button"
            className={"ef-toggle" + (value ? " on" : "")}
            onClick={() => onChange(!value)}
          >
            <span className="ef-toggle-knob" />
          </button>
        </div>
        {field.description && <span className="ef-hint">{field.description}</span>}
      </div>
    );
  }

  // integer / number → number input
  if (field.type === "integer" || field.type === "number") {
    return (
      <div className="ef-field">
        {label}
        <input
          className="ef-input"
          type="number"
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder={field.description || field.name}
        />
        {field.description && <span className="ef-hint">{field.description}</span>}
      </div>
    );
  }

  // list → event list (each item is an event)
  if (field.type === "list" || field.type === "array") {
    return (
      <EventListField
        field={field}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        allDefs={allDefs}
      />
    );
  }

  // object / json / dict → key-value pairs
  if (field.type === "object" || field.type === "json" || field.type === "dict") {
    return (
      <KVField
        field={field}
        value={value && typeof value === "object" ? value : {}}
        onChange={onChange}
      />
    );
  }

  // event → inline mini event selector
  if (field.type === "event") {
    const nestedType: string = value?.type ?? "";
    const nestedDef = allDefs.find((d) => d.type === nestedType) ?? null;

    return (
      <div className="ef-field ef-nested-event">
        {label}
        <div className="ef-nested-body">
          {/* Event type selector */}
          <select
            className="ef-select"
            value={nestedType}
            onChange={(e) =>
              onChange(e.target.value ? { type: e.target.value } : null)
            }
          >
            <option value="">— none —</option>
            {allDefs.map((d) => (
              <option key={d.type} value={d.type}>
                {d.type}
              </option>
            ))}
          </select>

          {/* Nested fields */}
          {nestedDef && nestedDef.fields.length > 0 && (
            <div className="ef-nested-fields">
              {nestedDef.fields.map((nf) => (
                <FieldInput
                  key={nf.name}
                  field={nf}
                  value={value?.[nf.name]}
                  onChange={(v) => onChange({ ...(value ?? { type: nestedType }), [nf.name]: v })}
                  allDefs={allDefs}
                />
              ))}
            </div>
          )}
        </div>
        {field.description && <span className="ef-hint">{field.description}</span>}
      </div>
    );
  }

  // Default: string / unknown → text input
  return (
    <div className="ef-field">
      {label}
      <input
        className="ef-input"
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.description || field.name}
      />
      {field.description && <span className="ef-hint">{field.description}</span>}
    </div>
  );
};

// ─── Event-list field component (list = list of events) ────────────────

interface EventListFieldProps {
  field: FieldDef;
  value: any[];
  onChange: (v: any[]) => void;
  allDefs: EventDef[];
}

const EventListField = ({ field, value, onChange, allDefs }: EventListFieldProps) => {
  const items: any[] = Array.isArray(value) ? value : [];

  const setItem = (i: number, v: any) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };

  const addItem = () => onChange([...items, { type: "" }]);

  const removeItem = (i: number) =>
    onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="ef-field">
      <label className="ef-label">
        {field.name}
        {field.required && <span className="ef-required">*</span>}
        <span className="ef-type-badge">event list</span>
      </label>
      <div className="ef-event-list-items">
        {items.map((item, i) => {
          const nestedType: string = item?.type ?? "";
          const nestedDef = allDefs.find((d) => d.type === nestedType) ?? null;
          return (
            <div key={i} className="ef-event-list-row">
              <div className="ef-event-list-header">
                <select
                  className="ef-select ef-event-list-select"
                  value={nestedType}
                  onChange={(e) =>
                    setItem(i, { type: e.target.value })
                  }
                >
                  <option value="">— select event —</option>
                  {allDefs.map((d) => (
                    <option key={d.type} value={d.type}>{d.type}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="ef-list-btn ef-list-btn--remove"
                  onClick={() => removeItem(i)}
                  title="Remove event"
                >
                  <Remove sx={{ fontSize: 14 }} />
                </button>
              </div>
              {nestedDef && nestedDef.fields.length > 0 && (
                <div className="ef-nested-fields ef-event-list-fields">
                  {nestedDef.fields.map((nf) => (
                    <FieldInput
                      key={nf.name}
                      field={nf}
                      value={item?.[nf.name]}
                      onChange={(v) =>
                        setItem(i, { ...(item ?? { type: nestedType }), [nf.name]: v })
                      }
                      allDefs={allDefs}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <button
          type="button"
          className="ef-list-btn ef-list-btn--add"
          onClick={addItem}
        >
          <Add sx={{ fontSize: 13 }} />
          Add event
        </button>
      </div>
      {field.description && <span className="ef-hint">{field.description}</span>}
    </div>
  );
};

// ─── EventManager ────────────────────────────────────────────────────

type ToastState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

const EventManager = () => {
  const introspection = useEventIntrospection();
  const trigger = useTriggerEvent();

  const [selectedType, setSelectedType] = useState<string>("");
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    introspection.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Parse raw API definitions into normalised EventDef[]
  const definitions: EventDef[] = useMemo(() => {
    const raw: RawDef[] = (introspection.data as any)?.data?.definitions ?? [];
    return raw.map(parseDefinition);
  }, [introspection.data]);

  const selectedDef = useMemo(
    () => definitions.find((d) => d.type === selectedType) ?? null,
    [definitions, selectedType]
  );

  const handleSelectEvent = (type: string) => {
    setSelectedType(type);
    const def = definitions.find((d) => d.type === type);
    if (def) {
      const init: Record<string, any> = {};
      def.fields.forEach((f) => {
        if (f.type === "boolean") init[f.name] = false;
        else if (f.type === "integer" || f.type === "number") init[f.name] = 0;
        else if (f.type === "list" || f.type === "array") init[f.name] = [];
        else if (f.type === "object" || f.type === "json" || f.type === "dict") init[f.name] = {};
        else init[f.name] = "";
      });
      setFieldValues(init);
    } else {
      setFieldValues({});
    }
  };

  const buildPayload = (): Record<string, any> | null => {
    if (!selectedType) return null;
    const payload: Record<string, any> = { type: selectedType };
    Object.entries(fieldValues).forEach(([k, v]) => {
      // Skip empty strings (optional fields left blank)
      if (v === "" || v === null || v === undefined) return;
      // Skip empty arrays / empty objects
      if (Array.isArray(v) && v.length === 0) return;
      if (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0) return;
      payload[k] = v;
    });
    return payload;
  };

  const payloadPreview = useMemo(() => {
    const p = buildPayload();
    return p ? JSON.stringify(p, null, 2) : "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, fieldValues]);

  const handleFire = () => {
    const payload = buildPayload();
    if (!payload) return;
    trigger.mutate(payload, {
      onSuccess: () =>
        setToast({ open: true, message: "Event fired successfully", severity: "success" }),
      onError: () =>
        setToast({ open: true, message: "Failed to fire event", severity: "error" }),
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(payloadPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const setField = (name: string, value: any) =>
    setFieldValues((prev) => ({ ...prev, [name]: value }));

  // ── Loading ─────────────────────────────────────────────────
  if (introspection.isLoading) {
    return (
      <div className="em-loading">
        <CircularProgress size={28} sx={{ color: "#818cf8" }} />
        <span>Loading event definitions…</span>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────
  if (introspection.isError || (!introspection.isLoading && !introspection.data)) {
    return (
      <div className="em-loading">
        <span className="em-error-text">Failed to load event definitions</span>
        <button className="em-retry-btn" onClick={() => introspection.mutate()}>
          Retry
        </button>
      </div>
    );
  }

  // ── Main ────────────────────────────────────────────────────
  return (
    <div className="em-page">

      {/* Event type selector */}
      <div className="em-selector-row">
        <select
          className="em-type-select"
          value={selectedType}
          onChange={(e) => handleSelectEvent(e.target.value)}
        >
          <option value="">— Select an event type —</option>
          {definitions.map((def) => (
            <option key={def.type} value={def.type}>
              {def.type}
            </option>
          ))}
        </select>
      </div>

      {/* Detail panel */}
      {selectedDef ? (
        <div className="em-detail">

          {/* Header */}
          <div className="em-detail-header">
            <div className="em-detail-title-row">
              <span className="em-event-type-name">{selectedDef.type}</span>
              <span className="em-field-count">
                {(selectedDef.fields ?? []).length} field{(selectedDef.fields ?? []).length !== 1 ? "s" : ""}
              </span>
            </div>

          </div>

          {/* Fields */}
          {(selectedDef.fields ?? []).length > 0 ? (
            <div className="em-fields">
              {(selectedDef.fields ?? []).map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  value={fieldValues[field.name]}
                  onChange={(v) => setField(field.name, v)}
                  allDefs={definitions}
                />
              ))}
            </div>
          ) : (
            <p className="em-no-fields">This event has no parameters.</p>
          )}

          {/* Payload preview */}
          <div className="em-preview">
            <div className="em-preview-header">
              <span className="em-section-label" style={{ margin: 0 }}>
                Payload Preview
              </span>
              <button className="em-copy-btn" onClick={handleCopy} title="Copy payload">
                {copied
                  ? <Check sx={{ fontSize: 13 }} />
                  : <ContentCopy sx={{ fontSize: 13 }} />
                }
              </button>
            </div>
            <pre className="em-preview-code">{payloadPreview}</pre>
          </div>

          {/* Fire button */}
          <button
            className="em-fire-btn"
            onClick={handleFire}
            disabled={trigger.isLoading}
          >
            {trigger.isLoading
              ? <CircularProgress size={15} sx={{ color: "#fff" }} />
              : <Bolt sx={{ fontSize: 17 }} />
            }
            Fire Event
          </button>

        </div>
      ) : (
        <div className="em-placeholder">
          <div className="em-placeholder-icon">⚡</div>
          <p className="em-placeholder-title">Select an event type</p>
          <p className="em-placeholder-sub">
            Choose from the list above to configure and trigger an event
          </p>
        </div>
      )}

      {/* Toast feedback */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default EventManager;