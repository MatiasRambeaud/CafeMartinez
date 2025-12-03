import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

const Login = () => {

  useEffect(() => {
      document.title = "Neldo Martinez - Login";
  }, []);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_PROXY}/api/sessions/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setSuccess("Acceso permitido al panel de admin.");
        setTimeout(() => {
          navigate("/panel");
        }, 1000);
      } else {
        setError(data.error || data.message || "Acceso denegado al panel de admin. Verifique el nombre o la contraseña.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <h2 className="login-title">Iniciar sesión</h2>

        {error && (
          <div className="login-error login-message-block">
            <strong>Acceso denegado al panel de admin</strong>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="login-success login-message-block">
            <strong>Acceso permitido al panel de admin</strong>
            <p>{success}</p>
          </div>
        )}

        <div className="login-field">
          <label className="login-label" htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="login-input"
            autoComplete="username"
          />
        </div>

        <div className="login-field">
          <label className="login-label" htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="login-btn">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
