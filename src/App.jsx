import './App.css'
import { useRef, useState } from "react";

function App() {
  const fileInputRef = useRef(null);
  const [fileNames, setFileNames] = useState([]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const names = files.map((file) => file.name); // sadece isimlerini alıyoruz
    setFileNames(names);
  };
  return (
    <div className='container text-center'>
      <div className="row d-flex justify-content-center align-items-center vh-100">
        <div className="col-lg-12 col-md-6 col-sm">
          <h1 className='h1 mt-3'>Düğünümüze hoşgeldiniz!</h1>
          <h1 className='h1'>Berna & Barkın</h1>
          <p className='mt-3'>Bizimle paylaşmak istediğiniz fotoğraflarınızı bekliyoruz.</p>
          <div className='d-flex flex-column align-items-center'>
            <button onClick={handleButtonClick} className='btn btn-success mb-3'>Fotoğraf paylaş</button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple
            />
            {fileNames.length > 0 && (
              <ul className="list-group mb-3">
                {fileNames.map((name, index) => (
                  <li key={index} className="list-group-item">
                    {name}
                  </li>
                ))}
              </ul>
            )}
            <button className='btn btn-secondary'>Yükle</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
