locals {
  tags = {
    Name        = "${var.environment}_${var.bucket_name}"
    Environment = var.environment
  }
}
