"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathUtils = void 0;
var getDistance = function (pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};
var getRandomColor = function () {
    return Math.floor(Math.random() * 0xffffff);
};
exports.MathUtils = {
    getDistance: getDistance,
    getRandomColor: getRandomColor
};
