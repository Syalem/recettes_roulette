from typing import List, Optional
from dataclasses import dataclass

@dataclass
class FiltresRecette:
    """Critères de filtrage pour les recettes."""
    categorie: Optional[str] = None
    sous_categorie: Optional[str] = None
    duree_min: Optional[int] = None
    duree_max: Optional[int] = None
    ingredients_inclus: Optional[List[str]] = None
    ingredients_exclus: Optional[List[str]] = None
    livre: Optional[str] = None
    tags: Optional[List[str]] = None
    recherche_texte: Optional[str] = None


class RecetteFilter:
    """Classe pour filtrer les recettes selon différents critères."""
    
    @staticmethod
    def filtrer(recettes: List[dict], filtres: FiltresRecette) -> List[dict]:
        """
        Appliquer les filtres sur une liste de recettes.
        
        Args:
            recettes: Liste de recettes à filtrer
            filtres: Critères de filtrage
            
        Returns:
            Liste de recettes filtrées
        """
        resultats = recettes.copy()
        
        # Filtre par catégorie
        if filtres.categorie:
            resultats = [
                r for r in resultats 
                if r["categorie"].lower() == filtres.categorie.lower()
            ]
        
        # Filtre par sous-catégorie
        if filtres.sous_categorie:
            resultats = [
                r for r in resultats 
                if r["sous_categorie"].lower() == filtres.sous_categorie.lower()
            ]
        
        # Filtre par durée minimale
        if filtres.duree_min is not None:
            resultats = [
                r for r in resultats 
                if r["duree_prep"] >= filtres.duree_min
            ]
        
        # Filtre par durée maximale
        if filtres.duree_max is not None:
            resultats = [
                r for r in resultats 
                if r["duree_prep"] <= filtres.duree_max
            ]
        
        # Filtre par ingrédients à inclure
        if filtres.ingredients_inclus:
            resultats = [
                r for r in resultats
                if RecetteFilter._contient_ingredients(
                    r["ingredients"], 
                    filtres.ingredients_inclus
                )
            ]
        
        # Filtre par ingrédients à exclure
        if filtres.ingredients_exclus:
            resultats = [
                r for r in resultats
                if not RecetteFilter._contient_ingredients(
                    r["ingredients"], 
                    filtres.ingredients_exclus
                )
            ]
        
        # Filtre par livre
        if filtres.livre:
            resultats = [
                r for r in resultats 
                if r.get("livre") and r["livre"].lower() == filtres.livre.lower()
            ]
        
        # Filtre par tags
        if filtres.tags:
            resultats = [
                r for r in resultats
                if r.get("tags") and any(tag in r["tags"] for tag in filtres.tags)
            ]
        
        # Recherche textuelle (titre ou notes)
        if filtres.recherche_texte:
            terme = filtres.recherche_texte.lower()
            resultats = [
                r for r in resultats
                if terme in r["titre"].lower() or 
                   (r.get("notes") and terme in r["notes"].lower())
            ]
        
        return resultats
    
    @staticmethod
    def _contient_ingredients(ingredients_recette: List[str], ingredients_recherches: List[str]) -> bool:
        """
        Vérifier si la recette contient les ingrédients recherchés.
        
        Args:
            ingredients_recette: Liste des ingrédients de la recette
            ingredients_recherches: Liste des ingrédients à rechercher
            
        Returns:
            True si tous les ingrédients recherchés sont présents
        """
        ingredients_lower = [ing.lower() for ing in ingredients_recette]
        
        for ing_recherche in ingredients_recherches:
            ing_lower = ing_recherche.lower()
            if not any(ing_lower in ing for ing in ingredients_lower):
                return False
        
        return True
    
    @staticmethod
    def trier(
        recettes: List[dict], 
        critere: str = "titre", 
        ordre_croissant: bool = True
    ) -> List[dict]:
        """
        Trier les recettes selon un critère.
        
        Args:
            recettes: Liste de recettes à trier
            critere: Critère de tri ('titre', 'duree_prep', 'date_ajout', 'categorie')
            ordre_croissant: True pour ordre croissant, False pour décroissant
            
        Returns:
            Liste de recettes triées
        """
        criteres_valides = {
            "titre": lambda r: r["titre"].lower(),
            "duree_prep": lambda r: r["duree_prep"],
            "date_ajout": lambda r: r.get("date_ajout", ""),
            "categorie": lambda r: r["categorie"].lower()
        }
        
        if critere not in criteres_valides:
            raise ValueError(f"Critère de tri invalide. Utilisez: {', '.join(criteres_valides.keys())}")
        
        return sorted(
            recettes, 
            key=criteres_valides[critere], 
            reverse=not ordre_croissant
        )