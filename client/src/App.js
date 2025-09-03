import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PanelAdmin from "./components/PanelAdmin";
import MostrarProductos from "./components/MostrarProductos";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import ExcelUploader from "./components/excel/ExcelUploader";

const App = () => {
  return (
    <Router>
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
