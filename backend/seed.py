# seed.py
from database import SessionLocal
import models

# Lista más completa de rutinas recomendadas (predefinidas)
predefined_routines_data = [
    # --- PRINCIPIANTE ---
    {
        "name": "Iniciación a la Fuerza (Full Body)",
        "target_area": "full body",
        "level": "principiante",
        "duration": 40,
        "description": "Una rutina ideal para empezar, trabajando todos los grupos musculares principales con ejercicios básicos y seguros."
    },
    {
        "name": "Primeros Pasos (Tren Inferior)",
        "target_area": "tren inferior",
        "level": "principiante",
        "duration": 30,
        "description": "Enfocada en construir una base sólida en piernas y glúteos con sentadillas, zancadas y elevaciones de talones."
    },
    {
        "name": "Activación Superior",
        "target_area": "tren superior",
        "level": "principiante",
        "duration": 30,
        "description": "Ejercicios de empuje y tracción suaves para familiarizarse con el trabajo de pecho, espalda y brazos."
    },

    # --- INTERMEDIO ---
    {
        "name": "Desarrollo de Fuerza (Full Body)",
        "target_area": "full body",
        "level": "intermedio",
        "duration": 50,
        "description": "Aumenta la intensidad y el volumen para promover la hipertrofia y la ganancia de fuerza en todo el cuerpo."
    },
    {
        "name": "Desafío de Piernas",
        "target_area": "tren inferior",
        "level": "intermedio",
        "duration": 45,
        "description": "Una rutina intensa para fortalecer cuádriceps, glúteos y femorales, introduciendo más peso y complejidad."
    },
    {
        "name": "Fuerza de Pecho y Tríceps",
        "target_area": "tren superior",
        "level": "intermedio",
        "duration": 45,
        "description": "Rutina enfocada en desarrollar fuerza y volumen en pectorales y tríceps con ejercicios de empuje."
    },

    # --- AVANZADO ---
    {
        "name": "Máximo Rendimiento (Full Body)",
        "target_area": "full body",
        "level": "avanzado",
        "duration": 60,
        "description": "Rutina de alta exigencia con ejercicios compuestos y técnicas avanzadas para atletas experimentados."
    },
    {
        "name": "Potencia de Piernas y Glúteos",
        "target_area": "tren inferior",
        "level": "avanzado",
        "duration": 60,
        "description": "Rutina avanzada con sentadillas pesadas, peso muerto y pliometría para máxima potencia en el tren inferior."
    },
    {
        "name": "Cardio HIIT Explosivo",
        "target_area": "full body",
        "level": "avanzado",
        "duration": 20,
        "description": "Entrenamiento de Intervalos de Alta Intensidad para quemar el máximo de calorías en el menor tiempo posible."
    }
]

# Obtenemos una sesión de la base de datos
db = SessionLocal()

try:
    print("Iniciando el sembrado de rutinas recomendadas...")
    
    # Obtenemos los nombres de las rutinas que ya existen para evitar duplicados
    existing_routines = {r.name for r in db.query(models.PredefinedRoutine).all()}
    new_routines_added_count = 0

    # Iteramos sobre la lista de rutinas y las agregamos a la base de datos
    for routine_data in predefined_routines_data:
        # Si la rutina no existe por nombre, la agregamos
        if routine_data['name'] not in existing_routines:
            db_routine = models.PredefinedRoutine(**routine_data)
            db.add(db_routine)
            new_routines_added_count += 1
            print(f"  -> Agregando: '{routine_data['name']}'")
        else:
            print(f"  -> Omitiendo (ya existe): '{routine_data['name']}'")
    
    # Solo hacemos commit si se agregaron nuevas rutinas
    if new_routines_added_count > 0:
        db.commit()
        print(f"\n¡Base de datos sembrada con {new_routines_added_count} nuevas rutinas recomendadas!")
    else:
        print("\nNo se agregaron nuevas rutinas, todas ya existían en la base de datos.")

except Exception as e:
    print(f"\nOcurrió un error: {e}")
    db.rollback()  # Revertimos los cambios si hay un error

finally:
    db.close()
    print("Proceso de sembrado finalizado.")