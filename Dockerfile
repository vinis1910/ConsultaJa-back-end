FROM node:lts-alpine

COPY node_modules /usr/src/node_modules
COPY dist /usr/src/dist
WORKDIR /usr/src

CMD node dist/Main