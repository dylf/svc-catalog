## For a production app we would want to do multi-stage builds
## to keep the image size down and improve caching.
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
