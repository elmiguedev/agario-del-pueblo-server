import { PlayerState } from "../state/PlayerState";
import { RoomState } from "../state/RoomState";
import { INITIAL_RADIUS, MAX_POINTER_DISTANCE, MAX_SPEED } from "../utils/Constants";

export class MovePlayerAction {
  constructor(private readonly room: RoomState) { }

  public execute(id: string, angle: number, distance: number) {
    const player = this.room.players[id];
    if (player) {
      player.angle = angle;
      player.speed = this.getSpeed(distance, player);
    }
  }

  private getSpeed(distance: number, player: PlayerState) {
    const speedRate = distance / MAX_POINTER_DISTANCE;
    const maxSpeed = this.getMaxSpeed(player);
    const speed = maxSpeed * speedRate;
    return Math.min(maxSpeed, speed);
  }

  private getMaxSpeed(player: PlayerState) {
    const sizeRate = INITIAL_RADIUS / player.radius;
    const speed = MAX_SPEED * (sizeRate * 2);
    const maxSpeed = Math.min(MAX_SPEED, speed);
    return maxSpeed;
  }
}