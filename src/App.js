import { useState, useEffect } from 'react';
import './App.css';
import { getImages } from './api';

function App() {
  const [images, setImages] = useState([]);

  const [checkboxValues, setCheckboxValues] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [draggedImage, setDraggedImage] = useState(null);

  console.log(checkboxValues);


  useEffect(() => {
    getImages().then((data) => {
      setImages(data);
      const initialIds = data.map((item) => item.id);
      const initialValues = initialIds.reduce((acc, id) => {
        acc[id] = false;
        return acc;
      }, {});
      setCheckboxValues(initialValues);
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
              <button onClick={handleDelete} className="btn btn-danger">
                Delete Selected Images
              </button>
            )}
          </div>
        </h5>

        <div className="custom-grid">
          {images.map((image, index) => (
            <div
              className={`custom-item ${index === 0 ? 'first-item' : ''}`}
              key={image.id}
              draggable
              onDragStart={(e) => handleDragStart(e, image)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, image)}
            >
              <div className="card card-hover custom-card" onClick={(e) => handleToggle(e, image.id)}>
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
                <img
                  src={process.env.PUBLIC_URL + `/images/${image.image}`}
                  alt={image.name}
                  className="card-img-top"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}

export default App;
