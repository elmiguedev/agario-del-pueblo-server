FROM node as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN npm run build

FROM node:slim

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN chown -R $USER /usr/local/lib/node_modules

RUN npm install 

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
