FROM node:8
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080

RUN npm run-script build
RUN npm run-script build:content

CMD [ "npm", "start" ]