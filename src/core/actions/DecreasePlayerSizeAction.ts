import { PlayerState } from "../state/PlayerState";
import { RoomState } from "../state/RoomState";
import { INITIAL_RADIUS } from "../utils/Constants";

export class DecreasePlayerSizeAction {
  constructor(private readonly room: RoomState) { }

  public execute(player: PlayerState) {
    player.decreaseTimer++;
    if (player.decreaseTimer >= (120 / (INITIAL_RADIUS / player.radius))) {
      player.decreaseTimer = 0;
      player.radius -= 1;

      if (player.radius <= INITIAL_RADIUS) {
        player.radius = INITIAL_RADIUS;
      }
    }
  }
}