FROM node:18.18.2

WORKDIR /trans-front

COPY package*.json ./
COPY .npmrc ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "run", "start"]
