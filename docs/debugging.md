you can use chrome to debug, run it locally with the env vars
PORT=8000 DATABASE_HOST=mongodb://127.0.0.1:27017 DATABASE_NAME=language_of_film JWT_SECRET=gkjh2314j3jk4 NODE_ENV=development node --inspect --require ts-node/register src/server.ts

or with `inspect` instead of option `--inspect` to debug directly in the cli
note: that you have to `c` (continue) pass the first one or two breakpoints because it automatically breaks in the ts-node/register code.
PORT=8000 DATABASE_HOST=mongodb://127.0.0.1:27017 DATABASE_NAME=language_of_film JWT_SECRET=gkjh2314j3jk4 NODE_ENV=development node inspect --require ts-node/register src/server.ts