from fastapi import APIRouter, Depends
from app.db.session import get_supabase_client
from supabase import Client

router = APIRouter()

@router.get("/about")   #FastAPI vera esto y llamara a get_supabase_client por nosotros El resultado de esa funcion se asignara al parametro supabase
def get_about_data(supabase : Client = Depends(get_supabase_client)):
    response = supabase.table('about').select('*').execute()
    return response.data
