#!/usr/bin/env bash

export PASSWORD_STORE_DIR=$(pwd)/.password-store

cat << EOF > .env
PASSWORD_STORE_DIR=$(pwd)/.password-store
HUGGINGFACE_TOKEN=$(pass HUGGINGFACE_TOKEN)
EOF
