from supabase import create_client, Client
from app.core.config import SUPABASE_KEY, SUPABASE_URL

#Este objeto supabase es el que usaremos en toda la app para interactuar con la bbdd
supabase_client : Client = create_client(SUPABASE_URL,SUPABASE_KEY)

# Esta es nuestra función "dependencia"
def get_supabase_client() -> Client:
    return supabase_client