FROM node:21-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node . .

ENV PORT=3000
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "src/app.js"]