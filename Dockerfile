# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.4.0
FROM node:${NODE_VERSION} as base
WORKDIR /app
EXPOSE ${PORT}                               

FROM base as prod
COPY package.json .
RUN npm install --only=production
USER node
COPY . .
CMD ["npm", "run", "start"]

FROM base as dev
COPY package.json .
RUN npm install
USER node
COPY . .
CMD ["npm", "run", "dev"]