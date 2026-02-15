/**
 * BLE message protocol: send/receive LobbyMessage and GameMessage as JSON.
 * Stub until native BLE is available. See docs/decisions/bluetooth-implementation.md.
 */

import type { LobbyMessage, GameMessage } from "../../game-engine/types";

type MessageCallback = (message: LobbyMessage | GameMessage) => void;

let onMessage: MessageCallback | null = null;

export function sendLobbyMessage(_message: LobbyMessage): Promise<void> {
  return Promise.resolve(); // Stub
}

export function sendGameMessage(_message: GameMessage): Promise<void> {
  return Promise.resolve(); // Stub
}

export function onMessageReceived(callback: MessageCallback): () => void {
  onMessage = callback;
  return () => {
    onMessage = null;
  };
}
