// pages/Reporteria.jsx
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Reporteria() {
  const [topTrainers, setTopTrainers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loginActivity, setLoginActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainersRes, usersRes, loginsRes] = await Promise.all([
          fetch('http://localhost:8000/reports/top_trainers_by_assignments'),
          fetch('http://localhost:8000/reports/most_active_users'),
          fetch('http://localhost:8000/reports/login_activity')
        ]);
        
        setTopTrainers(await trainersRes.json());
        setActiveUsers(await usersRes.json());
        setLoginActivity(await loginsRes.json());
      } catch (error) {
        console.error("Error al cargar los reportes:", error);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: topTrainers.map(t => t.trainer_name),
    datasets: [
      {
        label: 'Usuarios Asignados',
        data: topTrainers.map(t => t.assigned_users),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Módulo de Reportería</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Top Entrenadores */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Top Entrenadores por Usuarios Asignados</h2>
          {topTrainers.length > 0 ? <Bar data={chartData} /> : <p>No hay datos suficientes.</p>}
        </div>

        {/* Tabla de Usuarios Más Activos */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Usuarios Más Activos (Últimos 30 días)</h2>
          <ul className="divide-y divide-gray-200">
            {activeUsers.length > 0 ? activeUsers.map((user, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <span>{user.user_name}</span>
                <span className="font-bold bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">{user.progress_entries} entrenamientos</span>
              </li>
            )) : <p>No hay actividad reciente.</p>}
          </ul>
        </div>
      </div>
      
      {/* Tabla de Últimos Inicios de Sesión */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h2 className="text-xl font-semibold mb-2">Últimos Inicios de Sesión</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left font-semibold px-4 py-2">Detalles</th>
                <th className="text-left font-semibold px-4 py-2">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loginActivity.map(log => (
                <tr key={log.id}>
                  <td className="px-4 py-2">{log.details}</td>
                  <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}