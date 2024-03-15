FROM node:21

# Set the working directory in the container
WORKDIR /usr/src/app

# Install Python, pip, and venv
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && \
    python3 -m venv venv

# Copy .dockerignore, package.json, and package-lock.json
COPY .dockerignore package*.json ./

# Install Node.js dependencies
RUN npm cache clean --force && npm install

# Install Python dependencies
# Use the virtual environment's pip directly
COPY python/requirement.txt ./python/
RUN ./venv/bin/pip install --no-cache-dir -r ./python/requirement.txt

# Copy the rest of your application code to the container
COPY . .

# Inform Docker that the container listens on the specified network port at runtime.
EXPOSE 8112

# Define the command to run your app using CMD which defines your runtime. Here we will use npm start
CMD ["npm", "start"]
