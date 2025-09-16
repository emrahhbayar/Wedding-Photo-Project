import { useRef, useState } from "react";
import axios from "axios";

function App() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const uploadFilesSequentially = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setCurrentIndex(0);

    for (let i = 0; i < files.length; i++) {
      setCurrentIndex(i + 1);
      const formData = new FormData();
      formData.append("files", files[i]);

      try {
        await axios.post("https://emrahbayar.xyz/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            // Eğer total boş ya da yanlışsa dosya boyutunu kullan
            const total = progressEvent.total ?? files[i].size;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / total
            );
            setProgress(percentCompleted);
          },

        });
      } catch (error) {
        console.error("Dosya yüklenirken hata oluştu:", files[i].name);
      }
    }

    setUploading(false);
    setProgress(0);
    setFiles([]);
    setCurrentIndex(0);
    setUploadComplete(true);

    setTimeout(() => {
      setUploadComplete(false);
    }, 5000);
  };

  const ClearFunc = () => {
    setFiles([]);
  }

  return (
    <div className='container text-center'>
      <div className="row d-flex justify-content-center align-items-center vh-100">
        <div className="col-lg-12 col-md-6 col-sm">
          <div className="d-flex flex-column align-items-center justify-content-center vh-100">
            <h1 className='h1 mt-3'>Düğünümüze hoşgeldiniz!</h1>
            <h1 className='h1 '>Berna & Barkın</h1>
            <p className='my-3'>Bizimle paylaşmak istediğiniz fotoğraf ve videolarınızı bekliyoruz.</p>

            <button className="btn btn-primary mb-3" onClick={handleButtonClick} disabled={uploading}>
              Fotoğraf Seç
            </button>
            <input
              type="file"
              accept="image/*,video/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple
            />

            {/* Yükle butonu */}
            {files.length > 0 && (
              <div className="mb-3">
                <button className="btn btn-success" onClick={uploadFilesSequentially} disabled={uploading}>
                  {uploading ? `Yükleniyor... (${currentIndex}/${files.length})` : "Yükle"}
                </button>
                <button className="btn btn-danger ms-2" onClick={ClearFunc} disabled={uploading}>Vazgeç</button>
              </div>
            )}
            {/* Progress Bar */}
            {uploading && (
              <div className="w-50">
                <div className="mb-2 text-center">
                  {files[currentIndex - 1]?.name}
                </div>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {progress}%
                  </div>
                </div>

              </div>
            )}
            {/* Seçilen dosya isimleri */}
            {files.length > 0 && (
              <ul className="list-group w-50 mb-3">
                <li className="list-group-item text-center list-group-item-primary">Yüklemek istediğiniz medya dosyaları</li>
                {files.map((file, index) => (
                  <li key={index} className="list-group-item border-none">
                    {index + 1} - {file.name}
                  </li>
                ))}
              </ul>
            )}

            {uploadComplete && (
              <div className="alert alert-success mt-3 w-50 text-center" role="alert">✅ Tüm dosyalar başarıyla yüklendi!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
