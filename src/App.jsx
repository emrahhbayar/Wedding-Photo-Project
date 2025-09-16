import { useState, useRef } from 'react'
import axios from "axios";

function App() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState(false);

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
      }
      catch (error) {
        console.error("Dosya yüklenirken hata oluştu:", files[i].name);
        setUploading(false);
        setProgress(0);
        setFiles([]);
        setCurrentIndex(0);
        setUploadError(true);
        setTimeout(() => {
          setUploadError(false);
        }, 5000);
        return;

      }
    }

    setProgress(0);
    setFiles([]);
    setUploading(false);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="w-full max-w-2xl bg-base-100 shadow-xl rounded-2xl p-6 text-center">
        {/* Başlık */}
        <h1 className="text-2xl mb-4">Düğünümüze Hoşgeldiniz...</h1>
        <h2 className="text-5xl font-semibold mb-4 h2css">Berna & Barkın</h2>
        <p className="mb-6 text-gray-900">
          Bizimle paylaşmak istediğiniz fotoğraf ve videolarınızı bekliyoruz.
        </p>

        {/* Fotoğraf Seç Butonu */}
        <button
          className="btn bg-blue-300 mb-4"
          onClick={handleButtonClick}
          disabled={uploading}
        >
          Fotoğraf Seç
        </button>
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
        />

        {/* Yükle & Vazgeç Butonları */}
        {files.length > 0 && (
          <div className="flex justify-center gap-3 mb-6">
            <button
              className="btn bg-emerald-400"
              onClick={uploadFilesSequentially}
              disabled={uploading}
            >
              {uploading
                ? `Yükleniyor... (${currentIndex}/${files.length})`
                : "Yükle"}
            </button>
            <button
              className="btn bg-red-400"
              onClick={ClearFunc}
              disabled={uploading}
            >
              Vazgeç
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="mb-2 text-sm text-gray-700">{currentIndex} - {files[currentIndex - 1]?.name}</div>
            <progress
              className="progress progress-accent w-full"
              value={progress}
              max="100"
            ></progress>
            <div className="mt-1 text-sm text-gray-600">{progress}%</div>
          </div>
        )}

        {/* Dosya Listesi */}
        {files.length > 0 && (
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="font-semibold text-blue-400 mb-2">
              Yüklemek istediğiniz medya dosyaları
            </div>
            <ul className="list text-left pl-5 space-y-1">
              {files.map((file, index) => (
                <li key={index}>
                  {index + 1} - {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Başarı Alert */}
        {uploadComplete && (
          <div className="alert alert-success justify-center text-white">
            ✅ Tüm dosyalar başarıyla yüklendi!
          </div>
        )}
        {uploadError && (
          <div className="alert alert-error justify-center text-white">
            ❌ Dosyalar yüklenirken hata oluştu.
          </div>
        )}
      </div>
    </div>

  )
}

export default App
