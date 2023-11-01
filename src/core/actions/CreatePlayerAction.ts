import { PlayerState } from "../state/PlayerState";
import { RoomState } from "../state/RoomState";
import { INITIAL_RADIUS } from "../utils/Constants";
import { MathUtils } from "../utils/MathUtils";

export class CreatePlayerAction {
  constructor(private readonly room: RoomState) { }

  public execute(id: string, name: string): PlayerState {
    const player: PlayerState = {
      id: id,
      name: name,
      position: {
        x: MathUtils.randomBetween(-1000, 1000),
        y: MathUtils.randomBetween(-1000, 1000)
      },
      color: MathUtils.getRandomColor(),
      angle: 0,
      radius: INITIAL_RADIUS,
      speed: 0,
      decreaseTimer: 0
    };
    this.room.players[id] = player;
    return player;
  }
}