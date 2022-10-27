variable "bucket_name" {
  nullable    = false
  type        = string
  description = "Name of the bucket to create"
}

variable "environment" {
  nullable    = false
  type        = string
  description = "Environment for the bucket"
}

variable "allowed_origins" {
  nullable    = false
  type        = list(string)
  description = "Allowed origins for the bucket"
}
