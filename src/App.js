import { useState, useEffect } from 'react';
import './App.css';
import { getImages } from './api';

function App() {
  const [images, setImages] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({});
  const[selectedImages,setSelectedImages]= useState([]);
  console.log("checkboxValues",checkboxValues);
  console.log("selectedImages",selectedImages);

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



  const handleCheckboxChange = (event, name) => {
    const { checked } = event.target;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [name]: checked,
    }));

    if (checked) {
      setSelectedImages((prevSelected) => [...prevSelected, name]);
    } else {
      setSelectedImages((prevSelected) => prevSelected.filter((item) => item !== name));
    }
  };

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

  return (
<div className="container">
  <button onClick={handleDelete}>Delete Selected Images</button>
  <p>Selected Images Count: {selectedImages.length}</p>
  <div className="row">
    {images.map((image) => (
      <div className="col-4 custom-column" key={image.id}> 
        <div className="card card-hover custom-card">
          <div className="position-relative">
            <input
              className="form-check-input position-absolute top-0 start-0 m-3"
              type="checkbox"
              id={`inlineCheckbox${image.id}`}
              name={image.id}
              checked={checkboxValues[image.id]}
              onChange={(event) => handleCheckboxChange(event, image.id)}
            />
          </div>
          <img src={process.env.PUBLIC_URL + `/images/${image.image}`} alt={image.name} className="card-img-top" />
        </div>
      </div>
    ))}
  </div>
</div>



  );
}

export default App;
