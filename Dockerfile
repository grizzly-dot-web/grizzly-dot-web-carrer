FROM node:9.3.0
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run-script build
RUN npm run-script build:content

EXPOSE 80 9000

CMD [ "npm", "start" ]