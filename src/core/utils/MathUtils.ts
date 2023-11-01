import { PositionState } from "../state/PositionState";
import crypto from "node:crypto";

const getDistance = (pos1: PositionState, pos2: PositionState) => {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

const getRandomColor = () => {
  return Math.floor(Math.random() * 0xffffff);
}

const getRandomId = () => {
  return crypto.randomUUID();
}

const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

export const MathUtils = {
  getDistance,
  getRandomColor,
  getRandomId,
  randomBetween
}