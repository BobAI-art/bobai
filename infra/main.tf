terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~>0.9.1"
    }
  }
  required_version = ">= 1.2.0"
}


module "production_environment_variables" {
  source = "./environment_variables"

  project_id = local.vercel_project_id
  team_id    = local.vercel_team_id
  variables = {
    DATABASE_URL    = var.PROD_DATABASE_URL
    NEXTAUTH_SECRET = var.PROD_NEXTAUTH_SECRET
    EMAIL_FROM      = var.EMAIL_FROM
    EMAIL_SERVER    = var.EMAIL_SERVER

    VAST_API_KEY       = var.VAST_API_KEY
    DOCKER_IO_PASSWORD = var.DOCKER_IO_PASSWORD
    HUGGINGFACE_TOKEN  = var.HUGGINGFACE_TOKEN

    AWS_S3_ACCESS_KEY_ID     = module.production_file_store.bucket_access_key_id
    AWS_S3_ACCESS_KEY_SECRET = module.production_file_store.bucket_secret_access_key
    AWS_S3_BUCKET            = module.production_file_store.bucket_name
    AWS_S3_REGION            = local.aws_s3_region

    AWS_S3_MODEL_ACCESS_KEY_ID     = module.model_store.bucket_access_key_id
    AWS_S3_MODEL_ACCESS_KEY_SECRET = module.model_store.bucket_secret_access_key
    AWS_S3_MODEL_BUCKET_NAME       = module.model_store.bucket_name
  }
  targets = ["production"]
}

module "preview_environment_variables" {
  source = "./environment_variables"

  project_id = local.vercel_project_id
  team_id    = local.vercel_team_id
  variables = {
    DATABASE_URL    = var.PREVIEW_DATABASE_URL
    NEXTAUTH_SECRET = var.PREVIEW_NEXTAUTH_SECRET
    EMAIL_FROM      = var.EMAIL_FROM
    EMAIL_SERVER    = var.EMAIL_SERVER

    VAST_API_KEY       = var.VAST_API_KEY
    DOCKER_IO_PASSWORD = var.DOCKER_IO_PASSWORD
    HUGGINGFACE_TOKEN  = var.HUGGINGFACE_TOKEN

    AWS_S3_ACCESS_KEY_ID     = module.preview_file_store.bucket_access_key_id
    AWS_S3_ACCESS_KEY_SECRET = module.preview_file_store.bucket_secret_access_key
    AWS_S3_BUCKET            = module.preview_file_store.bucket_name
    AWS_S3_REGION            = local.aws_s3_region

    AWS_S3_MODEL_ACCESS_KEY_ID     = module.model_store.bucket_access_key_id
    AWS_S3_MODEL_ACCESS_KEY_SECRET = module.model_store.bucket_secret_access_key
    AWS_S3_MODEL_BUCKET_NAME       = module.model_store.bucket_name
  }
  targets = ["development", "preview"]
}

module "preview_file_store" {
  source = "./file_store"

  bucket_name     = local.preview.bucket_name
  allowed_origins = local.preview.allowed_origins
  environment     = local.preview.environment
}

module "production_file_store" {
  source = "./file_store"

  bucket_name     = local.production.bucket_name
  allowed_origins = local.production.allowed_origins
  environment     = local.production.environment
}

# module "training" {
#   source = "./training"
#
#   deployer_public_key = file(var.DEPLOYER_PUBLICK_KEY_PATH)
# }

module "model_store" {
  source = "./model_store"

  bucket_name = "bobai-model-store"
}
