FROM nginx
WORKDIR /client
COPY build /usr/share/nginx/html
