import { useState, useEffect } from "react";

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("usuario");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Obtener todos los usuarios
  const fetchUsuarios = async () => {
    const res = await fetch("http://localhost:8000/users/");
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Agregar o actualizar usuario
  const handleAgregar = async () => {
    setError("");
    if (!nombre || !correo || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const userPayload = {
      name: nombre,
      email: correo,
      password,
      role: rol,
    };

    let res;
    if (editId) {
      res = await fetch(`http://localhost:8000/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });
    } else {
      res = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });
    }

    if (res.ok) {
      fetchUsuarios();
      setNombre("");
      setCorreo("");
      setPassword("");
      setRol("usuario");
      setEditId(null);
    } else {
      const err = await res.json();
      setError(err.detail || "Error al guardar usuario");
    }
  };

  // Eliminar usuario
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro de eliminar este usuario?")) return;
    const res = await fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });
    if (res.ok) fetchUsuarios();
  };

  // Editar usuario
  const handleEditar = (user) => {
    setEditId(user.id);
    setNombre(user.name);
    setCorreo(user.email);
    setRol(user.role);
    setPassword(""); // No traemos la contraseña
  };

  // Cancelar edición
  const handleCancelar = () => {
    setEditId(null);
    setNombre("");
    setCorreo("");
    setPassword("");
    setRol("usuario");
    setError("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      {/* Formulario de usuario */}
      <div className="flex gap-4 items-end mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 font-semibold mb-1">Nombre</label>
          <input
            className="border rounded px-3 py-2"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 font-semibold mb-1">Correo</label>
          <input
            className="border rounded px-3 py-2"
            placeholder="Correo"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 font-semibold mb-1">Contraseña</label>
          <input
            type="password"
            className="border rounded px-3 py-2"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 font-semibold mb-1">Rol</label>
          <select
            className="border rounded px-3 py-2"
            value={rol}
            onChange={e => setRol(e.target.value)}
          >
            <option value="usuario">Usuario</option>
            <option value="entrenador">Entrenador</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
        <button
          className={`px-4 py-2 rounded font-semibold ${
            editId
              ? "bg-yellow-400 hover:bg-yellow-500 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={handleAgregar}
        >
          {editId ? "Actualizar" : "Agregar"}
        </button>
        {editId && (
          <button
            className="ml-2 px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white font-semibold"
            onClick={handleCancelar}
          >
            Cancelar
          </button>
        )}
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="text-left px-6 py-3">Nombre</th>
              <th className="text-left px-6 py-3">Correo</th>
              <th className="text-left px-6 py-3">Rol</th>
              <th className="text-left px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-2">{user.name}</td>
                <td className="px-6 py-2">{user.email}</td>
                <td className="px-6 py-2 capitalize">{user.role}</td>
                <td className="px-6 py-2 flex gap-2">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEditar(user)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleEliminar(user.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">No hay usuarios.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
