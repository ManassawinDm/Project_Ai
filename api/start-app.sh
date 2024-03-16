#!/bin/sh

# Activate the virtual environment
. /usr/src/app/venv/bin/activate

# Run checkpython.js with node
node /usr/src/app/checkpython.js

# Start the Python API in the background
python /usr/src/app/python/API.py &

# Start the Node.js application
npm start
