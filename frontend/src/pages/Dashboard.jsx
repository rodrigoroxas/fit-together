import { useState, useEffect } from "react";
// --- INICIO DE LA MODIFICACIÓN (Paso 1) ---
// Importamos un nuevo ícono para la tarjeta de peso
import { FaUser, FaDumbbell, FaChartLine, FaCheckCircle, FaFire, FaWeightHanging } from "react-icons/fa";
// --- FIN DE LA MODIFICACIÓN (Paso 1) ---
import UserManagement from './UserManagement';

export default function Dashboard({ user }) {
  const [progressCount, setProgressCount] = useState(0);
  const [streak, setStreak] = useState(0);

  // --- INICIO DE LA MODIFICACIÓN (Paso 2) ---
  // Nuevo estado para guardar el último peso registrado
  const [latestWeight, setLatestWeight] = useState(null);
  // --- FIN DE LA MODIFICACIÓN (Paso 2) ---

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await fetch(`http://localhost:8000/progress/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProgressCount(data.length);
        
        // --- INICIO DE LA MODIFICACIÓN (Paso 3) ---
        // Procesamos los datos para encontrar el último peso y la racha
        if (data && data.length > 0) {
          // Ordenamos los progresos por fecha, del más reciente al más antiguo
          const sortedProgress = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
          
          // El más reciente es el primer elemento
          const latestEntry = sortedProgress[0];
          // Guardamos su peso en el estado (si existe)
          setLatestWeight(latestEntry.weight || null);

          // Calculamos la racha (usando la lista ya ordenada)
          const fechas = sortedProgress.map(p => new Date(p.date));
          let currentStreak = 1;
          for (let i = 0; i < fechas.length - 1; i++) {
            const diff = (fechas[i] - fechas[i + 1]) / (1000 * 60 * 60 * 24);
            if (diff === 1) currentStreak++;
            else if (diff > 1) break;
          }
          setStreak(currentStreak);

        } else {
          // Si no hay datos, reseteamos todo
          setLatestWeight(null);
          setStreak(0);
        }
        // --- FIN DE LA MODIFICACIÓN (Paso 3) ---

      } else {
        setProgressCount(0);
        setStreak(0);
        setLatestWeight(null);
      }
    };
    fetchProgress();
  }, [user.id]);

  // La función de mensaje de racha se mantiene igual
  function mensajeRacha(streak) {
    if (streak >= 5) return `🏆 ¡Impresionante! ${streak} días de racha`;
    if (streak === 3) return "🔥 ¡Felicidades! Llevas 3 días seguidos entrenando";
    if (streak > 0) return `¡Llevas ${streak} días seguidos entrenando!`;
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center gap-2">
        <FaUser className="text-blue-500" />
        ¡Bienvenido, {user.name.split(" ")[0]}!
      </h1>

      {/* Stats rápidas */}
      {/* --- INICIO DE LA MODIFICACIÓN (Paso 4) --- */}
      {/* Actualizamos la grilla para que sea de 4 columnas en pantallas grandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* --- FIN DE LA MODIFICACIÓN (Paso 4) --- */}
        <div className="bg-white rounded-lg shadow flex items-center gap-3 p-5">
          <FaChartLine className="text-2xl text-green-600" />
          <div>
            <div className="text-gray-500 text-sm">Entrenamientos</div>
            <div className="font-bold text-xl text-green-800">{progressCount}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow flex items-center gap-3 p-5">
          <FaCheckCircle className="text-2xl text-purple-600" />
          <div>
            <div className="text-gray-500 text-sm">Rol</div>
            <div className="font-bold text-xl text-purple-800">{user.role}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow flex items-center gap-3 p-5">
          <FaFire className="text-2xl text-orange-500" />
          <div>
            <div className="text-gray-500 text-sm">Racha</div>
            <div className="font-bold text-xl text-orange-700">{streak} días</div>
          </div>
        </div>
        {/* --- INICIO DE LA MODIFICACIÓN (Paso 5) --- */}
        {/* Nueva tarjeta para mostrar el último peso */}
        <div className="bg-white rounded-lg shadow flex items-center gap-3 p-5">
          <FaWeightHanging className="text-2xl text-red-600" />
          <div>
            <div className="text-gray-500 text-sm">Peso actual</div>
            <div className="font-bold text-xl text-red-800">
              {latestWeight ? `${latestWeight} kg` : '-'}
            </div>
          </div>
        </div>
        {/* --- FIN DE LA MODIFICACIÓN (Paso 5) --- */}
      </div>

      {/* Mensaje motivacional de racha */}
      {mensajeRacha(streak) && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4 rounded-lg font-semibold shadow">
          {mensajeRacha(streak)}
        </div>
      )}

      <div className="mt-8 text-lg text-gray-600">
        Selecciona una sección del menú para ver tus rutinas, progreso o recibir recomendaciones.
      </div>
    </div>
  );
}