FROM node:16 as builder

WORKDIR /app/PruebaBackend
COPY . .
RUN npm install
RUN npm run build

FROM node:16

WORKDIR /app/proyecto

COPY --from=builder /app/PruebaBackend/dist ./dist
COPY --from=builder /app/PruebaBackend/package.json ./

RUN npm install --prod

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]



