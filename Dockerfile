# NODE AND NPM LTS
FROM node:20-alpine

# BUILD ARGS FOR GENERATING DB TYPES
ARG PGHOST
ARG PGUSER
ARG PGPASSWORD
ARG PGDATABASE
ARG PGPORT
ARG ALLOWED_ORIGINS
ARG NODE_PORT

# CREATE APP DIR
RUN mkdir -p /usr/src/app 
WORKDIR /usr/src/app

# INSTALL DEPENDENCIES

## POSTGRES CLIENT (FOR SCHEMA DUMP)
# RUN echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list.d/sources.list
# RUN apt -y update && apt -y -t jessie-backports install postgresql-client-9.6

## LIBRARIES
COPY package*.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

RUN --mount=type=secret,id=pgaccess \
    export $(cat /run/secrets/pgaccess) \
    export PGPORT=54323 \
    npm run build

ENV NODE_ENV production
ENV NODE_PORT $NODE_PORT
ENV PGHOST $PGHOST
ENV PGUSER $PGUSER
ENV PGPASSWORD $PGPASSWORD
ENV PGDATABASE $PGDATABASE
ENV PGPORT $PGPORT
ENV ALLOWED_ORIGINS $ALLOWED_ORIGINS

# START AND EXPOSE TO HOST-DAEMON
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/npm", "run"]
