source .env

HOST="$SSH_USER@$DOMAIN"

# # https://stackoverflow.com/a/63438492
rsync -vhra src/* $HOST:$WWW_DIR --delete-after