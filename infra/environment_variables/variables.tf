
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

    AWS_S3_ACCESS_KEY_ID     = string
    AWS_S3_ACCESS_KEY_SECRET = string
    AWS_S3_BUCKET            = string
    AWS_S3_REGION            = string
  })
  nullable = false
}

variable "targets" {
  type = list(string)
}
