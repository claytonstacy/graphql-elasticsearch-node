# specify the node base image with your desired version node:<version>
FROM node:15
# replace this with your application's default port

WORKDIR /usr/share/app

COPY . .

EXPOSE 9100

CMD [ "node", "./server/server.js"]