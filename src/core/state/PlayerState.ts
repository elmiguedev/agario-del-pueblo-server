import { PositionState } from "./PositionState";

export interface PlayerState {
  id: string;
  name: string;
  position: PositionState;
  color: number;
  angle: number;
  radius: number;
  speed: number;
  decreaseTimer: number;
}