data "aws_iam_policy_document" "bucket_access_policy" {
  statement {
    effect    = "Allow"
    actions   = ["s3:putObject", "s3:deleteObject", "s3:List*", "s3:Get*", "s3:Put*"]
    resources = [aws_s3_bucket.bucket.arn, "${aws_s3_bucket.bucket.arn}/*"]
  }
}
