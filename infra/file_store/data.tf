data "aws_iam_policy_document" "bucket_policy" {
  statement {
    sid    = "PublicListGet"
    effect = "Allow"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions   = ["s3:List*", "s3:Get*"]
    resources = [aws_s3_bucket.bucket.arn, "${aws_s3_bucket.bucket.arn}/*"]
  }
}

data "aws_iam_policy_document" "bucket_access_policy" {
  statement {
    effect    = "Allow"
    actions   = ["s3:putObject", "s3:deleteObject"]
    resources = [aws_s3_bucket.bucket.arn, "${aws_s3_bucket.bucket.arn}/*"]
  }
}
