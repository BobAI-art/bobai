
output "bucket_access_key_id" {
  value = aws_iam_access_key.access_key.id
}
output "bucket_secret_access_key" {
  value = aws_iam_access_key.access_key.secret
}

output "bucket_name" {
  value = var.bucket_name
}
