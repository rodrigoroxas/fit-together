import { useState } from 'react';
import { FaUserAlt, FaLock } from 'react-icons/fa';

export default function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const user = await res.json();
        onLogin(user);
      } else {
        const err = await res.json();
        setError(err.detail || 'Error al iniciar sesión');
      }
    } catch {
      setError('No se pudo conectar al servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary via-fondo to-secondary transition-all">
      <div className="bg-card rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-black text-primary mb-6 text-center tracking-tight">Iniciar Sesión</h1>
        <div className="mb-4 relative">
          <FaUserAlt className="absolute left-3 top-3 text-secondary" />
          <input
            type="email"
            className="pl-10 pr-3 py-2 w-full border border-secondary/40 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mb-4 relative">
          <FaLock className="absolute left-3 top-3 text-secondary" />
          <input
            type="password"
            className="pl-10 pr-3 py-2 w-full border border-secondary/40 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-primary hover:bg-secondary text-white font-bold py-2 rounded-lg w-full mb-2 transition"
          onClick={handleLogin}
        >
          Ingresar
        </button>
        {error && <div className="text-red-600 text-center mb-2">{error}</div>}
        <button
          className="text-primary hover:underline w-full"
          onClick={onShowRegister}
        >
          ¿No tienes cuenta? <span className="font-bold">Regístrate aquí</span>
        </button>
      </div>
    </div>
  );
}
