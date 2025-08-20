# main.py
from fastapi import FastAPI
from routes import users, routines, user_routines, logs, progress, recommendations, auth, reports
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(routines.router)
app.include_router(user_routines.router)
app.include_router(logs.router)
app.include_router(progress.router)
app.include_router(recommendations.router)
app.include_router(auth.router)
app.include_router(reports.router) # <-- Se añade el nuevo router

@app.get("/")
def root():
    return {"message": "FitTogether está arriba"}