# Fit Together 💪

> Una aplicación web que ayuda a los usuarios a organizar y seguir sus rutinas de entrenamiento, combinando **FastAPI** en el backend y **React** en el frontend.

---

## ✨ Características principales
- 📌 Registro e inicio de sesión de usuarios.  
- 🏋️‍♂️ Gestión de rutinas personalizadas.  
- 🤖 Recomendación de entrenamientos.  
- 🔐 Panel de administración con roles: **admin, superadmin, user**.  

---

## 🚀 Tecnologías utilizadas

### 🔹 Backend
- [FastAPI](https://fastapi.tiangolo.com/) — Framework rápido y moderno para construir APIs con Python.  
- [SQLAlchemy](https://www.sqlalchemy.org/) — ORM para la base de datos.  
- [MySQL](https://www.mysql.com/) — Base de datos relacional.  
- [Uvicorn](https://www.uvicorn.org/) — Servidor ASGI para ejecutar FastAPI.  
- [Pydantic](https://docs.pydantic.dev/) — Validación de datos.  

### 🔹 Frontend
- [React](https://react.dev/) — Librería para construir interfaces de usuario.  
- [Vite](https://vitejs.dev/) — Herramienta de build rápida.  
- [TailwindCSS](https://tailwindcss.com/) — Framework CSS para estilos modernos.  
- [Axios](https://axios-http.com/) — Cliente HTTP para conectarse al backend.  

---

## ⚙️ Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/<tu-usuario>/fit-together.git
cd fit-together
```

### 2️⃣ Backend (FastAPI)
```bash
cd backend
python -m venv env
source env/bin/activate   # En Windows: .\env\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
El backend quedará corriendo en 👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)  

### 3️⃣ Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
El frontend quedará corriendo en 👉 [http://localhost:5173](http://localhost:5173)  

---

## 📂 Estructura del proyecto
```bash
fit-together/
│── backend/       # API con FastAPI
│── frontend/      # Interfaz con React
│── .gitignore
│── README.md
```


---

✨ Hecho con ❤️ usando **FastAPI** + **React** + **TailwindCSS**
