# Use a specific version of the node base image
FROM node:21

# Set the working directory in the container
WORKDIR /usr/src/app

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create a Python virtual environment and activate it
RUN python3 -m venv /usr/src/app/venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

# Copy the Python requirements file and install Python dependencies
COPY ./python/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the Node.js package.json and package-lock.json files
COPY .dockerignore package*.json ./

# Install Node.js dependencies
RUN npm cache clean --force && npm install

# Copy the rest of your application code to the container
COPY . .

# Inform Docker that the container listens on the specified network port at runtime.
EXPOSE 8112

# Use a shell script to start both Node.js and Python applications
COPY start-app.sh .
RUN chmod +x start-app.sh
CMD ["/bin/bash", "./start-app.sh"]

