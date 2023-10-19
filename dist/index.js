"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var node_http_1 = require("node:http");
var math_utils_1 = require("./utils/math.utils");
var MAX_SPEED = 4;
var MAX_DOTS_COUNT = 50;
var INITIAL_RADIUS = 30;
var MAX_POINTER_DISTANCE = 400;
var app = (0, express_1.default)();
var server = (0, node_http_1.createServer)(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
var createDot = function () {
    var dot = {
        id: "".concat(Math.random()),
        x: (Math.random() * 3000) - 1500,
        y: (Math.random() * 3000) - 1500,
        color: math_utils_1.MathUtils.getRandomColor(),
    };
    return dot;
};
var createInitialDots = function () {
    var dots = [];
    for (var i = 0; i < MAX_DOTS_COUNT; i++) {
        dots.push(createDot());
    }
    return dots;
};
var eatDot = function (player, dot) {
    world.dots = world.dots.filter(function (d) { return d.id !== dot.id; });
    player.radius += 2;
    console.log("COME", player, dot);
    io.emit("player:eat:dot", {
        player: player,
        dot: dot
    });
    var newDot = createDot();
    world.dots.push(newDot);
    io.emit("dot:created", newDot);
};
var eatEnemy = function (player, enemy) {
    delete world.players[enemy.id];
    player.radius += Math.trunc(enemy.radius / 2);
    io.emit("player:eat:enemy", ({
        player: player,
        enemy: enemy
    }));
};
var checkCollisions = function () {
    // 1. recorremmos todos los players y 
    //    validamos colisiones con puntos y enemies
    Object.keys(world.players).forEach(function (id) {
        var player = world.players[id];
        if (!player)
            return;
        // COLISION CON DOTS
        world.dots.forEach(function (dot) {
            /*
              Debemos calcular la distancia entre el dot y el player
              si la distancia es menor al radio del player -> come
              si la distancia es mayor o igual -> safa
            */
            if (!player || !dot)
                return;
            var distance = math_utils_1.MathUtils.getDistance(player, dot);
            // si la distancia es menor, come el punto
            if (distance < player.radius) {
                console.log("LA DISTANCIA ES CHICA");
                eatDot(player, dot);
            }
        });
        // COLISION CON PLAYERS
        Object.keys(world.players).forEach(function (id) {
            if (id === player.id)
                return;
            var enemy = world.players[id];
            if (!enemy || !player)
                return;
            var distance = math_utils_1.MathUtils.getDistance(player, enemy);
            if (distance < player.radius && player.radius > enemy.radius) {
                eatEnemy(player, enemy);
            }
        });
    });
};
var movePlayers = function () {
    Object.keys(world.players).forEach(function (id) {
        var player = world.players[id];
        player.x += Math.cos(player.angle) * player.speed;
        player.y += Math.sin(player.angle) * player.speed;
        if (player.x >= 1500)
            player.x = 1500;
        if (player.x <= -1500)
            player.x = -1500;
        if (player.y >= 1500)
            player.y = 1500;
        if (player.y <= -1500)
            player.y = -1500;
    });
};
var getSpeed = function (distance) {
    var speedRate = distance / MAX_POINTER_DISTANCE;
    var speed = MAX_SPEED * speedRate;
    return Math.min(MAX_SPEED, speed);
};
var world = {
    players: {},
    dots: createInitialDots()
};
var initGameLoop = function () {
    setInterval(function () {
        // actualizamos las posiciones
        movePlayers();
        // controlamos colisiones
        checkCollisions();
        // NOTIFICAMOS CAMBIOS DEL MUNDO
        io.emit("world:update", world);
    }, 1000 / 60);
};
io.on("connection", function (socket) {
    // 1. conexion de un nuevo socket (add player)
    var player = {
        id: socket.id,
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        color: math_utils_1.MathUtils.getRandomColor(),
        angle: 0,
        radius: INITIAL_RADIUS,
        speed: 0
    };
    world.players[socket.id] = player;
    console.log("Se conecto un usuario", player);
    // 1.1. se le manda al usuario que acaba de conectar 
    //      toda la lista de players
    socket.emit("world:join", world);
    io.emit("player:connect", player);
    // 2. desconexion de un socket (remove player)
    socket.on("disconnect", function () {
        io.emit("player:disconnect", {
            id: socket.id
        });
        delete world.players[socket.id];
        console.log("players", world.players);
    });
    // 3. movimiento del mouse deu n socket
    socket.on("player:move", function (data) {
        var player = world.players[socket.id];
        player.angle = data.angle;
        player.speed = getSpeed(data.distance);
    });
});
server.listen(process.env.PORT, function () {
    console.log("Listening on port ".concat(process.env.PORT, " Yea"));
    initGameLoop();
});
