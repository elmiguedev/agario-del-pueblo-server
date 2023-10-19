FROM node:18-alpine

COPY ./dist /app

RUN node ./app/index.js