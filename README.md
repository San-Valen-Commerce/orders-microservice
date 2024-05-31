## Description

Orders microservice. This project is a microservice built with NestJS and drizzle ORM. It also comes with a docker-compose file with postgres to manage the storage locally.

## Installation

```bash
$ pnpm install // install dependencies
$ pnpm drizzle-kit generate // generate migrations/creation SQL files
$ cd db
$ docker-compose up -d // start postgres
$ pnpm tsx db/scripts/migrate.ts // Apply migrations/creations in the database
$ cd ..

```
## Run environment

```bash
$ docker-compose up -d // firts cd db, execute this command to start postgres and the cd ..
$ pnpm drizzle-kit studio // start drizzle studio
$ pnpm run start:dev // start the server
```
drizzle studio: https://local.drizzle.studio/

## Run migrations when changes are made to the model

```bash
$ pnpm drizzle-kit generate // generate migrations/creation SQL files
$ pnpm tsx db/scripts/migrate.ts // Apply migrations/creations in the database
```




## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
