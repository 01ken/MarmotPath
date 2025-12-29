from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import careers, optimization, courses, skills

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターの登録
app.include_router(careers.router, prefix="/api", tags=["careers"])
app.include_router(optimization.router, prefix="/api", tags=["optimization"])
app.include_router(courses.router, prefix="/api", tags=["courses"])
app.include_router(skills.router, prefix="/api", tags=["skills"])

@app.get("/")
async def root():
    return {"message": "Welcome to MarmotPath API 🐿️"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}