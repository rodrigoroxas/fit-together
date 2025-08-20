import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Routines from "./pages/Routines";
import Progress from "./pages/Progress";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserManagement from "./pages/UserManagement";
import TrainerAssignRoutine from "./components/TrainerAssignRoutine";
// --- INICIO DE LA MODIFICACIÓN ---
// 1. Se importa el nuevo componente de la página de Reportería
import Reporteria from "./pages/Reporteria"; 
// --- FIN DE LA MODIFICACIÓN ---


export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [current, setCurrent] = useState("dashboard");

  if (!user) {
    return showRegister
      ? <Register
        onRegister={() => setShowRegister(false)}
        onShowLogin={() => setShowRegister(false)} 
      />
      : <Login
        onLogin={u => { setUser(u); setCurrent("dashboard"); }}
        onShowRegister={() => setShowRegister(true)}
      />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        current={current}
        setCurrent={setCurrent}
        user={user}
        onLogout={() => { setUser(null); setCurrent("dashboard"); }}
      />
      <main className="flex-1 pl-56">
        {current === "dashboard" && <Dashboard user={user} setUser={setUser} />}
        {current === "routines" && <Routines user={user} />}
        {current === "progress" && <Progress user={user} />}
        
        {current === "recommendations" && (
          <Recommendations
            user={user}
            targetArea="tren superior"
            level="principiante"
          />
        )}

        {/* Solo muestra UserManagement si el usuario es superadmin */}
        {current === "users" && user.role === "superadmin" && (
          <UserManagement user={user} />
        )}
        {/* Solo muestra asignación si es entrenador */}
        {current === "assign" && user.role === "entrenador" && (
          <TrainerAssignRoutine user={user} />
        )}
        
        {/* --- INICIO DE LA MODIFICACIÓN --- */}
        {/* 2. Se añade la condición para mostrar la página de Reportería */}
        {current === "reporteria" && user.role === "superadmin" && (
          <Reporteria />
        )}
        {/* --- FIN DE LA MODIFICACIÓN --- */}
      </main>
    </div>
  );
}