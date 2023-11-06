import { useState, useEffect } from 'react';
import './App.css';
import { getImages } from './api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ImageCard from './components/ImageCard';


function App() {
  const [images, setImages] = useState([]);

  const [checkboxValues, setCheckboxValues] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [draggedImage, setDraggedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    setIsLoading(true);
    getImages()
      .then((data) => {
        setImages(data);
        const initialIds = data.map((item) => item.id);
        const initialValues = initialIds.reduce((acc, id) => {
          acc[id] = false;
          return acc;
        }, {});
        setCheckboxValues(initialValues);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);



  const handleDelete = () => {
    const updatedImages = images.filter((image) => !selectedImages.includes(image.id));
    setImages(updatedImages);
    setSelectedImages([]);
    const updatedCheckboxValues = { ...checkboxValues };
    selectedImages.forEach((id) => {
      updatedCheckboxValues[id] = false;
    });
    setCheckboxValues(updatedCheckboxValues);
  };

  const [targetImage, setTargetImage] = useState(null);




  const handleDragStart = (event, image) => {
    event.dataTransfer.setData('text/plain', image.id);
    setDraggedImage(image);
  };

  const handleDragOver = (event, targetImage) => {
    event.preventDefault();
    // Find the targetImage based on the event data
    const targetImageId = event.dataTransfer.getData('text/plain');
    const foundImage = images.find((image) => image.id === targetImageId);

    if (foundImage) {
      setTargetImage(foundImage);
    }
  };


  const handleDrop = (event, targetImage) => {
    event.preventDefault();

    // Swap the positions of the draggedImage and targetImage
    const updatedImages = images.map((image) => {
      if (image.id === targetImage.id) {
        return draggedImage;
      }
      if (image.id === draggedImage.id) {
        return targetImage;
      }
      return image;
    });

    setImages(updatedImages);
    setDraggedImage(null);
    setTargetImage(null);
  };



  const handleToggle = (event, imageId) => {
    if (event.target.type === 'checkbox') {
      // If it's a checkbox, update the checkboxValues state
      const isChecked = event.target.checked;
      setCheckboxValues((prevCheckboxValues) => ({
        ...prevCheckboxValues,
        [imageId]: isChecked,
      }));

      // Update the selectedImages state based on checkbox state
      if (isChecked) {
        setSelectedImages((prevSelectedImages) => [...prevSelectedImages, imageId]);
      } else {
        setSelectedImages((prevSelectedImages) => prevSelectedImages.filter(id => id !== imageId));
      }
    } else {
      // If it's a card click, simulate a click on the associated checkbox
      const checkbox = document.getElementById(`inlineCheckbox${imageId}`);
      if (checkbox) {
        checkbox.click();
      }
    }
  };

  return (
    <div className="fullBody">
      <div className="container">
        <div className="card">
          <h5 className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              {selectedImages.length > 0 ? (
                <div>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                    checked
                  />
                  {selectedImages.length} Files Selected
                </div>
              ) : (

                <h4 > Gallery</h4>
              )}
              {selectedImages.length > 0 && (
                <div>
                  <h6 className="text-danger delete-files" onClick={handleDelete}> Delete files</h6>
                </div>
              )}

            </div>
          </h5>
          {isLoading ? (
            <div className="loading-icon">
              <FontAwesomeIcon icon={faSpinner} spin size="3x" />

            </div>
          ) : (

            <div className="container">

              <div className="custom-grid">


              {images.map((image, index) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    checkboxValues={checkboxValues}
                    handleToggle={handleToggle}
                    draggedImage={draggedImage}
                    targetImage={targetImage}
                    handleDragStart={handleDragStart}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    index={index}
                  />
                ))}

                <div className="custom-item">
                  <figure className="custom-card-container">
                    <div className="custom-card hover12 custom-card-content">
                      <FontAwesomeIcon icon={faImage} />
                      <p>Add Images</p>
                    </div>
                  </figure>
                </div>






              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );

}

export default App;
