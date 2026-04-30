#!/bin/bash

if ! ollama --version &>/dev/null; then
    echo "Installing Ollama..."
    
    if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux"* ]]; then
        curl -fsSL https://ollama.com/install.sh | sh

    else
        echo "Windows detected. Please install Ollama manually from https://ollama.com/download"
        echo "Then re-run this script."
        exit 1
    fi
fi

if ! ps -a | grep -q ollama; then
    echo "Starting Ollama..."
    ollama serve &
    sleep 2
fi

if ! ollama list | grep -q "llama3.1:8b"; then
    echo "Pulling llama3.1:8b..."
    ollama pull llama3.1:8b
fi

npm install
npm run dev