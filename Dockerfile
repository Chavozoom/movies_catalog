FROM node:20.5.1-slim

RUN npm install -g @nestjs/cli@10.1.17

USER node

WORKDIR /home/node/app
COPY package.json .
COPY . .

CMD ["tail", "-f", "/dev/null"]