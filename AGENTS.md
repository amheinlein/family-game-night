# Agent instructions — Family Game Night

When working on this codebase, follow the project’s documented design so changes stay consistent and don’t undo prior decisions.

## Design decisions

When your implementation or suggestions touch any of the following, **read the linked decision document(s) first** so you align with how we got to that decision:

- **Sync / multi-device** (what we send over the wire, who is authority, resync)  
  → [docs/decisions/sync-validated-actions.md](docs/decisions/sync-validated-actions.md)

- **Stack choices** (state management, Bluetooth library, persistence, navigation)  
  → [docs/decisions/preferredstack.md](docs/decisions/preferredstack.md)  
  → [docs/decisions/state-management.md](docs/decisions/state-management.md)  
  → [docs/decisions/bluetooth-sync.md](docs/decisions/bluetooth-sync.md)

- **Architecture** (game engine contract, sync layer, UI vs shell vs engine)  
  → [docs/architecture.md](docs/architecture.md) — and use the “Design decisions” table there to find the right decision doc for the area you’re editing.

**How to use this:**  
Before changing or adding code that affects sync, state, Bluetooth, or game flow, open the relevant doc in `docs/decisions/` (or the architecture doc). Use it to avoid contradicting decided behavior and to make new choices consistent with existing ones.

## Other references

- **Data shapes and message types:** [docs/datamodels.md](docs/datamodels.md)
- **Full decision index:** [docs/decisions/README.md](docs/decisions/README.md)
- **Product vision and flow:** [README.md](README.md)
