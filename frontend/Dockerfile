FROM node:20-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 5173

CMD ["sh", "-c", "npm run dev -- --host & sleep 4 && echo '' && echo '  Pagina corriendo en: http://localhost:5173' && echo '' && wait"]