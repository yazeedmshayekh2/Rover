#!/bin/bash

# Install required packages
echo "Installing required packages..."
pip install -r requirements.txt

# Start the backend in the background
echo "Starting Flask backend..."
python app.py &
BACKEND_PID=$!

# Go to frontend directory
cd frontend

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Start frontend
echo "Starting React frontend..."
npm start

# When frontend is stopped, kill the backend
kill $BACKEND_PID 