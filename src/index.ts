import express from "express";
import { createServer } from "node:http"
import { SocketServer } from "./delivery/sockets/SocketServer";
import { CreateRoomAction } from "./core/actions/CreateRoomAction";
import { ActionProvider } from "./delivery/providers/ActionProvider";
import { RoomState } from "./core/state/RoomState";


const app = express();
const server = createServer(app);

const room: RoomState = new CreateRoomAction().execute();
const actionProvider = new ActionProvider(room);

const socketServer = new SocketServer(server, actionProvider);

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT} Yeahh :D !!`)
  socketServer.initGameLoop();
})