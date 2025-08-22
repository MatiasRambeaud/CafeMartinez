import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, roleRequired }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_PROXY}/api/sessions/current`, {
          credentials: "include",
        });
        const data = await res.json();

        // Mostrar en consola toda la respuesta para debugging
        console.log("RESPUESTA BACKEND /current:", data);

        if (data.status === "success" && data.message?.role === roleRequired) {
          console.log("✅ Usuario autorizado:", data.message);
          setAuthorized(true);
        } else {
          console.log("❌ Usuario NO autorizado. Payload:", data.message);
          setAuthorized(false);
        }
      } catch (err) {
        console.error("Error al verificar sesión:", err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [roleRequired]);

  if (loading) return <h2>Cargando...</h2>;

  return authorized ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
