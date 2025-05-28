FROM node:lts-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN yarn config set registry https://registry.yarnpkg.com
RUN yarn install

COPY . .
RUN yarn build

CMD ["node", "dist/main"]
