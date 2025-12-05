# Dockerfile (replace existing)
FROM node:20-bullseye-slim

WORKDIR /app

# copy package manifest first so npm install can be cached
COPY package*.json ./

# Install dependencies
RUN npm install --production

# copy app
COPY . .

# expose and start
EXPOSE 3000
CMD ["npm", "start"]
