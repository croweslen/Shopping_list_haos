import { LitElement, html, css } from "https://unpkg.com/lit@2.7.0/index.js?module";

class MultiListPanel extends LitElement {
  static properties = {
    hass: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
      padding: 24px;
      background: var(--primary-background-color, #1c1c1c);
      color: var(--primary-text-color, #fff);
      min-height: 100vh;
      box-sizing: border-box;
    }

    .menu{
      display: flex;
      flex-direction: column;
      gap: 16px;
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
    }
  `;

  render() {
    return html`<h1>Hello Multi List</h1>`;
  }
}

customElements.define("multi-list-panel", MultiListPanel);