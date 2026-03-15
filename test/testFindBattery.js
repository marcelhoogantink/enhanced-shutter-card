import { LitElement, html, css } from "https://unpkg.com/lit@2/index.js?module";
// or if you're bundling alongside your enhanced-shutter-card:
// import { LitElement, html, css } from './lit/lit-core.min.js';

const ENTITY_REGISTRY_LIST = "config/entity_registry/list";

class DeviceGroupCard extends LitElement {

  // --- Reactive properties ---
  // LitElement re-renders automatically when these change.
  // 'hass' and 'config' follow the HA card convention.
  // '_entityMap' is internal state — the card re-renders when discovery completes.
  static properties = {
    hass:        { type: Object },
    config:      { type: Object },
    _entityMap:  { type: Object, state: true },
  };

  constructor() {
    super();
    this._entityMap      = {};
    this._discoveryDone  = false;
    this._registryCache  = null;
  }

  // --- HA Card API ---

  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error("device-group-card: 'entities' list is required.");
    }
    // Reset discovery whenever config changes
    this.config         = config;
    this._entityMap     = {};
    this._discoveryDone = false;
    this._registryCache = null;
  }

  // --- LitElement lifecycle ---

  // 'updated' fires after every render where a tracked property changed.
  // We use it to trigger discovery exactly once after hass first becomes available.
  updated(changedProperties) {
    if (changedProperties.has('hass') && this.hass && !this._discoveryDone) {
      this._discoveryDone = true;           // guard — prevent parallel/repeated calls
      this._resolveEntities(this.hass);     // async, sets _entityMap when done → re-render
    }
  }

  // --- Entity Resolution ---

  async _resolveEntities(hass) {
    if (!this._registryCache) {
      try {
        this._registryCache = await hass.callWS({ type: ENTITY_REGISTRY_LIST });
      } catch (e) {
        console.warn("device-group-card: entity registry lookup failed", e);
        return;
      }
    }

    const newMap = {};

    for (const item of this.config.entities) {
      const entityId = item.entity;

      // Full manual override — skip discovery entirely
      if (item.battery_entity && item.signal_entity) {
        newMap[entityId] = {
          battery_entity: item.battery_entity,
          signal_entity:  item.signal_entity,
        };
        continue;
      }

      const primary = this._registryCache.find(e => e.entity_id === entityId);
      if (!primary?.device_id) {
        newMap[entityId] = { battery_entity: null, signal_entity: null };
        continue;
      }

      const siblings = this._registryCache.filter(
        e => e.device_id === primary.device_id && e.entity_id !== entityId
      );

      const batteryEntry = siblings.find(
        e => e.device_class === "battery" || e.original_device_class === "battery"
      );
      const signalEntry = siblings.find(
        e => e.device_class === "signal_strength" || e.original_device_class === "signal_strength"
      );

      // Manual override wins per-field; discovery fills the rest
      newMap[entityId] = {
        battery_entity: item.battery_entity ?? batteryEntry?.entity_id ?? null,
        signal_entity:  item.signal_entity  ?? signalEntry?.entity_id  ?? null,
      };
    }

    // Assigning a new object triggers LitElement's reactive update.
    // This is why we build 'newMap' separately rather than mutating this._entityMap in place —
    // mutating the same object reference would NOT trigger a re-render.
    this._entityMap = newMap;
  }

  // --- Rendering ---
  // LitElement calls render() automatically whenever a reactive property changes.
  // No manual _render() calls needed.

  render() {
    if (!this.hass || !this.config) return html``;

    return html`
      <ha-card .header=${this.config.title ?? "Device Group"}>
        ${this.config.entities.map(item => this._renderRow(item))}
      </ha-card>
    `;
  }

  _renderRow(item) {
    const entityId = item.entity;
    const stateObj = this.hass.states[entityId];

    if (!stateObj) {
      return html`<div class="row error">Unknown entity: ${entityId}</div>`;
    }

    const { battery_entity, signal_entity } = this._entityMap[entityId] ?? {};

    const batteryState = battery_entity ? this.hass.states[battery_entity] : null;
    const signalState  = signal_entity  ? this.hass.states[signal_entity]  : null;

    const batteryPct = batteryState ? parseFloat(batteryState.state) : null;
    const signalDbm  = signalState  ? parseFloat(signalState.state)  : null;

    const name  = item.name ?? stateObj.attributes.friendly_name ?? entityId;
    const state = stateObj.state;

    return html`
      <div class="row">
        <span class="state-dot state-${state}"></span>
        <div class="info">
          <span class="name">${name}</span>
          <span class="entity-id">${entityId}</span>
        </div>
        <div class="diagnostics">
          ${batteryPct !== null ? this._batteryBadge(batteryPct) : ""}
          ${signalDbm  !== null ? this._signalBadge(signalDbm)   : ""}
        </div>
      </div>
    `;
  }

  _batteryBadge(pct) {
    const cls = pct <= 20 ? "badge-crit" : pct <= 40 ? "badge-warn" : "badge-ok";
    return html`<span class="badge ${cls}">${Math.round(pct)}%</span>`;
  }

  _signalBadge(dbm) {
    return html`<span class="signal">${Math.round(dbm)} dBm</span>`;
  }

  // --- Styles ---
  // LitElement scopes these to the shadow DOM automatically.
  // css`` is a tagged template — Lit can optimise and cache it across instances.

  static styles = css`
    :host { display: block; font-family: var(--primary-font-family, sans-serif); }
    ha-card { padding: 16px; }
    .row {
      display: flex; align-items: center; gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .row:last-child { border-bottom: none; }
    .state-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .state-open   { background: var(--success-color, #4caf50); }
    .state-closed { background: var(--disabled-text-color, #9e9e9e); }
    .info { flex: 1; overflow: hidden; }
    .name {
      display: block; font-size: 14px; font-weight: 500;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .entity-id { display: block; font-size: 11px; color: var(--secondary-text-color, #727272); }
    .diagnostics { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .badge { font-size: 12px; padding: 2px 6px; border-radius: 4px; font-weight: 500; }
    .badge-ok   { background: #e8f5e9; color: #2e7d32; }
    .badge-warn { background: #fff3e0; color: #e65100; }
    .badge-crit { background: #ffebee; color: #c62828; }
    .signal { font-size: 11px; color: var(--secondary-text-color, #727272); }
    .error  { color: var(--error-color, red); font-size: 12px; }
  `;

  // --- HACS / Lovelace registration ---

  static getConfigElement() {
    return document.createElement("device-group-card-editor");
  }

  static getStubConfig() {
    return {
      title: "My Devices",
      entities: [
        { entity: "cover.cover1" },
        { entity: "cover.cover2", battery_entity: "sensor.cover2_battery_override" },
      ],
    };
  }
}

customElements.define("device-group-card", DeviceGroupCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "device-group-card",
  name: "Device Group Card",
  description: "Shows a group of devices with auto-discovered battery and signal entities.",
});