export $(cat env-build.env | xargs) \
  && docker build . -t dioe/dioe-public-api \
    --build-arg PGHOST \
    --build-arg PGUSER \
    --build-arg PGPASSWORD \
    --build-arg PGDATABASE \
    --build-arg PGPORT \
  && docker push dioe/dioe-public-api
