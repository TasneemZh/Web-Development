FROM node:24

WORKDIR /app

RUN node -v 

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN mkdir -p /app/data

CMD ["node", "dist/server.js"]
