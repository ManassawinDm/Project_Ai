# FROM node:16

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 8112

# CMD ["npm", "start"]


FROM node:21

WORKDIR /usr/src/app

# Ensure we're not copying local node_modules
COPY .dockerignore .

# Copy package.json and package-lock.json
COPY package*.json ./

# Clear any existing npm cache, and install dependencies, including native addons
RUN npm cache verify && npm install

# Copy the rest of your application code
COPY . .

EXPOSE 8112

CMD ["npm", "start"]
