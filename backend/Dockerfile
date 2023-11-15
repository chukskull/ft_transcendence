FROM node:alpine

WORKDIR /trans

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
