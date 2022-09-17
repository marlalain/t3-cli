#!/bin/sh

TOOLS_DIR=$(pwd)
npm run build 1>/dev/null
cd /tmp
rm -rf tmp-app 1>/dev/null
git clone https://github.com/minsk-dev/create-t3-app-template tmp-app 1>/dev/null 2>&1
cd tmp-app
node "$TOOLS_DIR"/dist/index.cjs
