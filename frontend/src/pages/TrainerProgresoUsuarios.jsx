import { useState, useEffect } from 'react';

export default function TrainerProgresoUsuarios({ trainerId }) {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [progreso, setProgreso] = useState([]);

  // Carga usuarios asignados al entrenador
  useEffect(() => {
    fetch(`http://localhost:8000/users?trainer_id=${trainerId}`)
      .then(res => res.json())
      .then(setUsuarios);
  }, [trainerId]);

  // Carga progreso del usuario seleccionado
  useEffect(() => {
    if (selectedUser) {
      fetch(`http://localhost:8000/progress/user/${selectedUser.id}`)
        .then(res => res.json())
        .then(setProgreso);
    }
  }, [selectedUser]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Progreso de tus usuarios</h2>
      <select onChange={e => setSelectedUser(usuarios.find(u => u.id === parseInt(e.target.value)))}>
        <option value="">Selecciona un usuario</option>
        {usuarios.map(user => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>
      {selectedUser && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Progreso de {selectedUser.name}</h3>
          <ul>
            {progreso.map(p => (
              <li key={p.id}>
                Fecha: {p.date} - Peso: {p.weight}kg - Rep: {p.repetitions}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
