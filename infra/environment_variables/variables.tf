
variable "project_id" {
  type     = string
  nullable = false
}

variable "variables" {
  type = object({
    DATABASE_URL    = string
    NEXTAUTH_SECRET = string
  })
  nullable = false
}

variable "targets" {
  type = list(string)
}
