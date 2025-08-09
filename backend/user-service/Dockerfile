# Use a stable Node.js LTS version
FROM node:18.19-alpine

WORKDIR /app

RUN apk add --no-cache sqlite python3 make g++

COPY package.json ./

RUN npm cache clean --force && \
    npm install --omit=dev --no-optional

COPY . .

RUN mkdir -p /app/data && chmod 755 /app/data

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "server.js"]