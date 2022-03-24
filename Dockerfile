FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install nodemon -g

COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "run", "start"]
