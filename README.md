# dioe-public-api

Public API for Data from DiÖ.

## Architecture

This project uses a three-tiered layer-cake architecture:

1. All REST routes should be defined in `Controllers`, which can call…
2. `Services` which transform data and get data their from…
3. `DAO`s (Data Access Objects) that query a Postgres database using prepared statements with auto generated types.

## Basics

Controllers should not call DAOs directly and contain no significant business logic. Services only deal with business logic, not with the transport protocol or the persistance layer. DAOs and Services can call each other to combine data, if necessary. All methods must have type signatures, especially in controllers. Requests should usually not take longer than 250 ms.

## Stack

- This project uses TSOA for routing and generating the OpenAPI Spec (see http://github.com/lukeautry/tsoa).
- Queries are performed and type checked via pg-typed (see https://pgtyped.now.sh)
- For maximum comfort and safety when writing queries, use with VSCode plugin "SQL tagged template literals" (`frigus02.vscode-sql-tagged-template-literals`).
