// ImageCard.js
import React from 'react';

const ImageCard = ({
    image,
    checkboxValues,
    handleToggle,
    draggedImage,
    targetImage,
    handleDragStart,
    handleDragOver,
    handleDrop,
    index
}) => (
    <div
        className={`custom-item  ${index === 0 ? 'first-item' : ''} 
               ${draggedImage === image ? 'dragged' : ''}
               ${targetImage === image ? 'target' : ''}`}
        key={image.id}
        draggable
        onDragStart={(e) => handleDragStart(e, image)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, image)}
        style={{
            transform: draggedImage === image ? 'translate(5px, 5px)' : 'none',
            transition: 'transform 0.3s ease',
        }}
    >
        <div
            className="card"
            onClick={(e) => handleToggle(e, image.id)}
            style={{
                opacity: checkboxValues[image.id] ? 0.5 : 1,
            }}
        >
            <div className="card-item">
                <div className="">
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
                <figure className="image-container">
                    <img
                        className="card-img-top"
                        src={process.env.PUBLIC_URL + `/images/${image.image}`}
                        alt={image.name}
                    />
                    <div className="overlay"></div>
                </figure>
            </div>
        </div>
    </div>
);

export default ImageCard;
