
locals {
  production = {
    environment = "production"
  }

  staging = {
    environment = "staging"
  }

  vercel_project_id  = ""
  password_store_dir = "~/.password-store"
}
