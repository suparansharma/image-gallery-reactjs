import { useState } from 'react';
import './App.css';
import image1 from './images/image-1.webp';
import image2 from './images/image-2.webp';
import image3 from './images/image-3.webp';

function App() {
  const [option1, setOption1] = useState(false);
  const [option2, setOption2] = useState(false);
  const [option3, setOption3] = useState(false);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (name === 'option1') {
      setOption1(checked);
    } else if (name === 'option2') {
      setOption2(checked);
    } else if (name === 'option3') {
      setOption3(checked);
    }
  };

  return (
    <>
    
    <div className="container">
      <div className="row">
        <div className="col-4">
          <div className="card card-hover">
            <div className="position-relative">
              <input
                className="form-check-input position-absolute top-0 start-0 m-3"
                type="checkbox"
                id="inlineCheckbox1"
                name="option1"
                checked={option1}
                onChange={(event) => handleCheckboxChange(event, 'option1')}
              />
            </div>
            <img src={image1} alt="1" className="card-img-top" />
          </div>
        </div>

        <div className="col-4">
          <div className="card card-hover">
            <div className="position-relative">
              <input
                className="form-check-input position-absolute top-0 start-0 m-3"
                type="checkbox"
                id="inlineCheckbox2"
                name="option2"
                checked={option2}
                onChange={(event) => handleCheckboxChange(event, 'option2')}
              />
            </div>
            <img src={image2} alt="2" className="card-img-top" />
          </div>
        </div>

        <div className="col-4">
          <div className="card card-hover">
            <div className="position-relative">
              <input
                className="form-check-input position-absolute top-0 start-0 m-3"
                type="checkbox"
                id="inlineCheckbox3"
                name="option3"
                checked={option3}
                onChange={(event) => handleCheckboxChange(event, 'option3')}
              />
            </div>
            <img src={image3} alt="3" className="card-img-top" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
