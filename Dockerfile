# * Install Dependencies
FROM node:lts-alpine3.19 AS install-deps

WORKDIR /app

COPY ./package.json ./yarn.lock ./

RUN yarn

COPY . .

# * Create Build
FROM node:lts-alpine3.19 AS create-build

WORKDIR /app

COPY --from=install-deps /app/ .

RUN yarn build

USER node

# * Run
FROM node:lts-alpine3.19 AS Run

WORKDIR /app

COPY --from=install-deps /app/node_modules/ ./node_modules
COPY --from=create-build /app/dist/ ./dist
COPY package.json .

CMD ["yarn", "start:prod"]
