import logging

from .data import remItem
from .data import createStore
from .data import removeStore
from .data import addItem
from .data import clearFullList
from .data import toggleBought
from .data import clearBought
from .data import async_load_data
from .data import async_save_data
from .data import editItem
from .data import renameStore

from homeassistant.components import websocket_api
from homeassistant.components import panel_custom

from .data import get_stores
from .data import seeList

_LOGGER = logging.getLogger(__name__)

async def async_setup(hass, config):
    _LOGGER.info("Multi-list shopping integration is loading!")

    await async_load_data(hass)

    hass.http.register_static_path(
        "/multi_list_static/multi-list-panel.js",
        hass.config.path("custom_components/multi_list/www/multi-list-panel.js"),
        cache_headers=False,
    )

    hass.services.async_register("multi_list", "create_store", handle_create_store)
    hass.services.async_register("multi_list", "remove_store", handle_remove_store)
    hass.services.async_register("multi_list", "add_item", handle_add_item)
    hass.services.async_register("multi_list", "remove_item", handle_rem_item)
    hass.services.async_register("multi_list", "clear_full_list", handle_clear_full_list)
    hass.services.async_register("multi_list", "clear_bought", handle_clear_bought)
    hass.services.async_register("multi_list", "toggle_bought", handle_toggle_bought)
    hass.services.async_register("multi_list", "edit_item", handle_edit_item)
    hass.services.async_register("multi_list", "rename_store", handle_rename_store)

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="multi-list-panel",
        frontend_url_path="multi-list",
        sidebar_title="Multi List",
        sidebar_icon="mdi:list-box-outline",
        module_url="/multi_list_static/multi-list-panel.js",
        embed_iframe=False,
        require_admin=False,
    )

    websocket_api.async_register_command(hass, handle_ws_get_stores)
    websocket_api.async_register_command(hass, handle_ws_get_items)

    return True

async def handle_create_store(call):
    store_name = call.data["store_name"]
    createStore(store_name)

async def handle_remove_store(call):
    store_name = call.data["store_name"]
    removeStore(store_name)

async def handle_rename_store(call):
    old_name = call.data["old_name"]
    new_name = call.data["new_name"]
    renameStore(old_name, new_name)

async def handle_add_item(call):
    store_name = call.data["store_name"]
    item_name = call.data["item_name"]
    quantity = call.data.get("quantity", 1)
    notes = call.data.get("notes", "")
    category = call.data.get("category", "")
    addItem(store_name, item_name, quantity, notes, category)

async def handle_rem_item(call):
    store_name = call.data["store_name"]
    uid = call.data["uid"]
    remItem(store_name, uid)

async def handle_clear_full_list(call):
    store_name = call.data["store_name"]
    clearFullList(store_name)

async def handle_clear_bought(call):
    store_name = call.data["store_name"]
    clearBought(store_name)

async def handle_toggle_bought(call):
    store_name = call.data["store_name"]
    uid = call.data["uid"]
    toggleBought(store_name, uid)

@websocket_api.websocket_command({"type": "multi_list/get_stores"})
@websocket_api.async_response

async def handle_ws_get_stores(hass, connection, msg):
    stores = get_stores()
    connection.send_result(msg["id"], {"stores": stores})

@websocket_api.websocket_command({
    "type": "multi_list/get_items",
    "store_name": str,
})
@websocket_api.async_response

async def handle_ws_get_items(hass, connection, msg):
    store_name = msg["store_name"]
    items = seeList(store_name)
    connection.send_result(msg["id"], {"items":  items})

async def handle_edit_item(call):
    store_name = call.data["store_name"]
    uid = call.data["uid"]
    item_name = call.data["item_name"]
    quantity = call.data.get("quantity", 1)
    notes = call.data.get("notes", "")
    category = call.data.get("category", "")
    editItem(store_name, item_name, quantity, notes, uid, category)