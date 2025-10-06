FROM node:18.12.1-slim
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY app.js .

ENV PORT 8080

CMD [ "node", "app.js" ]