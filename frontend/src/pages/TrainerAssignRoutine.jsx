// TrainerAssignRoutine.jsx
import { useEffect, useState } from 'react';

export default function TrainerAssignRoutine({ trainerId }) {
  const [users, setUsers] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState('');

  useEffect(() => {
    // Carga todos los usuarios (o podrías filtrarlos si es necesario)
    fetch('http://localhost:8000/users/').then(res => res.json()).then(setUsers);
    
    // CORREGIDO: Carga solo las rutinas creadas por este entrenador, es más eficiente.
    fetch(`http://localhost:8000/routines/?trainer_id=${trainerId}`).then(res => res.json()).then(setRoutines);
  }, [trainerId]);

  const assign = async () => {
    if (!selectedUser || !selectedRoutine) {
      alert("Debes seleccionar un usuario y una rutina.");
      return;
    }
    const res = await fetch('http://localhost:8000/user_routines/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: parseInt(selectedUser, 10),
        routine_id: parseInt(selectedRoutine, 10)
      })
    });
    if (res.ok) alert('¡Rutina asignada!');
    else alert('Error al asignar rutina');
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Asignar Rutina a Usuario</h3>
      <div className="flex gap-2 mb-2">
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="p-2 border rounded">
          <option value="">Selecciona usuario</option>
          {/* Filtramos solo usuarios normales para asignarles rutinas */}
          {users.filter(u => u.role === 'usuario').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select value={selectedRoutine} onChange={e => setSelectedRoutine(e.target.value)} className="p-2 border rounded">
          <option value="">Selecciona rutina</option>
          {/* Ya no es necesario filtrar aquí porque la API nos da las rutinas correctas */}
          {routines.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={assign}>Asignar</button>
      </div>
    </div>
  );
}