FROM node:latest
WORKDIR /usr/app
COPY package.json .

RUN npm install

ADD . .
RUN npm run compile

CMD [ "npm", "start" ]

EXPOSE 4242
