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
