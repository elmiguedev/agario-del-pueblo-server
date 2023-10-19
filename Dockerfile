FROM node as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm start