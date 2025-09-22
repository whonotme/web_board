# dev mode
# Stage 1: Build
# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# EXPOSE 5050
# CMD ["npm", "run", "dev"]

# production
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production
RUN npm install pm2 -g

COPY . .

EXPOSE 5050

CMD ["pm2-runtime", "start", "index.js", "-i", "max"]