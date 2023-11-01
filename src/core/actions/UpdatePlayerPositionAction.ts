import { PlayerState } from "../state/PlayerState";
import { RoomState } from "../state/RoomState";
import { ROOM_SIZE } from "../utils/Constants";

export class UpdatePlayerPositionAction {
  constructor(
    private readonly room: RoomState
  ) { }

  public execute(player: PlayerState) {
    player.position.x += Math.cos(player.angle) * player.speed;
    player.position.y += Math.sin(player.angle) * player.speed;

    const roomRadius = ROOM_SIZE / 2;

    if (player.position.x >= roomRadius) player.position.x = roomRadius;
    if (player.position.x <= -roomRadius) player.position.x = -roomRadius;
    if (player.position.y >= roomRadius) player.position.y = roomRadius;
    if (player.position.y <= -roomRadius) player.position.y = -roomRadius;
  }

}