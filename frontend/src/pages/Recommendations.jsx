import { useEffect, useState } from 'react';

const niveles = ["principiante", "intermedio", "avanzado"];

export default function Recommendations({ user, targetArea = "full body" }) {
  const [recs, setRecs] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!targetArea) return;
    setError("");
    const fetchAll = async () => {
      setLoading(true);
      const allRecs = {};
      try {
        for (const level of niveles) {
          const res = await fetch(
            `http://localhost:8000/recommendation?target_area=${targetArea}&level=${level}`
          );
          if (res.ok) {
            const data = await res.json();
            allRecs[level] = data.slice(0, 3);
          } else {
            allRecs[level] = [];
          }
        }
        setRecs(allRecs);
      } catch {
        setError("No se pudieron cargar las recomendaciones.");
      }
      setLoading(false);
    };
    fetchAll();
  }, [targetArea]);

  const handleAddRoutine = async (routine) => {
    setMsg("");
    setAdding(true);
    if (!user) {
      setMsg("Debes iniciar sesión para agregar una rutina.");
      setAdding(false);
      setTimeout(() => setMsg(""), 2000);
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/routines/from_recommendation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: routine.name,
          description: routine.description,
          duration: routine.duration,
          target_area: routine.target_area,
          level: routine.level,
          user_id: user.id,
        }),
      });
      if (res.ok) setMsg("¡Rutina agregada a tus rutinas!");
      else setMsg("No se pudo agregar la rutina.");
    } catch {
      setMsg("No se pudo conectar al servidor.");
    }
    setAdding(false);
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4">Recomendaciones de Rutinas</h2>
      
      {/* --- INICIO DE LA MEJORA --- */}
      {/* Mensaje claro si el usuario no ha iniciado sesión */}
      {!user && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p className="font-bold">Inicia sesión</p>
          <p>Debes iniciar sesión para poder agregar rutinas a tu perfil.</p>
        </div>
      )}
      {/* --- FIN DE LA MEJORA --- */}

      {msg && (
        <div
          className={`mb-2 px-3 py-2 rounded font-medium ${msg.includes("agregada") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {msg}
        </div>
      )}
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {loading && <div>Cargando...</div>}
      {!loading && (
        <div>
          {niveles.map((nivel) => (
            <div key={nivel} className="mb-6">
              <div className="font-semibold text-lg capitalize mb-2 text-blue-700">
                {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
              </div>
              <ul className="divide-y">
                {(recs[nivel] || []).length === 0 && (
                  <li className="text-gray-400 mb-3">
                    Sin recomendaciones para este nivel.
                  </li>
                )}
                {(recs[nivel] || []).map((r) => (
                  <li
                    key={r.id}
                    className="py-2 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold">{r.name}</div>
                      <div className="text-gray-700">{r.description}</div>
                      <div className="text-xs text-gray-600">
                        Área: {r.target_area} | Nivel: {r.level} | Duración: {r.duration} min
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddRoutine(r)}
                      className="ml-4 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!user || adding}
                      title={!user ? "Debes iniciar sesión para agregar una rutina" : ""}
                    >
                      Agregar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}