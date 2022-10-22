
variable "project_id" {
  type     = string
  nullable = false
}

variable "variables" {
  type = object({
    DATABASE_URL    = string
    NEXTAUTH_SECRET = string
    EMAIL_FROM      = string
    EMAIL_SERVER    = string
  })
  nullable = false
}

variable "targets" {
  type = list(string)
}
