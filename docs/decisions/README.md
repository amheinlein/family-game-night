# Design decision log

This folder is the **log of real design decisions** for Family Game Night. Each document records one (or a related set of) decision: context, what we decided, and why.

## Purpose

- **For implementation**: When working on code that touches a design decision, review the linked decision doc(s) to understand how we got there. This keeps changes consistent with prior choices.
- **For AI assistance**: When an AI is editing or suggesting code that involves a design decision, it should read the relevant decision document(s) to align with our rationale and avoid contradicting or re-opening decided questions.
- **For future decisions**: New decisions can build on and reference existing ones; everything stays documented in one place.

## How it fits with other docs

- **Architecture** ([../architecture.md](../architecture.md)) states the actual decisions in context and **links here** for the reasoning.
- **Data models** ([../datamodels.md](../datamodels.md)) reflect decisions about state shape and sync; decision docs may link to them.
- **This folder** holds the “why” and the discussion; the other docs hold the “what.”

## Decision document format

Each decision file should include:

- **Title** — Short name for the decision.
- **Status** — e.g. Decided, Proposed, Superseded.
- **Context** — What problem or choice we were facing.
- **Decision** — What we decided (clear, actionable).
- **Rationale / consequences** — Why we chose this; tradeoffs; what it enables or constrains.
- **Reflected in** — Links to architecture, datamodels, or code where this decision is applied.

## Index of decisions

| Decision | Document | Status |
|----------|----------|--------|
| [Sync only validated actions](sync-validated-actions.md) | sync-validated-actions.md | Decided |
| [Preferred stack](preferredstack.md) | preferredstack.md | Decided |
| [State management](state-management.md) | state-management.md | Decided |
| [Bluetooth / multi-device sync](bluetooth-sync.md) | bluetooth-sync.md | Decided |

*(Add new rows here when you add new decision documents.)*

**Options analysis** (alternatives and recommendations for stack choices): [stack-options.md](stack-options.md)
