import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

const Login = () => {

  useEffect(() => {
      document.title = "Café Martines - Login";
  }, []);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_PROXY}/api/sessions/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        navigate("/panel");
      } else {
        setError(data.error || "Datos de login incorrectos");
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

        {error && <p className="login-error">{error}</p>}

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
