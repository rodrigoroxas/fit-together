import { useState, useEffect } from 'react';

export default function Progress({ user }) {
  // --- Estados para la vista de 'usuario' ---
  const [myProgressList, setMyProgressList] = useState([]);
  const [assignedRoutines, setAssignedRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [form, setForm] = useState({
    date: '',
    routine_id: '', 
    weight: '',
    repetitions: '',
    calories: '',
    notes: ''
  });

  // --- Estados para la vista de 'entrenador/admin' ---
  const [usersForSelection, setUsersForSelection] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserProgress, setSelectedUserProgress] = useState([]);

  // --- EFECTO PRINCIPAL QUE CARGA DATOS SEGÚN EL ROL ---
  useEffect(() => {
    // Si el rol es 'usuario', carga sus datos personales
    if (user.role === 'usuario') {
      const fetchMyData = async () => {
        const [progressRes, routinesRes] = await Promise.all([
          fetch(`http://localhost:8000/progress/user/${user.id}`),
          fetch(`http://localhost:8000/user_routines/by_user/${user.id}`)
        ]);
        if (progressRes.ok) setMyProgressList(await progressRes.json());
        if (routinesRes.ok) setAssignedRoutines(await routinesRes.json());
      };
      fetchMyData();
    }
    
    // Si el rol es 'entrenador' o 'superadmin', carga la lista de usuarios para seleccionar
    if (user.role === 'entrenador' || user.role === 'superadmin') {
      const fetchAllUsers = async () => {
        const res = await fetch(`http://localhost:8000/users/`);
        if (res.ok) {
          const allUsers = await res.json();
          setUsersForSelection(allUsers.filter(u => u.role === 'usuario'));
        }
      };
      fetchAllUsers();
    }
  }, [user]);

  // --- EFECTO SECUNDARIO PARA LA VISTA DE ADMIN ---
  // Se dispara cuando un admin/entrenador selecciona un usuario de la lista
  useEffect(() => {
    if (selectedUserId) {
      const fetchUserProgress = async () => {
        setSelectedUserProgress([]); // Limpia la lista anterior
        const res = await fetch(`http://localhost:8000/progress/user/${selectedUserId}`);
        if (res.ok) {
          setSelectedUserProgress(await res.json());
        }
      };
      fetchUserProgress();
    } else {
      setSelectedUserProgress([]);
    }
  }, [selectedUserId]);


  // --- FUNCIONES DEL FORMULARIO (SOLO PARA 'USUARIO') ---
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
    if (name === 'routine_id') {
      if (value) {
        const fullRoutineData = assignedRoutines.find(ur => ur.routine.id === parseInt(value));
        setSelectedRoutine(fullRoutineData ? fullRoutineData.routine : null);
      } else {
        setSelectedRoutine(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      user_id: user.id,
      date: form.date || new Date().toISOString().slice(0,10),
      routine_id: form.routine_id ? parseInt(form.routine_id) : null,
    };
    const res = await fetch('http://localhost:8000/progress/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      const progressRes = await fetch(`http://localhost:8000/progress/user/${user.id}`);
      const data = await progressRes.json();
      setMyProgressList(data);
      setForm({ date: '', routine_id: '', weight: '', repetitions: '', calories: '', notes: '' });
      setSelectedRoutine(null);
      alert('¡Progreso registrado!');
    } else {
      alert('Error al registrar progreso');
    }
  };


  // --- VISTA PARA ENTRENADOR / ADMIN ---
  if (user.role === 'entrenador' || user.role === 'superadmin') {
    return (
      <div className="p-4">
        <div className="bg-white p-4 rounded shadow max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Visor de Progreso de Usuarios</h2>
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">Selecciona un usuario para ver su progreso</option>
              {usersForSelection.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            
            <h3 className="text-lg font-bold mt-6 mb-2">
              {selectedUserId ? `Historial de ${usersForSelection.find(u=>u.id==selectedUserId)?.name}` : 'Ningún usuario seleccionado'}
            </h3>
            <ul className="divide-y">
              {selectedUserProgress.length > 0 ? selectedUserProgress.map(p => (
                <li key={p.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-700">{p.routine?.name || 'Progreso General'}</span>
                    <span className="font-semibold text-gray-600">{p.date}</span>
                  </div>
                  {p.routine?.description && <p className="text-gray-500 text-sm mt-1 italic pl-1">{p.routine.description}</p>}
                  <div className="text-sm mt-2">Peso: {p.weight ?? '-'} kg | Rep: {p.repetitions ?? '-'} | Cal: {p.calories ?? '-'}</div>
                  {p.notes && <div className="text-gray-500 text-sm mt-1">Notas: {p.notes}</div>}
                </li>
              )) : <li className="text-gray-500 italic mt-2">No hay progreso para mostrar.</li>}
            </ul>
        </div>
      </div>
    );
  }


  // --- VISTA PARA USUARIO NORMAL ---
  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded shadow max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Registrar progreso</h2>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="p-2 border rounded" required />
          <select 
            name="routine_id" 
            value={form.routine_id} 
            onChange={handleChange} 
            className="p-2 border rounded"
          >
            <option value="">Selecciona una rutina (opcional)</option>
            {assignedRoutines.map(userRoutine => (
              <option key={userRoutine.id} value={userRoutine.routine.id}>
                {userRoutine.routine.name}
              </option>
            ))}
          </select>
          {selectedRoutine && selectedRoutine.description && (
            <div className="mt-1 p-3 bg-gray-50 border-l-4 border-blue-300 text-gray-700 text-sm">
              <p className="font-semibold">Descripción:</p>
              <p>{selectedRoutine.description}</p>
            </div>
          )}
          <input type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="Peso (kg)" className="p-2 border rounded" />
          <input type="number" name="repetitions" value={form.repetitions} onChange={handleChange} placeholder="Repeticiones" className="p-2 border rounded" />
          <input type="number" name="calories" value={form.calories} onChange={handleChange} placeholder="Calorías" className="p-2 border rounded" />
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notas" className="p-2 border rounded" />
          <button type="submit" className="bg-blue-500 text-white rounded p-2 mt-2">Registrar</button>
        </form>

        <h3 className="text-lg font-bold mt-6 mb-2">Historial de progreso</h3>
        <ul className="divide-y">
          {myProgressList.map(p => (
            <li key={p.id} className="py-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-700">{p.routine?.name || 'Progreso General'}</span>
                <span className="font-semibold text-gray-600">{p.date}</span>
              </div>
              {p.routine?.description && <p className="text-gray-500 text-sm mt-1 italic pl-1">{p.routine.description}</p>}
              <div className="text-sm mt-2">Peso: {p.weight ?? '-'} kg | Rep: {p.repetitions ?? '-'} | Cal: {p.calories ?? '-'}</div>
              {p.notes && <div className="text-gray-500 text-sm mt-1">Notas: {p.notes}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}