FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g tsc

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]