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
  variables = {
    DATABASE_URL    = var.PROD_DATABASE_URL
    NEXTAUTH_SECRET = var.PROD_NEXTAUTH_SECRET
    EMAIL_FROM      = var.EMAIL_FROM
    EMAIL_SERVER    = var.EMAIL_SERVER
  }
  targets = ["production"]
}

module "preview_environment_variables" {
  source = "./environment_variables"

  project_id = local.vercel_project_id
  variables = {
    DATABASE_URL    = var.PREVIEW_DATABASE_URL
    NEXTAUTH_SECRET = var.PREVIEW_NEXTAUTH_SECRET
    EMAIL_FROM      = var.EMAIL_FROM
    EMAIL_SERVER    = var.EMAIL_SERVER
  }
  targets = ["development", "preview"]
}
