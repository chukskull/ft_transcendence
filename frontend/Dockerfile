FROM node:18.18.2

WORKDIR /trans-front

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
