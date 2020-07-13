FROM smartroadsense/postgres-cli:lastest

COPY script.sql script.sql

ENTRYPOINT psql -h ${DB_HOST} -d ${DB_NAME} -U ${DB_USER} -f script.sql