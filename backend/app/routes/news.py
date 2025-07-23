from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Form
from sqlalchemy.orm import Session
from app.models.news import News as NewsModel
from app.models.user import User, UserRole
from app.schemas.news import NewsCreate, NewsResponse
from app.database import get_db
from app.core.security import decode_token
from datetime import datetime
import os
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    
    email = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    return user

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

@router.post("/news/", response_model=NewsResponse)
async def create_news(
    news_data: NewsCreate = Depends(NewsCreate.as_form),
    image: UploadFile = File(...),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    os.makedirs("static", exist_ok=True)
    image_path = f"static/{image.filename}"
    with open(image_path, "wb") as buffer:
        buffer.write(await image.read())

    db_news = NewsModel(
        title=news_data.title,
        subtitle=news_data.subtitle,
        image_url=image_path,
        image_description=news_data.image_description,
        body=news_data.body,
        date=datetime.now()
    )
    
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

@router.get("/news/", response_model=list[NewsResponse])
def read_news(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return db.query(NewsModel).offset(skip).limit(limit).all()

@router.get("/news/{news_id}", response_model=NewsResponse)
def read_single_news(
    news_id: int,
    db: Session = Depends(get_db)
):
    news = db.query(NewsModel).filter(NewsModel.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

@router.put("/news/{news_id}", response_model=NewsResponse)
async def update_news(
    news_id: int,
    news_data: NewsCreate = Depends(NewsCreate.as_form),
    image: UploadFile = File(None),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    db_news = db.query(NewsModel).filter(NewsModel.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="News not found")
    
    if image:
        os.makedirs("static", exist_ok=True)
        image_path = f"static/{image.filename}"
        with open(image_path, "wb") as buffer:
            buffer.write(await image.read())
        db_news.image_url = image_path
    
    db_news.title = news_data.title
    db_news.subtitle = news_data.subtitle
    db_news.image_description = news_data.image_description
    db_news.body = news_data.body
    
    db.commit()
    db.refresh(db_news)
    return db_news

@router.delete("/news/{news_id}")
def delete_news(
    news_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    db_news = db.query(NewsModel).filter(NewsModel.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="News not found")
    
    db.delete(db_news)
    db.commit()
    return {"message": "News deleted successfully"}