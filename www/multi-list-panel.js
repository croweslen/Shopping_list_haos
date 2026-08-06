import { LitElement, html, css } from "https://unpkg.com/lit@2.7.0/index.js?module";

class MultiListPanel extends LitElement {
  static properties = {
    hass: { type: Object },
    _currentView: { state: true },
  };

  constructor() {
    super();
    this._currentView = "menu";
  }

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
      gap: 24px;
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
// shopping, storeManager, listManager, settings
render() {
   if (this._currentView === "menu") {
      return this._renderMenu();
  }   else if (this._currentView === "shopping")  {
      return this._renderShoppingMode();
  }   else if (this._currentView === "storeManager")  {
      return this._renderStoreManager();
  }   else if(this._currentView ==="listManager")  {
      return this._renderListManager();
  }   else if (this._currentView ==="settings") {
      return this._renderSetting();
  }
    return html`<p>Unknown view</p>`;
  }

_navigate(screen) {
  this._currentView = screen;
}


_renderMenu(){
  return html`
  <h1> Multi-List </h1>
  <h4> v.01 </h4>
  <div class="menu">
    <button class="menu-card" @click=${() => this._navigate("shopping")}>
      <ha-icon icon="mdi:cart"></ha-icon>
      Shopping Mode
    </button>
    <button class="menu-card" @click=${() => this._navigate("storeManager")}>
      <ha-icon icon="mdi:store-outline"></ha-icon>
      Store Manager
    </button>
    <button class="menu-card" @click=${() => this._navigate("listManager")}>
      <ha-icon icon="mdi:format-list-checks"></ha-icon>
      List Manager
    </button>
    <button class="menu-card" @click=${() => this._navigate("settings")}>
      <ha-icon icon="mdi:cog-outline"></ha-icon>
      Settings
    </button>
  </div>
  `;

}// renderMenu end bracket


_renderShoppingMode() {
  return html`
    <h1>Shopping Mode</h1>
    ${this._renderBackButton()}
  `;// end html
} // shopping mode placeholder

_renderListManager(){
  return html`
    <h1>List Manager</h1>
    ${this._renderBackButton()}

  `;// end html

}// last bracker list manager

_renderStoreManager(){
  return html`
    <h1>Store Manager</h1>
    ${this._renderBackButton()}
  `;//end html
}//last bracket store manager

_renderSetting(){
  return html`
    <h1>Settings menu</h1>
    <p> Eventually adding custom colors, background, store icons, any other settings</p>
    ${this._renderBackButton()}
  `;//end html
}//last bracket settings

_renderBackButton() {
  return html`
    <button class="menu-card" @click=${() => this._navigate("menu")}>
      <ha-icon icon="mdi:arrow-left"></ha-icon>
      Back to Menu
    </button>
  `;
}

} //last bracket for class


customElements.define("multi-list-panel", MultiListPanel);