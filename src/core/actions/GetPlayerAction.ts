import { PlayerState } from "../state/PlayerState";
import { RoomState } from "../state/RoomState";

export class GetPlayerAction {
  constructor(private readonly room: RoomState) { }

  public execute(id: string): PlayerState {
    return this.room.players[id];
  }

}