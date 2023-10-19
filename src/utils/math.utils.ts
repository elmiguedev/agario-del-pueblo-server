import { Position } from "../domain/Position";

const getDistance = (pos1: Position, pos2: Position) => {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

const getRandomColor = () => {
  return Math.floor(Math.random() * 0xffffff);
}

export const MathUtils = {
  getDistance,
  getRandomColor
}