import { RoomState } from "../state/RoomState";

export class GetRoomStateAction {
  constructor(private readonly room: RoomState) { }

  public execute(): RoomState {
    return this.room;
  }
}