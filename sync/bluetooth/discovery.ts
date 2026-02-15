/**
 * BLE discovery: Host advertises, Join scans and connects.
 * Stub until native BLE is available (Expo dev build). See docs/decisions/bluetooth-implementation.md.
 */

import type { GameType } from "../../game-engine/types";
import type { RoomId } from "../../game-engine/types";

export interface HostAdvertiseOptions {
  gameType: GameType;
  roomId: RoomId;
}

export interface DiscoveredGame {
  roomId: RoomId;
  gameType: GameType;
  deviceId?: string;
}

export async function startAdvertising(_options: HostAdvertiseOptions): Promise<void> {
  // Stub: requires react-native-ble-peripheral / Expo dev build
}

export async function stopAdvertising(): Promise<void> {
  // Stub
}

export async function scanForGames(): Promise<DiscoveredGame[]> {
  // Stub: requires react-native-ble-plx / Expo dev build
  return [];
}

export async function connectToHost(_roomId: RoomId): Promise<boolean> {
  // Stub
  return false;
}

export async function disconnect(): Promise<void> {
  // Stub
}
