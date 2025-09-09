FROM node:18.19-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY package.json .

RUN npm cache clean --force && \
	npm install --omit=dev --no-optional

COPY . .

EXPOSE 3003


