import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";
import { env } from "../env/server.mjs";

const s3Config: S3ClientConfig = {
  region: env.AWS_S3_REGION,
  credentials: {
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_ACCESS_KEY_SECRET,
  },
};

export const deleteS3Object = async (key: string) => {
  const s3 = new S3Client(s3Config);
  const command = new DeleteObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
  });
  return await s3.send(command);
};

export const putS3Object = async (
  key: string,
  contentType: string,
  body: Buffer
) => {
  const client = new S3Client(s3Config);
  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    // ACL: "public-read",
  });
  console.log("putting s3 object", command);
  return await client.send(command);
};
