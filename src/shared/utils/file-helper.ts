export const getOriginalImage = (thumbnailImageUrl: string) => {
  return thumbnailImageUrl.replace('/thumbnail', '');
};
