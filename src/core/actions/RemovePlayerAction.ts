import { RoomState } from "../state/RoomState";

export class RemovePlayerAction {
  constructor(private readonly room: RoomState) { }

  public execute(id: string) {
    delete this.room.players[id];
  }
}