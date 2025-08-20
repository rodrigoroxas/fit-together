import { useEffect, useState } from 'react';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('http://localhost:8000/logs/');
      if (res.ok) {
        setLogs(await res.json());
      }
    };
    fetchLogs();
  }, []);
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Logs de Actividad</h3>
      <ul className="divide-y">
        {logs.map(log => (
          <li key={log.id} className="py-1">
            <span className="text-sm text-gray-600">{log.timestamp}</span>
            <span className="ml-2 font-semibold">{log.action}</span>
            {log.details && <span className="ml-2 text-gray-700">({log.details})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
