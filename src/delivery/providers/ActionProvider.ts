import { CreatePlayerAction } from "../../core/actions/CreatePlayerAction";
import { CreateRandomDotAction } from "../../core/actions/CreateRandomDotAction";
import { DecreasePlayerSizeAction } from "../../core/actions/DecreasePlayerSizeAction";
import { EatDotAction } from "../../core/actions/EatDotAction";
import { EatEnemyAction } from "../../core/actions/EatEnemyAction";
import { GetPlayerAction } from "../../core/actions/GetPlayerAction";
import { GetRoomStateAction } from "../../core/actions/GetRoomStateAction";
import { MovePlayerAction } from "../../core/actions/MovePlayerAction";
import { RemovePlayerAction } from "../../core/actions/RemovePlayerAction";
import { UpdatePlayerPositionAction } from "../../core/actions/UpdatePlayerPositionAction";
import { RoomState } from "../../core/state/RoomState";

export class ActionProvider {
  public createRandomDotAction: CreateRandomDotAction;
  public createPlayerAction: CreatePlayerAction;
  public getPlayerAction: GetPlayerAction;
  public getRoomStateAction: GetRoomStateAction;
  public removePlayerAction: RemovePlayerAction;
  public movePlayerAction: MovePlayerAction;
  public eatDotAction: EatDotAction;
  public eatEnemyAction: EatEnemyAction;
  public updatePlayerPositionAction: UpdatePlayerPositionAction;
  public decreasePlayerSizeAction: DecreasePlayerSizeAction;

  constructor(private readonly room: RoomState) {
    this.createRandomDotAction = new CreateRandomDotAction(this.room);
    this.createPlayerAction = new CreatePlayerAction(this.room);
    this.getPlayerAction = new GetPlayerAction(this.room);
    this.getRoomStateAction = new GetRoomStateAction(this.room);
    this.removePlayerAction = new RemovePlayerAction(this.room);
    this.movePlayerAction = new MovePlayerAction(this.room);
    this.eatDotAction = new EatDotAction(this.room);
    this.eatEnemyAction = new EatEnemyAction(this.room);
    this.updatePlayerPositionAction = new UpdatePlayerPositionAction(this.room);
    this.decreasePlayerSizeAction = new DecreasePlayerSizeAction(this.room);
  }

}