#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../server"

npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
