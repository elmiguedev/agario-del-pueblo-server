import { DotState } from "../state/DotState";
import { PlayerState } from "../state/PlayerState";
import { RoomState } from "../state/RoomState";
import { MathUtils } from "../utils/MathUtils";

export class EatDotAction {
  constructor(private readonly room: RoomState) { }

  public execute(player: PlayerState, dot: DotState) {
    if (!player || !dot) return;
    const distance = MathUtils.getDistance(player.position, dot.position);

    if (distance < player.radius) {
      delete this.room.dots[dot.id];
      player.radius += 2;
      return true;
    }

    return false;
  }

}