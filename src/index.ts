import express, { Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "node:http"
import { Player } from "./domain/Player";
import { Dot } from "./domain/Dot";
import { MathUtils } from "./utils/math.utils";

const MAX_SPEED = 4;
const MAX_DOTS_COUNT = 50;
const INITIAL_RADIUS = 30;
const MAX_POINTER_DISTANCE = 400;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

const createDot = () => {
  const dot = {
    id: `${Math.random()}`,
    x: (Math.random() * 3000) - 1500,
    y: (Math.random() * 3000) - 1500,
    color: MathUtils.getRandomColor(),
  }
  return dot;
}

const createInitialDots = () => {
  const dots: Dot[] = [];
  for (let i = 0; i < MAX_DOTS_COUNT; i++) {
    dots.push(createDot());
  }
  return dots;
}

const eatDot = (player: Player, dot: Dot) => {
  world.dots = world.dots.filter(d => d.id !== dot.id);
  player.radius += 2;
  io.emit("player:eat:dot", {
    player,
    dot
  })
  const newDot = createDot();
  world.dots.push(newDot);
  io.emit("dot:created", newDot);
}

const eatEnemy = (player: Player, enemy: Player) => {
  delete world.players[enemy.id]
  player.radius += Math.trunc(enemy.radius / 2);
  io.emit("player:eat:enemy", ({
    player,
    enemy
  }))
}

const checkCollisions = () => {
  // 1. recorremmos todos los players y 
  //    validamos colisiones con puntos y enemies
  Object.keys(world.players).forEach((id) => {
    const player: Player = world.players[id];
    if (!player) return;

    // COLISION CON DOTS
    world.dots.forEach((dot) => {
      /*
        Debemos calcular la distancia entre el dot y el player
        si la distancia es menor al radio del player -> come
        si la distancia es mayor o igual -> safa
      */
      if (!player || !dot) return;
      const distance = MathUtils.getDistance(player, dot);

      // si la distancia es menor, come el punto
      if (distance < player.radius) {
        eatDot(player, dot);
      }

    });

    // COLISION CON PLAYERS
    Object.keys(world.players).forEach((id) => {
      if (id === player.id) return;
      const enemy: Player = world.players[id];
      if (!enemy || !player) return;
      const distance = MathUtils.getDistance(player, enemy);
      if (distance < player.radius && player.radius > enemy.radius) {
        eatEnemy(player, enemy);
      }
    });
  })
}

const movePlayers = () => {
  Object.keys(world.players).forEach((id) => {
    const player = world.players[id];
    player.x += Math.cos(player.angle) * player.speed;
    player.y += Math.sin(player.angle) * player.speed;

    if (player.x >= 1500) player.x = 1500;
    if (player.x <= -1500) player.x = -1500;
    if (player.y >= 1500) player.y = 1500;
    if (player.y <= -1500) player.y = -1500;

  })
}

const getSpeed = (distance: number) => {
  const speedRate = distance / MAX_POINTER_DISTANCE;
  const speed = MAX_SPEED * speedRate;
  return Math.min(MAX_SPEED, speed);
}

const world = {
  players: {} as any,
  dots: createInitialDots()
}

const initGameLoop = () => {
  setInterval(() => {
    // actualizamos las posiciones
    movePlayers();

    // controlamos colisiones
    checkCollisions();

    // NOTIFICAMOS CAMBIOS DEL MUNDO
    io.emit("world:update", world);
  }, 1000 / 60);
}

io.on("connection", (socket) => {

  // 1. conexion de un nuevo socket (add player)
  const player: Player = {
    id: socket.id,
    x: Math.random() * 1000,
    y: Math.random() * 1000,
    color: MathUtils.getRandomColor(),
    angle: 0,
    radius: INITIAL_RADIUS,
    speed: 0
  };
  world.players[socket.id] = player
  console.log("Se conecto un usuario", player);

  // 1.1. se le manda al usuario que acaba de conectar 
  //      toda la lista de players

  socket.emit("world:join", world);
  io.emit("player:connect", player);

  // 2. desconexion de un socket (remove player)
  socket.on("disconnect", () => {
    delete world.players[socket.id]
    io.emit("player:disconnect", {
      id: socket.id
    });
  })

  // 3. movimiento del mouse deu n socket
  socket.on("player:move", (data) => {
    const player = world.players[socket.id];
    player.angle = data.angle;
    player.speed = getSpeed(data.distance);
  })
})

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT} Yeahh!`)
  initGameLoop();
})