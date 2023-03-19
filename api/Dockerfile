FROM node:18

WORKDIR /app/api

ENV PATH /app/api/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . ./

CMD ["npm", "start"]