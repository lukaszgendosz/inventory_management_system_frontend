FROM node:16-alpine AS build

WORKDIR /app

COPY *.json ./

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--host"]

# COPY . .

# RUN npm run build

# FROM nginx:alpine

# COPY --from=build /app/dist /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]