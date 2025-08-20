// Register.jsx

import { useState } from 'react';
// Añadimos los iconos que vamos a usar
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

// El componente ahora recibe 'onShowLogin' para poder volver
export default function Register({ onRegister, onShowLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'usuario',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const user = await res.json();
        onRegister && onRegister(user);
        alert('Usuario registrado exitosamente. ¡Ahora inicia sesión!');
      } else {
        const err = await res.json();
        setError(err.detail || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor');
    }
    setLoading(false);
  };

  return (
    // Usamos el mismo fondo con gradiente que el Login
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary via-fondo to-secondary transition-all">
      {/* Usamos la misma tarjeta flotante y animada */}
      <div className="bg-card rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-black text-primary mb-6 text-center tracking-tight">Crear una Cuenta</h1>
        <form onSubmit={handleSubmit}>
          {/* Campo Nombre con icono */}
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3.5 text-secondary" />
            <input
              name="name"
              placeholder="Nombre completo"
              className="pl-10 pr-3 py-2 w-full border border-secondary/40 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          {/* Campo Email con icono */}
          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-secondary" />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              className="pl-10 pr-3 py-2 w-full border border-secondary/40 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* Campo Contraseña con icono */}
          <div className="mb-4 relative">
            <FaLock className="absolute left-3 top-3.5 text-secondary" />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="pl-10 pr-3 py-2 w-full border border-secondary/40 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 rounded-lg mb-2 transition"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          {error && <div className="text-red-600 text-center mb-2">{error}</div>}
        </form>
        
        {/* --- INICIO DE LA MODIFICACIÓN --- */}
        {/* Botón para volver al Login */}
        <div className="text-center mt-4">
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={onShowLogin} // Llama a la nueva función del prop
            >
              ¿Ya tienes una cuenta? <span className="font-bold">Inicia sesión</span>
            </button>
        </div>
        {/* --- FIN DE LA MODIFICACIÓN --- */}

      </div>
    </div>
  );
}