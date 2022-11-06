# output "training_public_ip" {
#   value = aws_instance.training.public_ip
# }

output "model_store_bucket_name" {
    value = module.model_store.bucket_name
}

output "model_store_bucket_access_key_id" {
    value = module.model_store.bucket_access_key_id
}

output "model_store_bucket_secret_access_key" {
    value = module.model_store.bucket_secret_access_key
    sensitive = true
}
