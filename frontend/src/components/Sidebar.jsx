import { FaHome, FaDumbbell, FaChartLine, FaStar, FaUsers, FaSignOutAlt, FaUserPlus, FaFileContract } from "react-icons/fa";

export default function Sidebar({ current, setCurrent, user, onLogout }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-gradient-to-b from-blue-700 to-green-400 shadow-xl flex flex-col">
      <div className="p-6 flex flex-col items-center">
        <FaDumbbell className="text-3xl text-white mb-2" />
        <h2 className="text-white font-black text-xl mb-1">FitTogether</h2>
        <div className="text-xs text-blue-100">{user?.role || ""}</div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <button className={`sidebar-link ${current === "dashboard" && "active"}`} onClick={() => setCurrent("dashboard")}><FaHome className="inline mr-2" />Dashboard</button>
        <button className={`sidebar-link ${current === "routines" && "active"}`} onClick={() => setCurrent("routines")}><FaDumbbell className="inline mr-2" />Rutinas</button>
        <button className={`sidebar-link ${current === "progress" && "active"}`} onClick={() => setCurrent("progress")}><FaChartLine className="inline mr-2" />Progreso</button>
        <button className={`sidebar-link ${current === "recommendations" && "active"}`} onClick={() => setCurrent("recommendations")}><FaStar className="inline mr-2" />Recomendaciones</button>
        
        {/* Opciones solo para superadmin */}
        {user?.role === "superadmin" && (
          // Usamos un Fragment (<>) para agrupar los botones de admin
          <> 
            <hr className="my-2 border-white/20" />
            <button className={`sidebar-link ${current === "users" && "active"}`} onClick={() => setCurrent("users")}>
              <FaUsers className="inline mr-2" />Usuarios
            </button>
            
            {/* --- INICIO DE LA MODIFICACIÓN --- */}
            <button className={`sidebar-link ${current === "reporteria" && "active"}`} onClick={() => setCurrent("reporteria")}>
              <FaFileContract className="inline mr-2" />Reportería
            </button>
            {/* --- FIN DE LA MODIFICACIÓN --- */}
          </>
        )}

        {/* Opción solo para entrenador */}
        {user?.role === "entrenador" && (
          <button className={`sidebar-link ${current === "assign" && "active"}`} onClick={() => setCurrent("assign")}>
            <FaUserPlus className="inline mr-2" />Asignar Rutina
          </button>
        )}
      </nav>
      <div className="mb-4 mt-auto px-4">
        <button
          className="w-full flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-red-600 transition p-2 rounded"
          onClick={onLogout}
        >
          <FaSignOutAlt /> Salir
        </button>
      </div>
      <style>{`
        .sidebar-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.75rem 1rem;
          color: #fff;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: background 0.15s;
        }
        .sidebar-link.active, .sidebar-link:hover {
          background: rgba(255,255,255,0.15);
        }
      `}</style>
    </aside>
  );
}