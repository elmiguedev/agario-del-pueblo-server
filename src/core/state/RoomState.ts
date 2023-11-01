import { DotState } from "./DotState";
import { PlayerState } from "./PlayerState";

export interface RoomState {
  players: Record<string, PlayerState>;
  dots: Record<string, DotState>;
}

