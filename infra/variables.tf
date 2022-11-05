variable "PROD_DATABASE_URL" {
  type     = string
  nullable = false
}

variable "PROD_NEXTAUTH_SECRET" {
  type     = string
  nullable = false
}

variable "PREVIEW_DATABASE_URL" {
  type     = string
  nullable = false
}

variable "PREVIEW_NEXTAUTH_SECRET" {
  type     = string
  nullable = false
}

variable "VERCEL_API_TOKEN" {
  type     = string
  nullable = false
}

variable "EMAIL_FROM" {
  type     = string
  nullable = false
}

variable "EMAIL_SERVER" {
  type     = string
  nullable = false
}

variable "DEPLOYER_PUBLICK_KEY_PATH" {
  type     = string
  nullable = false
}
