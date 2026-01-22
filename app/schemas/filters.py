from pydantic import BaseModel, Field
from typing import Optional, List

class FiltresRecetteSchema(BaseModel):
    """Schéma pour les paramètres de filtrage."""
    categorie: Optional[str] = None
    sous_categorie: Optional[str] = None
    duree_max: Optional[int] = Field(None, ge=0)
    ingredients_inclus: Optional[List[str]] = None
    ingredients_exclus: Optional[List[str]] = None
    livre: Optional[str] = None
    tags: Optional[List[str]] = None
    recherche_texte: Optional[str] = None
    ingredients: Optional[List[str]] = None  # ← Ajoute cette ligne


class TriSchema(BaseModel):
    """Schéma pour les paramètres de tri."""
    critere: str = Field("titre", description="Critère de tri")
    ordre_croissant: bool = Field(True, description="Ordre croissant ou décroissant")

class RandomRecetteRequest(BaseModel):
    """Schéma pour la requête de recette aléatoire."""
    categorie: Optional[str] = None
    duree_max: Optional[int] = Field(None, ge=0)
    ingredients_exclus: Optional[List[str]] = None

class MenuRequest(BaseModel):
    """Schéma pour la requête de menu complet."""
    duree_max_totale: Optional[int] = Field(None, ge=0)