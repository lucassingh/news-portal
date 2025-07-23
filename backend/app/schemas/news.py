from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from fastapi import Form

class NewsBase(BaseModel):
    title: str
    subtitle: str
    image_description: str
    body: str

class NewsCreate(NewsBase):
    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        subtitle: str = Form(...),
        image_description: str = Form(...),
        body: str = Form(...)
    ):
        return cls(
            title=title,
            subtitle=subtitle,
            image_description=image_description,
            body=body
        )

class NewsResponse(NewsBase):
    id: int
    image_url: Optional[str] = None
    date: datetime
    
    class Config:
        from_attributes = True