import { useState, useEffect } from 'react';

export default function Routines({ user }) {
  const [userRoutines, setUserRoutines] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // Estado para la descripción
  const [type, setType] = useState('full body');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('principiante');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // --- CORRECCIÓN: Se restaura el contenido de esta función ---
  const fetchRoutines = async () => {
    setError('');
    setMsg('');
    try {
      if (user.role === "usuario") {
        const res = await fetch(`http://localhost:8000/user_routines/by_user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setUserRoutines(Array.isArray(data) ? data : []);
        } else {
          setUserRoutines([]);
          setError('No se pudieron cargar tus rutinas');
        }
      } else {
        let url = '';
        if (user.role === "superadmin") url = 'http://localhost:8000/routines/';
        else if (user.role === "entrenador") url = `http://localhost:8000/routines/?trainer_id=${user.id}`;
        
        if (url) {
            const res = await fetch(url);
            if (res.ok) {
              const data = await res.json();
              setRoutines(Array.isArray(data) ? data : []);
            } else {
              setRoutines([]);
              setError('No se pudieron cargar las rutinas');
            }
        }
      }
    } catch {
      setError('Error de conexión al cargar rutinas');
      setRoutines([]);
      setUserRoutines([]);
    }
  };

  const addRoutine = async () => {
    setError('');
    setMsg('');
    if (!name || !duration) {
      setError("Completa nombre y duración.");
      return;
    }
    try {
      const payload = {
        name,
        description: description, // Se incluye la descripción
        duration: parseInt(duration),
        target_area: type,
        level: level,
      };

      if (user.role === "entrenador") {
        payload.trainer_id = user.id;
      } 
      else if (user.role === "usuario") {
        payload.user_id = user.id;
      }

      const res = await fetch('http://localhost:8000/routines/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchRoutines();
        // Limpiamos todos los campos del formulario
        setName('');
        setDescription(''); // Se limpia la descripción también
        setType('full body');
        setDuration('');
        setLevel('principiante');
        setMsg("¡Rutina agregada!");
      } else {
        setError('Error al agregar rutina');
      }
    } catch {
      setError('Error de conexión');
    }
    setTimeout(() => setMsg(""), 1800);
  };

  const handleDeleteAssignment = async (userRoutineId) => {
    if (!window.confirm("¿Seguro que deseas quitar esta rutina?")) return;
    setMsg("");
    try {
      const res = await fetch(`http://localhost:8000/user_routines/${userRoutineId}`, { method: "DELETE" });
      if (res.ok) {
        // Actualizamos la lista después de eliminar
        fetchRoutines();
        setMsg("Rutina eliminada");
      } else {
        setError("No se pudo eliminar la rutina.");
      }
    } catch {
      setError("Error de conexión.");
    }
    setTimeout(() => setMsg(""), 1800);
  };

  const handleDeleteRoutine = async (routineId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta rutina?")) return;
    setMsg("");
    try {
      const res = await fetch(`http://localhost:8000/routines/${routineId}`, { method: "DELETE" });
      if (res.ok) {
        // Actualizamos la lista después de eliminar
        fetchRoutines();
        setMsg("Rutina eliminada");
      } else {
        setError("No se pudo eliminar la rutina.");
      }
    } catch {
      setError("Error de conexión.");
    }
    setTimeout(() => setMsg(""), 1800);
  };

  useEffect(() => {
    fetchRoutines();
    // eslint-disable-next-line
  }, [user.id, user.role]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Rutinas</h2>
      {["entrenador", "superadmin", "usuario"].includes(user.role) && (
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="p-2 border rounded" placeholder="Nombre de la rutina"
              value={name} onChange={e => setName(e.target.value)} />
            
            <textarea className="p-2 border rounded md:col-span-2" placeholder="Descripción de la rutina (opcional)"
              value={description} onChange={e => setDescription(e.target.value)} rows="1" />
            
            <select className="p-2 border rounded"
              value={type} onChange={e => setType(e.target.value)}>
              <option value="full body">Full body</option>
              <option value="tren superior">Tren superior</option>
              <option value="tren inferior">Tren inferior</option>
            </select>
            <select className="p-2 border rounded"
              value={level} onChange={e => setLevel(e.target.value)}>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
            <input className="p-2 border rounded" placeholder="Duración (min)"
              type="number" min={1}
              value={duration} onChange={e => setDuration(e.target.value)} />
          </div>
          <button onClick={addRoutine}
            className="bg-green-500 text-white px-4 py-2 rounded mt-3 w-full md:w-auto"
            disabled={!name || !duration}
          >Agregar Rutina</button>
        </div>
      )}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {msg && <div className="text-green-600 mb-2">{msg}</div>}

      <ul className="space-y-2">
        {/* Mostramos la descripción en la lista del usuario */}
        {user.role === "usuario" && Array.isArray(userRoutines) && userRoutines.length > 0 ? (
          userRoutines.map(ur => (
            <li key={ur.id} className="p-3 border rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <strong className="text-blue-700">{ur.routine?.name}</strong>
                {ur.routine?.description && (
                  <p className="text-sm text-gray-600 italic">{ur.routine.description}</p>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Área: {ur.routine?.target_area} | Nivel: {ur.routine?.level} | Duración: {ur.routine?.duration} min
                </div>
              </div>
              <button
                className="ml-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => handleDeleteAssignment(ur.id)}
              >
                Quitar
              </button>
            </li>
          ))
        ) : null}

        {/* Mostramos la descripción en la lista del entrenador/admin */}
        {["entrenador", "superadmin"].includes(user.role) && Array.isArray(routines) && routines.length > 0 ? (
          routines.map(r => (
            <li key={r.id} className="p-3 border rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <strong className="text-blue-700">{r.name}</strong>
                 {r.description && (
                  <p className="text-sm text-gray-600 italic">{r.description}</p>
                 )}
                <div className="text-xs text-gray-500 mt-1">
                  Área: {r.target_area} | Nivel: {r.level} | Duración: {r.duration} min
                </div>
              </div>
              <button
                className="ml-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => handleDeleteRoutine(r.id)}
              >
                Eliminar
              </button>
            </li>
          ))
        ) : null}

        {((user.role === "usuario" && userRoutines.length === 0) ||
          (["entrenador", "superadmin"].includes(user.role) && routines.length === 0)) && (
            <li className="text-gray-500 italic p-3">No tienes rutinas.</li>
          )}
      </ul>
    </div>
  );
}