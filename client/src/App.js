import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PanelAdmin from "./components/PanelAdmin";
import MostrarProductos from "./components/MostrarProductos";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import ExcelUploader from "./components/excel/ExcelUploader";
import "./App.css";

const App = () => {
  const [decorImages, setDecorImages] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [buttonText, setButtonText] = useState("Página de decoración");

  useEffect(() => {
    const loadDecorImages = () => {
      // Usar siempre las imágenes locales fijas para el botón de decoración
      const localImages = [
        { url: '/images/Attached_image.jpg', name: 'Decoración 1' },
        { url: '/images/car.png', name: 'Decoración 2' },
        { url: '/images/espe.png', name: 'Decoración 3' },
        { url: '/images/sushi.jpg', name: 'Decoración 4' },
        { url: '/images/vaos.png', name: 'Decoración 5' }
      ];
      setDecorImages(localImages);
    };

    const fetchButtonText = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_PROXY}/api/decor-images/button`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data.payload && data.payload.text) {
          setButtonText(data.payload.text);
        }
      } catch (error) {
        console.log("Error fetching button text:", error);
      }
    };
    
    loadDecorImages();
    fetchButtonText();
  }, []);

  return (
    <Router>
      {/* Full-width responsive banner above the header/content */}
      <div className="banner-wrapper">
        <div className="banner-text">
          <div className="brand-title">NELDO MARTINEZ</div>
          <div className="brand-subtitle">- COFFE & WINES -</div>
        </div>
      </div>
      <div className="banner-separator" aria-hidden="true"></div>
      <div className="decor-link-area" role="region" aria-label="Acceso a página de decoración">
        <a
          className="decor-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          title="Visitá nuestra página de decoración"
          onMouseEnter={() => setShowImages(true)}
          onMouseLeave={() => setShowImages(false)}
        >
          <span className="border-flower" aria-hidden="true"></span>
          <span className="border-flower-right" aria-hidden="true"></span>
          <span className="border-flower-bottom-left" aria-hidden="true"></span>
          <span className="border-flower-bottom-right" aria-hidden="true"></span>
          <span className="border-flower-left" aria-hidden="true"></span>
          <span className="border-flower-top-center" aria-hidden="true"></span>
          <span className="border-flower-top-left-2" aria-hidden="true"></span>
          <span className="border-flower-top-right-2" aria-hidden="true"></span>
          <span className="border-flower-bottom-center" aria-hidden="true"></span>
          <span className="border-flower-left-2" aria-hidden="true"></span>
          <span className="border-flower-right-2" aria-hidden="true"></span>
          <span className="border-flower-top-left-3" aria-hidden="true"></span>
          <span className="border-flower-top-right-3" aria-hidden="true"></span>
          <span className="border-flower-bottom-left-3" aria-hidden="true"></span>
          <span className="border-flower-bottom-right-3" aria-hidden="true"></span>
          <span className="border-flower-left-3" aria-hidden="true"></span>
          <span className="border-flower-right-3" aria-hidden="true"></span>
          <span className="border-flower-top-3" aria-hidden="true"></span>
          <span className="border-flower-bottom-3" aria-hidden="true"></span>
          {buttonText}
        </a>
        {showImages && decorImages.length > 0 && (
          <div className={`decor-image-popup ${showImages ? 'show' : ''}`}>
            <div className="decor-image-grid">
            {decorImages.slice(0, 6).map((image, index) => {
              const baseUrl = process.env.REACT_APP_PROXY || "";
              const imageUrl = image.url?.startsWith("http")
                ? image.url
                : `${baseUrl}${image.url || ""}`;

              return (
                <img 
                  key={index} 
                  src={imageUrl} 
                  alt={image.name || `Decoración ${index + 1}`}
                  onLoad={() => {
                    console.log("Image loaded successfully:", imageUrl);
                  }}
                  onError={(e) => {
                    console.log("Image failed to load, using fallback:", imageUrl);
                    // Try different fallback images from client/public/images/
                    const fallbackImages = [
                      '/images/Attached_image.jpg',
                      '/images/car.png', 
                      '/images/espe.png',
                      '/images/sushi.jpg',
                      '/images/vaos.png'
                    ];
                    const fallbackUrl = fallbackImages[index % fallbackImages.length];
                    e.target.src = fallbackUrl;
                  }}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd'
                  }}
                />
              );
            })}
          </div>
          </div>
        )}
      </div>
      <Routes>
        <Route path="/excel" element={<ExcelUploader />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel" element={<ProtectedRoute roleRequired="admin"><PanelAdmin /></ProtectedRoute>} />
        <Route path="/menu" element={<MostrarProductos />} />
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
};

export default App;

