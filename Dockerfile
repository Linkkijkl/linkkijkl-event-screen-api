FROM node:alpine

WORKDIR /home/node/app
ENV NODE_ENV=production

# Cache dependencies in Docker layer
COPY package.json package-lock.json ./
RUN npm install

COPY ./ ./
EXPOSE 4000
USER node
CMD npm start
