import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PanelAdmin from "./components/PanelAdmin";
import MostrarProductos from "./components/MostrarProductos";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/panel" element={<PanelAdmin />} />
        <Route path="/menu" element={<MostrarProductos />} />
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
