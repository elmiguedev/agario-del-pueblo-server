import { PlayerState } from "../state/PlayerState";
import { RoomState } from "../state/RoomState";
import { MathUtils } from "../utils/MathUtils";

export class EatEnemyAction {
  constructor(
    private readonly room: RoomState
  ) { }

  public execute(player: PlayerState, enemy: PlayerState) {
    if (!enemy || !player) return;
    const distance = MathUtils.getDistance(player.position, enemy.position);

    if (distance < player.radius && player.radius > enemy.radius) {
      delete this.room.players[enemy.id]
      player.radius += Math.trunc(enemy.radius / 2);
      return true;
    }

    return false;
  }

}