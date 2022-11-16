import { Photo } from "@prisma/client";

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

const s3StylePath = (userId: string, styleSlug: string) =>
  `${s3UserPath(userId)}/style/${styleSlug}`;

const s3DepictionPath = (userId: string, modelId: string) =>
  `${s3UserPath(userId)}/depiction/${modelId}`;

export const s3SubjectPhotoRoot = (userId: string, subjectId: string) =>
  `${s3SubjectPath(userId, subjectId)}/photo`;

export const s3SubjectPhotoPath = (
  userId: string,
  subjectId: string,
  photoId: string
) => `${s3SubjectPhotoRoot(userId, subjectId)}/${photoId}.png`;

export const s3PhotoRoot = (
  photo: Pick<Photo, "id" | "owner_id" | "depiction_id" | "style_slug">
) => {
  if (!photo.owner_id) {
    throw new Error("Photo must have an owner_id");
  }
  if (photo.depiction_id) {
    return `${s3DepictionPath(photo.owner_id, photo.depiction_id)}/photo`;
  }
  if (photo.style_slug) {
    return `${s3StylePath(photo.owner_id, photo.style_slug)}/photo`;
  }
  return `${s3UserPath(photo.owner_id)}/photo`;
};

export const s3PhotoRootPath = (
  photo: Pick<Photo, "id" | "owner_id" | "depiction_id" | "style_slug">
) => `${s3PhotoRoot(photo)}/${photo.id}.png`;
