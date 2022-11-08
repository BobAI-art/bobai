export const photoUrl = (photo: {bucket: string, root: string, id: string}) => {
  return `https://${photo.bucket}.s3.eu-west-2.amazonaws.com/${photo.root}/${photo.id}.png`;
}

const s3UserPath = (userId: string) => `user/${userId}`;

const s3SubjectPath = (userId: string, subjectId: string) => `${s3UserPath(userId)}/subject/${subjectId}`;

const s3ModelPath = (userId: string, subjectId: string, modelId: string) =>
  `${s3SubjectPath(userId, subjectId)}/model/${modelId}`;


export const s3SubjectPhotoRoot = (
  userId: string,
  subjectId: string,
) => `${s3UserPath(userId)}/subject/${subjectId}/photo`;

export const s3SubjectPhotoPath = (
  userId: string,
  subjectId: string,
  photoId: string,
) => `${s3SubjectPhotoRoot(userId, subjectId)}/${photoId}.png`;

export const s3GeneratedPhotoRoot = (
  userId: string,
  subjectId: string,
  modelId: string,
) => `${s3ModelPath(userId, subjectId, modelId)}/generated`;


export const s3GeneratedPhotoPath = (
  userId: string,
  subjectId: string,
  modelId: string,
  photoId: string,
) => `${s3GeneratedPhotoRoot(userId, subjectId, modelId)}/${photoId}.png`;
