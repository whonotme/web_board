# dev mode
# # Stage 1: Build
# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# CMD ["npm", "run", "dev", "--", "--host"]

# production
# Stage 1: Build React app
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build   # build vite → dist/

# Stage 2: Serve with nginx
FROM nginx:alpine

# copy build output ไปใส่ nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# optional: ใช้ nginx.conf custom
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]