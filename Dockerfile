FROM node:alpine AS frontend
WORKDIR /app

COPY frontend/package*.json /app
RUN npm ci

COPY frontend /app
RUN npm run build

FROM node:lts-alpine AS server
RUN apk update && apk add bash

WORKDIR /app

COPY backend/package*.json /app
RUN npm ci

COPY backend /app
RUN npm run build

COPY --from=frontend /app/dist /app/dist/src/static

CMD [ "/bin/bash", "script.sh" ]