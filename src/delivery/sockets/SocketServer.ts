import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { ActionProvider } from "../providers/ActionProvider";
import { GAME_LOOP_FREQUENCY } from "../../core/utils/Constants";

export class SocketServer {

  private io: Server;
  private actionProvider: ActionProvider;

  constructor(httpServer: HttpServer, actionProvider: ActionProvider) {
    this.actionProvider = actionProvider;
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });

    this.io.on("connection", (socket) => {
      const playerName = `${socket.handshake.query["playerName"]}`;
      const player = this.actionProvider.createPlayerAction.execute(socket.id, playerName);

      // 1. crea el usuario y le avisa a el y al resto para actualizar estado
      socket.emit("world:join", this.actionProvider.getRoomStateAction.execute());
      this.io.emit("player:connect", player);

      // 2. desconexion de un socket (remove player)
      socket.on("disconnect", () => {
        this.actionProvider.removePlayerAction.execute(socket.id);
        this.io.emit("player:disconnect", {
          id: socket.id
        });
      })

      // 3. movimiento del mouse deu n socket
      socket.on("player:move", (data) => {
        this.actionProvider.movePlayerAction.execute(
          socket.id,
          data.angle,
          data.distance
        )
      })
    })
  }

  public initGameLoop() {
    setInterval(() => {
      const room = this.actionProvider.getRoomStateAction.execute();

      Object.keys(room.players).forEach((id) => {
        const player = room.players[id];
        if (player) {
          this.actionProvider.updatePlayerPositionAction.execute(player);
          this.actionProvider.decreasePlayerSizeAction.execute(player);
          Object.keys(room.dots).forEach((dotId) => {
            const dot = room.dots[dotId];
            if (dot) {
              if (this.actionProvider.eatDotAction.execute(player, dot)) {
                this.io.emit("player:eat:dot", { dot });
                const newDot = this.actionProvider.createRandomDotAction.execute();
                this.io.emit("dot:created", newDot);
              }
            }
          })
          Object.keys(room.players).forEach((enemyId) => {
            if (id === enemyId) return;
            const enemy = room.players[enemyId];
            if (enemy) {
              this.actionProvider.eatEnemyAction.execute(player, enemy);
            }
          })
        }
      })

      this.io.emit("world:update", room);

    }, GAME_LOOP_FREQUENCY);
  }


}