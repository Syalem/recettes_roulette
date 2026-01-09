from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional

from app.core.storage import RecetteStorage
from app.core.filters import RecetteFilter, FiltresRecette
from app.schemas.filters import FiltresRecetteSchema, TriSchema

router = APIRouter(prefix="/filtrer", tags=["Filtrage"])
storage = RecetteStorage()

@router.post("/", response_model=List[dict])
def filtrer_recettes(filtres: FiltresRecetteSchema):
    """
    Filtrer les recettes selon plusieurs critères.
    
    Permet de combiner plusieurs filtres :
    - Catégorie et sous-catégorie
    - Durée de préparation (min et max)
    - Ingrédients à inclure ou exclure
    - Livre source
    - Tags
    - Recherche textuelle
    """
    recettes = storage.obtenir_toutes()
    
    filtres_obj = FiltresRecette(
        categorie=filtres.categorie,
        sous_categorie=filtres.sous_categorie,
        duree_min=filtres.duree_min,
        duree_max=filtres.duree_max,
        ingredients_inclus=filtres.ingredients_inclus,
        ingredients_exclus=filtres.ingredients_exclus,
        livre=filtres.livre,
        tags=filtres.tags,
        recherche_texte=filtres.recherche_texte
    )
    
    resultats = RecetteFilter.filtrer(recettes, filtres_obj)
    
    return {
        "total": len(resultats),
        "recettes": resultats
    }

@router.get("/rapides")
def recettes_rapides(duree_max: int = Query(30, ge=1, le=180)):
    """Obtenir toutes les recettes rapides (durée <= duree_max)."""
    recettes = storage.obtenir_toutes()
    filtres = FiltresRecette(duree_max=duree_max)
    
    resultats = RecetteFilter.filtrer(recettes, filtres)
    
    return {
        "duree_max": duree_max,
        "total": len(resultats),
        "recettes": resultats
    }

@router.get("/categorie/{categorie}")
def recettes_par_categorie(
    categorie: str,
    sous_categorie: Optional[str] = None,
    duree_max: Optional[int] = Query(None, ge=1)
):
    """Filtrer par catégorie avec options supplémentaires."""
    recettes = storage.obtenir_toutes()
    
    filtres = FiltresRecette(
        categorie=categorie,
        sous_categorie=sous_categorie,
        duree_max=duree_max
    )
    
    resultats = RecetteFilter.filtrer(recettes, filtres)
    
    if not resultats:
        raise HTTPException(
            status_code=404,
            detail=f"Aucune recette trouvée pour la catégorie '{categorie}'"
        )
    
    return {
        "categorie": categorie,
        "sous_categorie": sous_categorie,
        "total": len(resultats),
        "recettes": resultats
    }

@router.post("/trier", response_model=List[dict])
def trier_recettes(
    tri: TriSchema,
    filtres: Optional[FiltresRecetteSchema] = None
):
    """
    Trier les recettes selon un critère.
    
    Critères disponibles : titre, duree_prep, date_ajout, categorie
    Peut combiner avec des filtres.
    """
    recettes = storage.obtenir_toutes()
    
    # Appliquer les filtres si fournis
    if filtres:
        filtres_obj = FiltresRecette(
            categorie=filtres.categorie,
            sous_categorie=filtres.sous_categorie,
            duree_min=filtres.duree_min,
            duree_max=filtres.duree_max,
            ingredients_inclus=filtres.ingredients_inclus,
            ingredients_exclus=filtres.ingredients_exclus,
            livre=filtres.livre,
            tags=filtres.tags,
            recherche_texte=filtres.recherche_texte
        )
        recettes = RecetteFilter.filtrer(recettes, filtres_obj)
    
    # Trier
    try:
        resultats = RecetteFilter.trier(
            recettes,
            critere=tri.critere,
            ordre_croissant=tri.ordre_croissant
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {
        "critere": tri.critere,
        "ordre_croissant": tri.ordre_croissant,
        "total": len(resultats),
        "recettes": resultats
    }