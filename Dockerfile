FROM node:18-alpine

WORKDIR /app

COPY wordladder_frontend/package*.json ./

RUN npm install

COPY wordladder_frontend/. .

EXPOSE 3000

CMD ["npm", "start"]