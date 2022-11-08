export const photoUrl = (photo: {bucket: string, path: string}) => {
  return `https://${photo.bucket}.s3.eu-west-2.amazonaws.com/${photo.path}`
}
