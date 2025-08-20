import { useState, useEffect } from "react";

export default function AssignRoutineForm() {
  const [users, setUsers] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [userId, setUserId] = useState("");
  const [routineId, setRoutineId] = useState("");
  const [msg, setMsg] = useState("");

  // Cargar usuarios y rutinas al montar
  useEffect(() => {
    fetch("http://localhost:8000/users/")
      .then(r => r.json()).then(setUsers);

    fetch("http://localhost:8000/routines/")
      .then(r => r.json()).then(setRoutines);
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:8000/user_routines/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId),
          routine_id: Number(routineId),
        })
      });
      if (res.ok) {
        setMsg("✅ Rutina asignada correctamente!");
      } else {
        const data = await res.json();
        setMsg(data.detail || "Error al asignar rutina");
      }
    } catch {
      setMsg("Error de conexión");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-lg mx-auto mb-6">
      <h2 className="text-xl font-bold mb-3">Asignar Rutina a Usuario</h2>
      <form onSubmit={handleAssign} className="flex flex-wrap gap-2 items-center">
        <select
          className="p-2 border rounded"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          required
        >
          <option value="">Selecciona usuario</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={routineId}
          onChange={e => setRoutineId(e.target.value)}
          required
        >
          <option value="">Selecciona rutina</option>
          {routines.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Asignar
        </button>
        {msg && <div className="ml-4 text-sm text-blue-700">{msg}</div>}
      </form>
    </div>
  );
}