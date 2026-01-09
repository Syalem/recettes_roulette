from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List

from app.core.storage import RecetteStorage
from app.core.random_picker import RecetteRandomPicker
from app.schemas.filters import RandomRecetteRequest, MenuRequest

router = APIRouter(prefix="/random", tags=["Aléatoire"])
storage = RecetteStorage()

@router.post("/recette")
def recette_aleatoire(params: RandomRecetteRequest):
    """
    Obtenir une recette aléatoire selon des critères.
    
    Permet de spécifier :
    - Une catégorie (Entrée, Plat principal, Dessert)
    - Une durée de préparation maximale
    - Des ingrédients à exclure
    """
    recettes = storage.obtenir_toutes()
    
    if not recettes:
        raise HTTPException(status_code=404, detail="Aucune recette disponible")
    
    recette = RecetteRandomPicker.choisir_recette(
        recettes,
        categorie=params.categorie,
        duree_max=params.duree_max,
        ingredients_exclus=params.ingredients_exclus
    )
    
    if not recette:
        raise HTTPException(
            status_code=404,
            detail="Aucune recette ne correspond aux critères"
        )
    
    return recette

@router.get("/recette/simple")
def recette_aleatoire_simple(
    categorie: Optional[str] = Query(None),
    duree_max: Optional[int] = Query(None, ge=1)
):
    """Version GET simplifiée pour obtenir une recette aléatoire."""
    recettes = storage.obtenir_toutes()
    
    if not recettes:
        raise HTTPException(status_code=404, detail="Aucune recette disponible")
    
    recette = RecetteRandomPicker.choisir_recette(
        recettes,
        categorie=categorie,
        duree_max=duree_max
    )
    
    if not recette:
        raise HTTPException(
            status_code=404,
            detail="Aucune recette ne correspond aux critères"
        )
    
    return recette

@router.post("/menu")
def menu_aleatoire(params: MenuRequest):
    """
    Composer un menu complet aléatoire (entrée, plat, dessert).
    
    Permet de spécifier une durée totale maximale qui sera répartie entre les plats.
    """
    recettes = storage.obtenir_toutes()
    
    if not recettes:
        raise HTTPException(status_code=404, detail="Aucune recette disponible")
    
    menu = RecetteRandomPicker.choisir_menu(
        recettes,
        duree_max_totale=params.duree_max_totale
    )
    
    # Vérifier qu'on a au moins un plat
    if not any([menu["entree"], menu["plat"], menu["dessert"]]):
        raise HTTPException(
            status_code=404,
            detail="Impossible de composer un menu avec les recettes disponibles"
        )
    
    return menu

@router.get("/suggestions")
def suggestions_rapides(
    duree_max: int = Query(30, ge=1, le=180),
    nombre: int = Query(3, ge=1, le=10)
):
    """
    Obtenir plusieurs suggestions de recettes rapides.
    
    Utile pour afficher des idées de repas rapides.
    """
    recettes = storage.obtenir_toutes()
    
    if not recettes:
        raise HTTPException(status_code=404, detail="Aucune recette disponible")
    
    suggestions = RecetteRandomPicker.suggestions_rapides(
        recettes,
        duree_max=duree_max,
        nombre=nombre
    )
    
    if not suggestions:
        raise HTTPException(
            status_code=404,
            detail=f"Aucune recette de moins de {duree_max} minutes disponible"
        )
    
    return {
        "duree_max": duree_max,
        "nombre_demande": nombre,
        "nombre_retourne": len(suggestions),
        "suggestions": suggestions
    }