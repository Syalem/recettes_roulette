from fastapi import APIRouter, HTTPException
from typing import List
import subprocess

from app.core.storage import RecetteStorage
from app.models.recette import Recette
from app.schemas.recette import RecetteCreate, RecetteUpdate, RecetteResponse

router = APIRouter(prefix="/recettes", tags=["Recettes"])
storage = RecetteStorage()

@router.post("/", response_model=RecetteResponse, status_code=201)
def creer_recette(recette: RecetteCreate):
    """Créer une nouvelle recette."""
    recette_obj = Recette(**recette.dict())
    nouvelle_recette = storage.creer(recette_obj)
    return nouvelle_recette

@router.get("/", response_model=List[RecetteResponse])
def lister_recettes():
    """Liste toutes les recettes."""
    return storage.obtenir_toutes()

@router.get("/{recette_id}", response_model=RecetteResponse)
def obtenir_recette(recette_id: int):
    """Obtenir une recette spécifique."""
    recette = storage.obtenir(recette_id)
    
    if not recette:
        raise HTTPException(status_code=404, detail="Recette non trouvée")
    
    return recette

@router.put("/{recette_id}", response_model=RecetteResponse)
def modifier_recette(recette_id: int, modifications: RecetteUpdate):
    """Modifier une recette existante."""
    modifs_dict = {k: v for k, v in modifications.dict().items() if v is not None}
    
    recette = storage.modifier(recette_id, modifs_dict)
    
    if not recette:
        raise HTTPException(status_code=404, detail="Recette non trouvée")
    
    return recette

@router.delete("/{recette_id}")
def supprimer_recette(recette_id: int):
    """Supprimer une recette."""
    success = storage.supprimer(recette_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Recette non trouvée")
    
    return {"message": "Recette supprimée avec succès"}

@router.get("/categories/liste")
def lister_categories():
    """Liste toutes les catégories disponibles."""
    return storage.obtenir_categories()

@router.get("/stats")
def statistiques_recettes():
    """Obtenir des statistiques sur les recettes."""
    recettes = storage.obtenir_toutes()
    
    if not recettes:
        return {"message": "Aucune recette"}
    
    # Statistiques par catégorie
    categories = {}
    for r in recettes:
        cat = r['categorie']
        categories[cat] = categories.get(cat, 0) + 1
    
    # Durée moyenne
    duree_moyenne = sum(r['duree_prep'] for r in recettes) / len(recettes)
    
    # Recette la plus rapide/longue
    plus_rapide = min(recettes, key=lambda r: r['duree_prep'])
    plus_longue = max(recettes, key=lambda r: r['duree_prep'])
    
    return {
        "total": len(recettes),
        "par_categorie": categories,
        "duree_moyenne": round(duree_moyenne, 1),
        "plus_rapide": {
            "titre": plus_rapide['titre'],
            "duree": plus_rapide['duree_prep']
        },
        "plus_longue": {
            "titre": plus_longue['titre'],
            "duree": plus_longue['duree_prep']
        }
    }

@router.post("/sync")
def synchroniser_avec_github():
    """Synchroniser les recettes avec GitHub."""
    try:
        result = subprocess.run(
            ["python", "scripts/sync_to_github.py"],
            capture_output=True,
            text=True
        )
        
        print("Sortie standard :", result.stdout)
        print("Erreurs :", result.stderr)
        print("Code de retour :", result.returncode)
        return {
            "status": "success",
            "message": result.stdout
        }
    except Exception as e:
        print("❌ echec synchroniser_avec_github")
        raise HTTPException(status_code=500, detail=str(e))
    