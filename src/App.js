import { useState, useEffect } from 'react';
import './App.css';
import { getImages } from './api';

function App() {
  const [images, setImages] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  console.log("checkboxValues", checkboxValues);
  console.log("selectedImages", selectedImages);

  useEffect(() => {
    getImages().then((data) => {
      setImages(data);

      // Initialize checkbox values with only IDs
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

  return (
    <div className="container">
      <div className="row">
        {images.map((image) => (
          <div className="col-4" key={image.id}>
            <div className="card card-hover">
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
