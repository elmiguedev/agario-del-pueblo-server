import { DotState } from "../state/DotState";
import { RoomState } from "../state/RoomState";
import { MAX_DOTS_COUNT, ROOM_SIZE } from "../utils/Constants";
import { MathUtils } from "../utils/MathUtils";

export class CreateRoomAction {
  constructor() { }

  public execute() {
    const room: RoomState = {
      players: {},
      dots: this.createInitialDots()
    }
    return room;
  }

  private createInitialDots() {
    const dots: Record<string, DotState> = {};
    for (let i = 0; i < MAX_DOTS_COUNT; i++) {
      const dot: DotState = {
        id: MathUtils.getRandomId(),
        position: {
          x: (Math.random() * ROOM_SIZE) - ROOM_SIZE / 2,
          y: (Math.random() * ROOM_SIZE) - ROOM_SIZE / 2
        },
        color: MathUtils.getRandomColor()
      }
      dots[dot.id] = dot;
    }
    return dots;
  }
}