FROM smartroadsense/postgres-cli

COPY script.sql script.sql

ENTRYPOINT psql -h ${DB_HOST} -d ${DB_NAME} -U ${DB_USER} -f script.sql