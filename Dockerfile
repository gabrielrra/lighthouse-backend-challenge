# Builder stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs && \
  chown -R nodejs:nodejs /app

USER nodejs
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
