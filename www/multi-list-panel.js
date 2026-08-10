import { LitElement, html, css } from "https://unpkg.com/lit@2.7.0/index.js?module";

class MultiListPanel extends LitElement {

  // ==================== PROPERTIES ====================
  static properties = {
    hass: { type: Object },
    _currentView: { state: true },
    _stores: { state: true },
    _selectedStore: { state: true },
    _showStoreModal: { state: true },
    _listItems: { state: true },
    _newItemName: { state: true },
    _newItemQty: { state: true },
    _newItemNotes: { state: true },
    _selectedListStore: { state: true },
    _showConfirmation: { state: true },
    _selectedItem: { state: true },
    _showItemModal: { state: true },
    _shoppingStore: { state: true },
    _shoppingItems: { state: true },
    _showDoneModal: { state: true },
  };

  // ==================== CONSTRUCTOR ====================
  constructor() {
    super();
    this._currentView = "menu";
    this._stores = [];
    this._selectedStore = null;
    this._showStoreModal = false;
    this._listItems = [];
    this._newItemName = "";
    this._newItemQty = "";
    this._newItemNotes = "";
    this._selectedListStore = "";
    this._showConfirmation = false;
    this._selectedItem = null;
    this._showItemModal = false;
    this._shoppingStore = "";
    this._shoppingItems = [];
    this._showDoneModal = false;
  }

  // ==================== LIFECYCLE ====================
  firstUpdated() {
    this._loadStores();
  }

  // ==================== STYLES ====================
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

    .menu {
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

    .items-layout {
      display: flex;
      gap: 24px;
      width: 100%;
      max-width: 800px;
      align-items: flex-start;
    }

    .items-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .button-row {
      display: flex;
      flex-direction: row;
      gap: 12px;
    }

    .confirmation-toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color, #03a9f4);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 2000;
    }
  `;

  // ==================== NAVIGATION ====================
  _navigate(screen) {
    this._currentView = screen;
  }

  // ==================== DATA LOADING ====================
  async _loadStores() {
    const result = await this.hass.connection.sendMessagePromise({
      type: "multi_list/get_stores",
    });
    console.log("loaded stores:", result);
    this._stores = result.stores;
  }

  async _loadListItems() {
    if (!this._selectedListStore) {
      this._listItems = [];
      return;
    }
    const result = await this.hass.connection.sendMessagePromise({
      type: "multi_list/get_items",
      store_name: this._selectedListStore,
    });
    this._listItems = result.items;
  }

  async _loadShoppingItems() {
    if (!this._shoppingStore) {
      this._shoppingItems = [];
      return;
    }
    const result = await this.hass.connection.sendMessagePromise({
      type: "multi_list/get_items",
      store_name: this._shoppingStore,
    });
    this._shoppingItems = result.items;
  }

  // ==================== STORE ACTIONS ====================
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

  async _deleteStore() {
    const confirmed = confirm(`Are you sure you want to delete ${this._selectedStore}? This cannot be undone`);

    if (!confirmed) {
      return;
    }

    try {
      await this.hass.callService("multi_list", "remove_store", { store_name: this._selectedStore });
      this._closeStoreModal();
      this._loadStores();
    } catch (error) {
      alert(`Could not delete selected store: ${error.message}`);
    }
  }

  async _clearBought() {

  }

  async _clearList() {

  }

  _openStoreModal(store) {
    this._selectedStore = store;
    this._showStoreModal = true;
  }

  _closeStoreModal() {
    this._showStoreModal = false;
    this._selectedStore = null;
  }

  _goToItemsScreen() {
    this._selectedListStore = this._selectedStore;
    this._closeStoreModal();
    this._navigate("items");
    this._loadListItems();
  }

  // ==================== ITEM ACTIONS ====================
  _selectListStore(storeName) {
    this._selectedListStore = storeName;
    this._loadListItems();
  }

  _clearNewItem() {
    this._newItemName = "";
    this._newItemQty = "";
    this._newItemNotes = "";
  }

  async _submitNewItem() {
    if (!this._newItemName) {
      return;
    }

    try {
      await this.hass.callService("multi_list", "add_item", {
        store_name: this._selectedListStore,
        item_name: this._newItemName,
        quantity: Number(this._newItemQty) || 1,
        notes: this._newItemNotes || "",
      });
      this._clearNewItem();
      this._loadListItems();
      this._showAddedConfirmation();
    } catch (error) {
      alert(`Could not add item: ${error.message}`);
    }
  }

  _showAddedConfirmation() {
    this._showConfirmation = true;
    setTimeout(() => {
      this._showConfirmation = false;
    }, 1000);
  }

  _openItemModal(item) {
    this._selectedItem = item;
    this._showItemModal = true;
  }

  _closeItemModal() {
    this._showItemModal = false;
    this._selectedItem = null;
  }

  async _saveItemEdit() {
    try {
      await this.hass.callService("multi_list", "edit_item", {
        store_name: this._selectedListStore,
        uid: this._selectedItem.uid,
        item_name: this._selectedItem.name,
        quantity: Number(this._selectedItem.qty) || 1,
        notes: this._selectedItem.notes || "",
      });
      this._closeItemModal();
      this._loadListItems();
    } catch (error) {
      alert(`Could not save item: ${error.message}`);
    }
  }

  async _deleteItem() {
    try {
      await this.hass.callService("multi_list", "remove_item", {
        store_name: this._selectedListStore,
        uid: this._selectedItem.uid,
      });
      this._closeItemModal();
      this._loadListItems();
    } catch (error) {
      alert(`Could not delete item: ${error.message}`);
    }
  }

  // ==================== SHOPPING MODE ACTIONS ====================
  _selectShoppingStore(storeName) {
    this._shoppingStore = storeName;
    this._loadShoppingItems();
  }

  // ==================== MAIN RENDER (ROUTER) ====================
  // shopping, storeManager, items, settings
  render() {
    if (this._currentView === "menu") {
      return html`${this._renderMenu()} ${this._renderStoreModal()}`;
    } else if (this._currentView === "shopping") {
      return html`${this._renderShoppingMode()} ${this._renderStoreModal()}`;
    } else if (this._currentView === "storeManager") {
      return html`${this._renderStoreManager()} ${this._renderStoreModal()}`;
    } else if (this._currentView === "items") {
      return html`${this._renderItemsScreen()} ${this._renderStoreModal()} ${this._renderItemModal()}`;
    } else if (this._currentView === "settings") {
      return html`${this._renderSetting()} ${this._renderStoreModal()}`;
    }
    return html`<p>Unknown view</p>`;
  }

  // ==================== SCREEN RENDERS ====================
  _renderMenu() {
    return html`
      <h1>Multi-List</h1>
      <h4>v.01</h4>
      <div class="menu">
        <button class="menu-card" @click=${() => this._navigate("shopping")}>
          <ha-icon icon="mdi:cart"></ha-icon>
          Shopping Mode
        </button>
        <button class="menu-card" @click=${() => this._navigate("storeManager")}>
          <ha-icon icon="mdi:store-outline"></ha-icon>
          Store Manager
        </button>
        <button class="menu-card" @click=${() => this._navigate("items")}>
          <ha-icon icon="mdi:list-box-outline"></ha-icon>
          List Manager
        </button>
        <button class="menu-card" @click=${() => this._navigate("settings")}>
          <ha-icon icon="mdi:cog-outline"></ha-icon>
          Settings
        </button>
      </div>
    `;
  }

  _renderShoppingMode() {
    return html`
      <h1>Shopping Mode</h1>
      ${this._renderBackButton()}
    `; // placeholder, still to be built out
  }

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

  _renderItemsScreen() {
    return html`
      <h1>List Manager</h1>
      <select @change=${(e) => this._selectListStore(e.target.value)}>
        <option value="">-- Select a store --</option>
        ${this._stores.map(
          (store) => html`
            <option value=${store} ?selected=${store === this._selectedListStore}>
              ${store}
            </option>
          `
        )}
      </select>

      <div class="items-layout">
        <div class="items-column">
          <h3>Add Item</h3>
          <input
            type="text"
            placeholder="Item name"
            .value=${this._newItemName}
            @input=${(e) => this._newItemName = e.target.value}
          />
          <input
            type="number"
            placeholder="Item Quantity"
            .value=${this._newItemQty}
            @input=${(e) => this._newItemQty = e.target.value}
          />
          <input
            type="text"
            placeholder="Item notes"
            .value=${this._newItemNotes}
            @input=${(e) => this._newItemNotes = e.target.value}
          />
          <div class="button-row">
            <button class="menu-card" @click=${() => this._submitNewItem()}>Submit</button>
            <button class="menu-card" @click=${() => this._clearNewItem()}>Clear</button>
            <button class="menu-card" @click=${() => this._navigate("menu")}>Exit</button>
          </div>
        </div>
        <div class="items-column">
          <h3>Current Items</h3>
          ${this._listItems.map(
            (item) => html`
              <div class="menu-card" @click=${() => this._openItemModal(item)}>
                ${item.name}${item.qty > 1 ? ` x${item.qty}` : ""}${item.notes ? ` (${item.notes})` : ""}
              </div>
            `
          )}
        </div>
      </div>

      ${this._renderConfirmationToast()}
      ${this._renderBackButton()}
    `;
  }

  _renderSetting() {
    return html`
      <h1>Settings menu</h1>
      <p>Eventually adding custom colors, background, store icons, any other settings</p>
      ${this._renderBackButton()}
    `;
  }

  // ==================== SHARED / REUSABLE RENDERS ====================
  _renderBackButton() {
    return html`
      <button class="menu-card" @click=${() => this._navigate("menu")}>
        <ha-icon icon="mdi:arrow-left"></ha-icon>
        Back to Menu
      </button>
    `;
  }

  _renderConfirmationToast() {
    if (!this._showConfirmation) {
      return html``;
    }
    return html`<div class="confirmation-toast">Item added!</div>`;
  }

  // ==================== MODALS ====================
  _renderStoreModal() {
    if (!this._showStoreModal) {
      return html``;
    }
    return html`
      <div class="modal-overlay" @click=${() => this._closeStoreModal()}>
        <div class="modal-box" @click=${(e) => e.stopPropagation()}>
          <h2>${this._selectedStore}</h2>
          <button class="menu-card" @click=${() => this._goToItemsScreen()}>View List</button>
          <button class="menu-card">Clear Bought</button>
          <button class="menu-card">Clear Full List</button>
          <button class="menu-card" @click=${() => this._deleteStore()}>Delete</button>
          <button class="menu-card" @click=${() => this._closeStoreModal()}>Cancel</button>
        </div>
      </div>
    `;
  }

  _renderItemModal() {
    if (!this._showItemModal || !this._selectedItem) {
      return html``;
    }
    return html`
      <div class="modal-overlay" @click=${() => this._closeItemModal()}>
        <div class="modal-box" @click=${(e) => e.stopPropagation()}>
          <h2>Edit Item</h2>
          <input
            type="text"
            .value=${this._selectedItem.name}
            @input=${(e) => this._selectedItem = { ...this._selectedItem, name: e.target.value }}
          />
          <input
            type="number"
            .value=${this._selectedItem.qty}
            @input=${(e) => this._selectedItem = { ...this._selectedItem, qty: e.target.value }}
          />
          <input
            type="text"
            .value=${this._selectedItem.notes}
            @input=${(e) => this._selectedItem = { ...this._selectedItem, notes: e.target.value }}
          />
          <button class="menu-card" @click=${() => this._saveItemEdit()}>Save</button>
          <button class="menu-card" @click=${() => this._deleteItem()}>Delete</button>
          <button class="menu-card" @click=${() => this._closeItemModal()}>Cancel</button>
        </div>
      </div>
    `;
  }

} // end class

customElements.define("multi-list-panel", MultiListPanel);