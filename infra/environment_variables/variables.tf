
variable "project_id" {
  type     = string
  nullable = false
}

variable "team_id" {
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

    VAST_API_KEY       = string
    DOCKER_IO_PASSWORD = string

    HUGGINGFACE_TOKEN = string

    AWS_S3_MODEL_ACCESS_KEY_ID     = string
    AWS_S3_MODEL_ACCESS_KEY_SECRET = string
    AWS_S3_MODEL_BUCKET_NAME       = string
    SITE_PIN           = string
    UPSTASH_REDIS_REST_URL = string
    UPSTASH_REDIS_REST_TOKEN = string
  })
  nullable = false
}

variable "targets" {
  type = list(string)
}
