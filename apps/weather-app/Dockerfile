FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npx nx build weather-app --prod

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/dist/apps/weather-app /app
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3000
CMD ["node", "main.js"]
