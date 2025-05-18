FROM node:lts-alpine

WORKDIR /usr/src

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn build

CMD ["node", "dist/Main"]
