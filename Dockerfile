FROM node:18-alpine

COPY ./dist /app
COPY ./package.json /app
COPY pnpm-lock.yaml /app
RUN npm install -g pnpm
RUN cd /app && pnpm install

RUN node ./index.js