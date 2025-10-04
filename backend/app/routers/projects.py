from fastapi import APIRouter

router = APIRouter()

@router.get('/projects')
def list_all_projects():
    return[ {
              "id": 1,
              "name": "Portfolio OS",
              "description": "Un sistema operativo de portfolio web hecho con Next.js y FastAPI.",
              "url": "https://github.com/danigpas/portfolio-os",
              "tags": ["Next.js", "FastAPI", "TypeScript", "Python"]
          }]