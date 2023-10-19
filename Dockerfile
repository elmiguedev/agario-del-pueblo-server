FROM node as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm start