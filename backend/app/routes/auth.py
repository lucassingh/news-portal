from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User as UserModel
from app.schemas.user import UserCreate, User as UserSchema, Token
from app.core.security import get_password_hash, verify_password, create_access_token, verify_token

router = APIRouter(tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/register", response_model=UserSchema)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    # Verificar si el usuario ya existe
    db_user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Crear el usuario
    hashed_password = get_password_hash(user_data.password)
    db_user = UserModel(
        email=user_data.email,
        hashed_password=hashed_password,
        role=user_data.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Verificar usuario y contraseña
    user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Determinar los scopes basados en el rol del usuario
    scopes = []
    if user.role == "admin":
        scopes = ["admin", "user"]
    else:
        scopes = ["user"]
    
    # Crear token JWT con scopes
    access_token = create_access_token(
        data={"sub": user.email, "scopes": scopes}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/verify")
async def verify_token_endpoint(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    user = verify_token(token, db)
    
    # Si llegamos aquí, el token es válido
    return {
        "status": "valid",
        "user": {
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active
        }
    }