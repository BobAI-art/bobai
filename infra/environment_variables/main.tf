terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.9.1"
    }
  }
  required_version = ">= 1.2.0"
}


variable "project_id" {
  type     = string
  nullable = false
}

variable "variables" {
  type     = object({})
  nullable = false
}

variable "targets" {
  type = list(string)
}
