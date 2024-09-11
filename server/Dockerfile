FROM node:18-alpine

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

EXPOSE 3005

RUN chmod +x run-server.sh

ENTRYPOINT ["./run-server.sh"]
