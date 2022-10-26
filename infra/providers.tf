provider "aws" {
  region = local.aws_s3_region
}


provider "vercel" {
  api_token = var.VERCEL_API_TOKEN
}
