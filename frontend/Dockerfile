#build stage
FROM node:16-slim as build-stage

WORKDIR /usr/app
COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 5002

CMD ["node", "server.cjs"]