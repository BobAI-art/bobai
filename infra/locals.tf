
locals {
  production = {
    environment     = "production"
    bucket_name     = "portraits-production"
    allowed_origins = ["https://*.vercel.app/"]
  }

  preview = {
    environment     = "preview"
    bucket_name     = "portraits-preview"
    allowed_origins = ["http://localhost:3000", "https://*.vercel.app/"]
  }

  vercel_project_id  = "prj_PteHYMtCfDnve5l5AyHI5Hsk3NwK"
  password_store_dir = "~/.password-store"
  aws_s3_region      = "eu-west-2"
}
