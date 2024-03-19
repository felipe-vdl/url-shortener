FROM node:alpine AS build

WORKDIR /app

COPY package*.json /app
RUN npm ci

COPY . /app
RUN npm run build

FROM nginx:stable-alpine AS server
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]