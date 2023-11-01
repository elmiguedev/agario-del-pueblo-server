import { DotState } from "../state/DotState";
import { RoomState } from "../state/RoomState";
import { ROOM_SIZE } from "../utils/Constants";
import { MathUtils } from "../utils/MathUtils";


export class CreateRandomDotAction {
  constructor(
    private readonly room: RoomState
  ) { }

  public execute(): DotState {
    const dot = {
      id: MathUtils.getRandomId(),
      position: {
        x: (Math.random() * ROOM_SIZE) - ROOM_SIZE / 2,
        y: (Math.random() * ROOM_SIZE) - ROOM_SIZE / 2
      },
      color: MathUtils.getRandomColor()
    };
    this.room.dots[dot.id] = dot;
    return dot;
  }
}