FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html/apps/voracious-appetite

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Reports whether nginx is serving the app; it restarts nothing by itself.
# The app lives under /apps/voracious-appetite/, so that's the path that
# answers 200
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
    CMD wget -q --spider http://127.0.0.1/apps/voracious-appetite/ || exit 1

CMD ["nginx", "-g", "daemon off;"]