resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name

  tags = local.tags
}

resource "aws_s3_bucket_acl" "bucket_ack" {
  bucket = aws_s3_bucket.bucket.id
  acl    = "private"
}

resource "aws_iam_user" "user" {
  name = "${var.bucket_name}-user"
}

resource "aws_iam_user_policy" "user_policy" {
  name   = "${var.bucket_name}-user-policy"
  user   = aws_iam_user.user.name
  policy = data.aws_iam_policy_document.bucket_access_policy.json
}

resource "aws_iam_access_key" "access_key" {
  user = aws_iam_user.user.name
}

resource "aws_iam_policy" "bucket_access_policy" {
  policy = data.aws_iam_policy_document.bucket_access_policy.json
}
