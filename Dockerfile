FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install

ENV .env .env

EXPOSE 3000

CMD [ "npm","start" ]

