import { LitElement, html, css } from "https://unpkg.com/lit@2.7.0/index.js?module";

class MultiListPanel extends LitElement {
  static properties = {
    hass: { type: Object },
  };

  static styles = css`
    :host {
      display: flex;
      padding: 24px;
      background: var(--primary-background-color, #1c1c1c);
      color: var(--primary-text-color, #fff);
      min-height: 100vh;
      box-sizing: border-box;
      align-items: center;
      flex-direction: column;
    }

    .menu{
      display: flex;
      flex-direction: column;
      gap: 50px;
      max-width: 480px;

    }
    .menu-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      border-radius: 12px;
      background: var(--card-background-color, #2c2c2c);
      cursor: pointer;
      border: none;
      text-align: left;
      font-size: 18px;
      color: var(--primary-text-color, #fff);
      justify-content: center;
      text-align: center;
    }
    
    .menu-card:hover {
      background: var(--secondary-background-color, #3a3a3a);
  }
  `;

render() {
  return html`
  <div class="menu">
    <button class="menu-card" @click=${() => this._navigate("shopping")}>
      <ha-icon icon="mdi:cart"></ha-icon>
      Shopping Mode
    </button>
    <button class="menu-card" @click=${() => this._navigate("storeManager")}>
      <ha-icon icon="mdi:cart"></ha-icon>
      Store Manager
    </button>
    <button class="menu-card" @click=${() => this._navigate("listManager")}>
      <ha-icon icon="mdi:cart"></ha-icon>
      List Manager
    </button>
  </div>
  `;
  }
}


customElements.define("multi-list-panel", MultiListPanel);