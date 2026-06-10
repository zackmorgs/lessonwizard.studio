#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Installing root dependencies..."
npm install --prefix "$ROOT_DIR"

echo "Installing client dependencies..."
npm install --prefix "$ROOT_DIR/src/client"

echo "Restoring .NET dependencies..."
dotnet restore "$ROOT_DIR/src/server/Host/Host.csproj"

echo "All dependencies installed."
