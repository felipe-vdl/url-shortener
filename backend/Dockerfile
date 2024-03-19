FROM node:lts-alpine

RUN apk update && apk add bash

WORKDIR /app

COPY package*.json /app
RUN npm ci

COPY . /app
RUN npm run build

CMD [ "/bin/bash", "script.sh" ]