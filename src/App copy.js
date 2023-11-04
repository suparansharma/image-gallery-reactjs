import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
  }

  return (
    <div className="container">
      <button onClick={handleDelete}>Delete Selected Images</button>
      <p>Selected Images Count: {selectedImages.length}</p>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="characters">
          {(provided) => (
            <div className="row">
              {images.map(({ image, id, name }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided) => (
                    <div className="col-4 custom-column" key={id}>
                      <div className="card card-hover custom-card">
                        <div className="position-relative">
                          <input
                            className="form-check-input position-absolute top-0 start-0 m-3"
                            type="checkbox"
                            id={`inlineCheckbox${id}`}
                            name={image.id}
                            checked={checkboxValues[id]}
                            onChange={(event) => handleCheckboxChange(event, id)}
                          />
                        </div>
                        <img src={process.env.PUBLIC_URL + `/images/${image}`} alt={name} className="card-img-top" />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

            </div>

          )}
        </Droppable>
      </DragDropContext>
    </div>



  );
}

export default App;
