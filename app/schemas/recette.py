from pydantic import BaseModel, Field
from typing import List, Optional

class RecetteBase(BaseModel):
    """Schéma de base pour une recette."""
    titre: str = Field(..., min_length=1, max_length=200)
    duree_prep: int = Field(..., gt=0, description="Durée en minutes")
    ingredients: List[str] = Field(..., min_items=1)
    categorie: str
    sous_categorie: str
    lien: Optional[str] = None
    livre: Optional[str] = None
    page: Optional[int] = Field(None, gt=0)
    tags: Optional[List[str]] = []
    notes: Optional[str] = None

class RecetteCreate(RecetteBase):
    """Schéma pour créer une recette."""
    pass

class RecetteUpdate(BaseModel):
    """Schéma pour modifier une recette."""
    titre: Optional[str] = None
    duree_prep: Optional[int] = Field(None, gt=0)
    ingredients: Optional[List[str]] = None
    categorie: Optional[str] = None
    sous_categorie: Optional[str] = None
    lien: Optional[str] = None
    livre: Optional[str] = None
    page: Optional[int] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None

class RecetteResponse(RecetteBase):
    """Schéma pour la réponse contenant une recette."""
    id: int
    date_ajout: str
    
    class Config:
        from_attributes = True