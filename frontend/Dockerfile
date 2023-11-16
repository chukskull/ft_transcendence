<<<<<<< HEAD
FROM node:alpine

WORKDIR /trans

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
=======
FROM node:18.18.2

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
>>>>>>> origin/dev
