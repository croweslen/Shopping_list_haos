import { LitElement, html, css } from "https://unpkg.com/lit@2.7.0/index.js?module";

class MultiListPanel extends LitElement {
  static properties = {
    hass: { type: Object },
    _currentView: { state: true },
    _stores: { state: true }, 
    _selectedStore: { state: true },
    _showStoreModal: { state:true },
  };

  constructor() {
    super();
    this._currentView = "menu";
    this._stores = [];
    this._selectedStore = null;
    this._showStoreModal = false;
  }

  async _loadStores()   {
    const result = await this.hass.connection.sendMessagePromise({
      type: "multi_list/get_stores",
    });
    console.log("loaded stores:", result);
    this._stores = result.stores;

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

  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: var(--card-background-color, #2c2c2c);
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-box h2 {
  margin: 0 0 8px 0;
  text-align: center;
}

`;






// shopping, storeManager, listManager, settings
render() {
  if (this._currentView === "menu") {
    return html`${this._renderMenu()} ${this._renderStoreModal()}`;
  } else if (this._currentView === "shopping") {
    return html`${this._renderShoppingMode()} ${this._renderStoreModal()}`;
  } else if (this._currentView === "storeManager") {
    return html`${this._renderStoreManager()} ${this._renderStoreModal()}`;
  } else if (this._currentView === "listManager") {
    return html`${this._renderListManager()} ${this._renderStoreModal()}`;
  } else if (this._currentView === "settings") {
    return html`${this._renderSetting()} ${this._renderStoreModal()}`;
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

_renderStoreManager() {
  return html`
    <h1>Store Manager</h1>
    <div class="menu">
      ${this._stores.map(
        (store) => html`
          <button class="menu-card" @click=${() => this._openStoreModal(store)}>
            <ha-icon icon="mdi:store"></ha-icon>
            ${store}
          </button>
        `
      )}
      <button class="menu-card" @click=${() => this._addStore()}>
        <ha-icon icon="mdi:plus"></ha-icon>
        Add Store
      </button>
       ${this._renderBackButton()}
    </div>
   
  `;
}

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

firstUpdated(){
  this._loadStores();
}

async _addStore() {
  const new_store = prompt("Store name:");
  if (!new_store) {
    return;
  }

  try {
    await this.hass.callService("multi_list", "create_store", { store_name: new_store });
    alert(`${new_store} was added!`);
    this._loadStores();
  } catch (error) {
    alert(`Could not add store: ${error.message}`);
  }
}

_openStoreModal(store) {
  this._selectedStore = store;
  this._showStoreModal = true;
}

_renderStoreModal() {
  if (!this._showStoreModal) {
    return html``;
  }
  return html`
    <div class="modal-overlay" @click=${() => this._closeStoreModal()}>
      <div class="modal-box" @click=${(e) => e.stopPropagation()}>
        <h2>${this._selectedStore}</h2>
        <button class="menu-card">View List</button>
        <button class="menu-card">Clear Bought</button>
        <button class="menu-card">Clear Full List</button>
        <button class="menu-card" @click=${() => this._deleteStore()}>Delete</button>
        <button class="menu-card" @click=${() => this._closeStoreModal()}>Cancel</button>
      </div>
    </div>
  `;
}

_closeStoreModal() {
  this._showStoreModal = false;
  this._selectedStore = null;
}


async _deleteStore() {
  const confirmed = confirm(`Are you sure you want to delete ${this._selectedStore}? This cannot be undone`)
  
  if (!confirmed){
    return;
  }

  try {
    await this.hass.callService("multi_list", "remove_store", { store_name: this._selectedStore});
    this._closeStoreModal();
    this._loadStores();
  } catch (error) {
    alert(`Could not delete selected store: ${error.message}`)
  }
}

async _clearBought(){

}

async _clearList(){

}

async _viewList(){

}







//NO MORE CODE UNDER HERE //////////////////////////////////////////////////////////////// 
} //last bracket for class



customElements.define("multi-list-panel", MultiListPanel);