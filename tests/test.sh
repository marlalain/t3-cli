#!/bin/sh

TOOLS_DIR=$(pwd)
npm run build 1>/dev/null
cd /tmp/tmp-app || exit 1
node "$TOOLS_DIR"/dist/index.js
