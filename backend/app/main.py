from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import news, auth, users
from app.database import Base, engine
from fastapi.staticfiles import StaticFiles

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")
app.include_router(news.router, prefix="/api")