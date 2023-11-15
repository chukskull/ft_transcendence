FROM node:alpine

WORKDIR /trans

COPY . .

RUN npm install

CMD [ "npm", "run", "start:dev" ]

# RUN npm run build
# CMD [ "npm", "run", "start" ]