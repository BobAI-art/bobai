import { GeneratedPhoto } from "@prisma/client";

export const photoUrl = (photo: {
  bucket: string;
  root: string;
  id: string;
}) => {
  return `https://${photo.bucket}.s3.eu-west-2.amazonaws.com/${photo.root}/${photo.id}.png`;
};

const s3UserPath = (userId: string) => `user/${userId}`;

const s3SubjectPath = (userId: string, subjectId: string) =>
  `${s3UserPath(userId)}/subject/${subjectId}`;

const s3ParentModelPath = (userId: string, parentModelCode: string) =>
  `${s3UserPath(userId)}/parent-model/${parentModelCode}`;

const s3ModelPath = (userId: string, modelId: string) =>
  `${s3UserPath(userId)}/model/${modelId}`;

export const s3SubjectPhotoRoot = (userId: string, subjectId: string) =>
  `${s3SubjectPath(userId, subjectId)}/photo`;

export const s3SubjectPhotoPath = (
  userId: string,
  subjectId: string,
  photoId: string
) => `${s3SubjectPhotoRoot(userId, subjectId)}/${photoId}.png`;

export const s3GeneratedPhotoRoot = (
  photo: Pick<GeneratedPhoto, "id" | "model_id" | "code" | "owner_id">
) => {
  if (!photo.owner_id) {
    throw new Error("Photo must have an owner_id");
  }
  if (photo.model_id) {
    return `${s3ModelPath(photo.owner_id, photo.model_id)}/photo`;
  }
  if (photo.code) {
    return `${s3ParentModelPath(photo.owner_id, photo.code)}/photo`;
  }
  return `${s3UserPath(photo.owner_id)}/photo`;
};

export const s3GeneratedPhotoRootPath = (
  photo: Pick<GeneratedPhoto, "id" | "model_id" | "code" | "owner_id">
) => `${s3GeneratedPhotoRoot(photo)}/${photo.id}.png`;
