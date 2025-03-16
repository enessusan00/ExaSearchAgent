#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Setup environment for production
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create one based on .env.example"
    exit 1
fi

# Start the agent
echo "Starting the Exa Search Agent..."
npm start
