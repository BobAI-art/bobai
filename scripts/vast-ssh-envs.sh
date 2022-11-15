#!/usr/bin/env bash

echo "export AWS_ACCESS_KEY_ID=AKIAXLK4G43COKASINH5"
echo "export AWS_SECRET_ACCESS_KEY=$(pass MODEL_STORE_BUCKET_SECRET_ACCESS_KEY)"
echo "export HUGGINGFACE_TOKEN=$(pass HUGGINGFACE_TOKEN)"
echo "export PORTRAITS_BASE_URL=https://www.bobai.art/"
echo "export MODEL_STORE_BUCKET_NAME=bobai-model-store"
