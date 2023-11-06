
import imageData from './ImageData.json';

export const getImages = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(imageData);
    },); 
  });
};
