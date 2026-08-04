import { LitElement, html, css } from "https://unpkg.com/lit@2.7.0/index.js?module";

class MultiListPanel extends LitElement {
  render() {
    return html`<h1>Hello Multi List</h1>`;
  }
}

customElements.define("multi-list-panel", MultiListPanel);