import { FaDumbbell, FaChartLine, FaUser, FaHome, FaSignOutAlt, FaUsers } from 'react-icons/fa';

export default function Sidebar({ user, onLogout, onNavigate }) {
  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-gradient-to-b from-primary to-secondary/70 shadow-xl flex flex-col items-center py-8 z-40">
      <div className="flex flex-col items-center mb-12">
        <FaHome className="text-3xl text-white mb-2" />
        <span className="text-xl font-bold text-white">FitTogether</span>
        <span className="text-sm text-gray-200 mt-1">{user.role}</span>
      </div>

      <nav className="flex-1 w-full">
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => onNavigate("dashboard")}
              className="w-full flex items-center gap-3 px-6 py-3 text-lg text-white hover:bg-white/10 hover:text-yellow-300 rounded-xl transition"
            >
              <FaHome /> Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate("routines")}
              className="w-full flex items-center gap-3 px-6 py-3 text-lg text-white hover:bg-white/10 hover:text-yellow-300 rounded-xl transition"
            >
              <FaDumbbell /> Rutinas
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate("progress")}
              className="w-full flex items-center gap-3 px-6 py-3 text-lg text-white hover:bg-white/10 hover:text-yellow-300 rounded-xl transition"
            >
              <FaChartLine /> Progreso
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate("profile")}
              className="w-full flex items-center gap-3 px-6 py-3 text-lg text-white hover:bg-white/10 hover:text-yellow-300 rounded-xl transition"
            >
              <FaUser /> Perfil
            </button>
          </li>
          {user.role === "superadmin" && (
            <li>
              <button
                onClick={() => onNavigate("admin")}
                className="w-full flex items-center gap-3 px-6 py-3 text-lg text-white hover:bg-white/10 hover:text-yellow-300 rounded-xl transition"
              >
                <FaUsers /> Admin
              </button>
            </li>
          )}
        </ul>
      </nav>

      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 px-6 py-3 text-lg text-white hover:bg-red-500 hover:text-white rounded-xl transition"
      >
        <FaSignOutAlt /> Salir
      </button>
    </aside>
  );
}
