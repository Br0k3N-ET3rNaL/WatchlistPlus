FROM node:18

WORKDIR /app/ui

ARG REACT_APP_TARGET
ENV REACT_APP_TARGET=$REACT_APP_TARGET

ENV PATH /app/ui/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@5.0.1

COPY . ./

CMD ["npm", "start"]