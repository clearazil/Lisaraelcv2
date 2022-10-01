Lisaraelc

Discord bot that notifies users of people looking to play a game

Setup:

* Copy .env.example to .env and adjust accordingly
* (optional) Docker:
  * Run `docker-compose up -d` to build, create, start, and attach the docker container
  * Run `docker-compose exec node /bin/bash` to start using the bash shell inside the container
* Run `npm install`

* Migrate the database with `npm run migrator up`
* Revert the last migration with `npm migrator down`
* Revert multiple migrations with `npm migrator down -- --step COUNT `
* Create a new migration with `npm "migrator create" --name=NAME.ts`

* Run tests with `npm run test`

To start running the bot:
  * First compile with `npm run compile`
  * And then `npm run bot`
