import { useState, useEffect } from 'react';
import './App.css';
import { getImages } from './api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faImage, faSpinner } from '@fortawesome/free-solid-svg-icons';


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


  const handleDragStart = (event, image) => {
    event.dataTransfer.setData('text/plain', image.id);
    setDraggedImage(image);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
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
    <div className="container">
      <div className="card">
        <h5 className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            {selectedImages.length > 0 && (
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
            )}
            {selectedImages.length > 0 && (
              // <button onClick={handleDelete} className="btn btn-danger">
              //   Delete Selected Images
              // </button>

              <h6 className="text-danger" onClick={handleDelete}> Delete files</h6>
            )}
          </div>
        </h5>
        {isLoading ? ( // Display loading icon while isLoading is true
          <div className="loading-icon">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />

          </div>
        ) : (

          <div className="custom-grid">


            {images.map((image, index) => (
              <div
                className={`custom-item  ${index === 0 ? 'first-item' : ''}`}
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, image)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, image)}
              >
                <div
                  className="card card-hover custom-card hover12"
                  onClick={(e) => handleToggle(e, image.id)}
                  style={{
                    opacity: checkboxValues[image.id] ? 0.3 : 1, // Set opacity to 1 for checked, 0.3 for unchecked
                  }}
                >
                  <div className="position-relative">
                    <input
                      className="form-check-input position-absolute top-0 start-0 m-3"
                      type="checkbox"
                      id={`inlineCheckbox${image.id}`}
                      name={image.id}
                      checked={checkboxValues[image.id]}
                      onChange={(event) => handleToggle(event, image.id)}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </div>
                  <figure>
                    <img
                      src={process.env.PUBLIC_URL + `/images/${image.image}`}
                      alt={image.name}
                      className="card-img-top"
                    />
                  </figure>
                </div>
              </div>
            ))}






            {/* Place the FontAwesomeIcon within the custom-grid as the last item */}
            <div className="custom-item">
              <figure className="custom-card-container">
                <div className="custom-card hover12 custom-card-content">
                  <FontAwesomeIcon icon={faImage} />
                  <p>Add Images</p>
                </div>
              </figure>
            </div>






          </div>
        )}


      </div>
    </div>
  );

}

export default App;
