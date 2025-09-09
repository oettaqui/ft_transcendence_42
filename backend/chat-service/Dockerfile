FROM node:18.19-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY package.json .

RUN npm cache clean --force && \
	npm install --omit=dev --no-optional

COPY . .

EXPOSE 3003


RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

CMD ["node", "server.js"]