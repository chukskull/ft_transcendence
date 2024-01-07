FROM node:18.18.2

WORKDIR /trans-back

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
