# == BUILDER ==
FROM node:20 as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN rm db/*.db && npm run build

COPY .env dist/src/.env

RUN npm run knex -- migrate:latest

# == EXECUTE ==
FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /usr/src/app/db/**.db ./db/
COPY --from=builder /usr/src/app/dist/src/ ./dist/src/

EXPOSE 3333

CMD ["node", "dist/src/server.cjs"]
