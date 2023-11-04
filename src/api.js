// api.js
import imageData from './ImageData.json';

export const getImages = () => {
  // Simulate an API call to get image data.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(imageData);
    },); // Simulate a 1-second delay (you can adjust this as needed).
  });
};
