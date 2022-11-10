resource "vercel_project_environment_variable" "database_url" {
  project_id = var.project_id
  key        = "DATABASE_URL"
  value      = var.variables.DATABASE_URL
  target     = var.targets
}

resource "vercel_project_environment_variable" "nextauth_secret" {
  project_id = var.project_id
  key        = "NEXTAUTH_SECRET"
  value      = var.variables.NEXTAUTH_SECRET
  target     = var.targets
}

resource "vercel_project_environment_variable" "email_from" {
  project_id = var.project_id
  key        = "EMAIL_FROM"
  value      = var.variables.EMAIL_FROM
  target     = var.targets
}


resource "vercel_project_environment_variable" "email_server" {
  project_id = var.project_id
  key        = "EMAIL_SERVER"
  value      = var.variables.EMAIL_SERVER
  target     = var.targets
}

resource "vercel_project_environment_variable" "aws_s3_access_key_id" {
  project_id = var.project_id
  key        = "AWS_S3_ACCESS_KEY_ID"
  value      = var.variables.AWS_S3_ACCESS_KEY_ID
  target     = var.targets
}

resource "vercel_project_environment_variable" "aws_s3_access_key_secret" {
  project_id = var.project_id
  key        = "AWS_S3_ACCESS_KEY_SECRET"
  value      = var.variables.AWS_S3_ACCESS_KEY_SECRET
  target     = var.targets
}

resource "vercel_project_environment_variable" "aws_s3_bucket" {
  project_id = var.project_id
  key        = "AWS_S3_BUCKET"
  value      = var.variables.AWS_S3_BUCKET
  target     = var.targets
}

resource "vercel_project_environment_variable" "aws_s3_region" {
  project_id = var.project_id
  key        = "AWS_S3_REGION"
  value      = var.variables.AWS_S3_REGION
  target     = var.targets
}


resource "vercel_project_environment_variable" "vast_api_key" {
    project_id = var.project_id
    key = "VAST_API_KEY"
    value = var.variables.VAST_API_KEY
    target = var.targets
}

resource "vercel_project_environment_variable" "docker_io_password" {
    project_id = var.project_id
    key = "DOCKER_IO_PASSWORD"
    value = var.variables.DOCKER_IO_PASSWORD
    target = var.targets
}
