FROM node:18.19-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY package.json ./

RUN npm cache clean --force && \
    npm install --omit=dev --no-optional

COPY . .


RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["npm", "run", "dev"]