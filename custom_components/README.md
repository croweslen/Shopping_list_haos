# Multi-Store Shopping List

A custom Home Assistant integration and sidebar panel for managing shopping lists across multiple stores — create stores, build out item lists, and check items off in a dedicated Shopping Mode.

> **⚠️ Beta release (v0.5.0)** — this is an early, actively-developed release. Core functionality works and has been tested, but expect rough edges, missing polish, and occasional bugs. Feedback and bug reports are very welcome!

## Features

- **Store Manager** — create, rename, and delete stores. Each store has its own independent shopping list.
- **List Manager** — add items (with quantity and notes) to any store's list, and edit or delete existing items. Export a store's list as a downloadable `.txt` file.
- **Shopping Mode** — pick a store and check items off as you shop. Bought items are visually marked and sink to the bottom of the list (not hidden), so an accidental tap is easy to undo. When you're done, clear just the bought items or the entire list.
- **Custom sidebar panel** — the whole app lives in its own item in Home Assistant's sidebar, not squeezed into a dashboard card.
- All data is stored locally in your Home Assistant instance — no cloud service, no external accounts.

## Screens

| Screen | What it does |
|---|---|
| Main Menu | Entry point — jump to Shopping Mode, Store Manager, List Manager, or Settings |
| Store Manager | View all stores; add new ones; tap a store to rename, delete, clear its bought items, clear its full list, or jump to its item list |
| List Manager | Pick a store from a dropdown, add items via a form (name, quantity, notes), view/edit/delete existing items, export the list as text |
| Shopping Mode | Pick a store, tap items to mark them bought, export the list, and finish up with an option to clear bought items or the whole list |
| Settings | Placeholder for now — customization options (colors, icons, etc.) are planned for a future release |

## Installation

### Via HACS (recommended)

1. In Home Assistant, go to **HACS**
2. Click the three-dot menu in the top right → **Custom repositories**
3. Add this repository's URL, and select **Integration** as the category
4. Find **Multi-Store Shopping List** in HACS and click **Download**
5. Restart Home Assistant

### Manual installation

1. Copy the `custom_components/multi_list` folder into your Home Assistant `config/custom_components/` directory
2. Copy `www/multi-list-panel.js` into your Home Assistant `config/www/` directory
3. Add the following to your `configuration.yaml`:
   ```yaml
   multi_list:
   ```
4. Restart Home Assistant

After installation, a new **Multi List** item will appear in your sidebar.

## Known limitations (beta)

- No visual customization yet (colors, background, icons) — a Settings screen for this is planned
- List and item screens use plain browser dialogs (`prompt`/`confirm`) for some actions like creating or renaming a store — these work but aren't the prettiest
- The app currently relies on YAML-based setup rather than a UI config flow
- Item lists are styled as simple stacked buttons rather than a more traditional shopping-list look — a visual redesign is planned

## Reporting issues / feedback

This is a beta release and your testing genuinely helps shape what gets built next. If you run into a bug, have a feature request, or something feels clunky to use, please open an issue on this repository.

## License

See [LICENSE](LICENSE) for details.
