FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci
COPY . .
# CMD [ "npm", "run", "dev" ]
CMD npm start