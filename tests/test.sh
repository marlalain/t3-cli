#!/bin/sh

TOOLS_DIR=$(pwd)
npm run build 1>/dev/null || exit 1
cd ~/playground/cal.com || exit 1
node "$TOOLS_DIR"/dist/index.js migrate
