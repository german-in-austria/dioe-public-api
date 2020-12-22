# dioe-public-api

Public API for Data from DiÖ.

## Architecture

This project uses a three-tiered layer-cake architecture:

1. All REST routes should be defined in `Controllers`, which can call…
2. `Services` which transform data and get data their from…
3. `DAO`s (Data Access Objects) that query a Postgres database using prepared statements with auto generated types.

## Basics

- Controllers should not call DAOs directly and contain no significant business logic.
- Services only deal with business logic, not with the transport protocol or the persistence layer.
- DAOs and Services can call each other to combine data, if necessary.
- All methods must have type signatures, especially in controllers. Requests should usually not take longer than 250 ms.
- Object properties coming from Postgres are automatically converted to `camelCase`, I. e. `SELECT id as user_id from users` will result in `[{userId: 1}, …]`. This is accounted for in the generated types.

## Stack

- This project uses TSOA for routing and generating the OpenAPI Spec (see http://github.com/lukeautry/tsoa).
- Queries are performed and type checked via pg-typed (see https://pgtyped.now.sh)
- use `npm run dev` to start the development environment
- For maximum comfort and safety when writing queries, use with VSCode plugin "SQL tagged template literals" (`frigus02.vscode-sql-tagged-template-literals`).

## Build and Deploy

Run `./docker-build-and-push.sh`. You might have to make the script it executable using `chmod 775 docker-build-and-push.sh`. Remote CI is WIP.
