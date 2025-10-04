import os
from dotenv import load_dotenv
# Esta función busca un fichero .env y carga sus variables
# en el entorno del sistema, haciéndolas accesibles para tu app.
load_dotenv()

# --- Variables de la App (no secretas) ---
API_V1_STR: str = "/api/v1"

# --- Variables de Supabase (leídas de forma segura desde .env) ---
# os.getenv() lee una variable del entorno. Si no la encuentra, devuelve None.
SUPABASE_URL: str = os.getenv("SUPABASE_URL")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
