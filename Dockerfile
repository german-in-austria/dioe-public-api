# NODE AND NPM LTS
FROM node:12

# BUILD ARGS FOR GENERATING DB TYPES
ARG PGHOST
ARG PGUSER
ARG PGPASSWORD
ARG PGDATABASE
ARG PGPORT

# CREATE APP DIR
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# INSTALL DEPENDENCIES

## POSTGRES CLIENT (FOR SCHEMA DUMP)
# RUN echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list.d/sources.list
# RUN apt -y update && apt -y -t jessie-backports install postgresql-client-9.6

## LIBRARIES
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install

COPY . /usr/src/app

RUN npm run build

# START AND EXPOSE TO HOST-DAEMON
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/npm", "run"]
