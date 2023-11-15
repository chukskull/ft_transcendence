# Use the official Node.js 18.18.2 image as the base image
FROM node:18.18.2

WORKDIR /trans

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
