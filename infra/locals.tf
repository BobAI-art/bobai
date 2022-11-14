
locals {
  production = {
    environment     = "production"
    bucket_name     = "bobai"
    allowed_origins = ["https://*.vercel.app/"]
  }

  preview = {
    environment     = "preview"
    bucket_name     = "bobai-preview"
    allowed_origins = ["http://localhost:3000", "https://*.vercel.app/"]
  }

  vercel_project_id  = "prj_y8qv2orlbqCw74egRf5AnzWsWnBk"
  vercel_team_id     = "team_8EdmsQf6MvCocTPZ5GBueyJJ"
  password_store_dir = "~/.password-store"
  aws_s3_region      = "eu-west-2"
}
