import random
from typing import List, Optional

from app.core.filters import RecetteFilter, FiltresRecette


class RecetteRandomPicker:
    """Classe pour sélectionner une recette aléatoire selon des critères."""
    
    @staticmethod
    def choisir_recette(
        recettes: List[dict],
        categorie: Optional[str] = None,
        duree_max: Optional[int] = None,
        ingredients_exclus: Optional[List[str]] = None
    ) -> Optional[dict]:
        """
        Sélectionner une recette aléatoire parmi celles qui correspondent aux critères.
        
        Args:
            recettes: Liste de toutes les recettes
            categorie: Catégorie souhaitée (optionnel)
            duree_max: Durée de préparation maximale en minutes (optionnel)
            ingredients_exclus: Liste d'ingrédients à éviter (optionnel)
            
        Returns:
            Une recette aléatoire ou None si aucune ne correspond
        """
        # Créer les filtres
        filtres = FiltresRecette(
            categorie=categorie,
            duree_max=duree_max,
            ingredients_exclus=ingredients_exclus
        )
        
        # Filtrer les recettes
        recettes_filtrees = RecetteFilter.filtrer(recettes, filtres)
        
        # Retourner une recette aléatoire
        if not recettes_filtrees:
            return None
        
        return random.choice(recettes_filtrees)
    
    @staticmethod
    def choisir_menu(
        recettes: List[dict],
        duree_max_totale: Optional[int] = None
    ) -> dict:
        """
        Composer un menu complet (entrée, plat, dessert) de manière aléatoire.
        
        Args:
            recettes: Liste de toutes les recettes
            duree_max_totale: Durée totale maximale pour tout le menu (optionnel)
            
        Returns:
            Dictionnaire avec entrée, plat et dessert
        """
        menu = {
            "entree": None,
            "plat": None,
            "dessert": None,
            "duree_totale": 0
        }
        
        # Répartir le temps si une limite est donnée
        if duree_max_totale:
            duree_entree = duree_max_totale * 0.2  # 20%
            duree_plat = duree_max_totale * 0.5    # 50%
            duree_dessert = duree_max_totale * 0.3 # 30%
        else:
            duree_entree = duree_plat = duree_dessert = None
        
        # Choisir entrée
        menu["entree"] = RecetteRandomPicker.choisir_recette(
            recettes, 
            categorie="Entrée",
            duree_max=duree_entree
        )
        
        # Choisir plat principal
        menu["plat"] = RecetteRandomPicker.choisir_recette(
            recettes,
            categorie="Plat principal",
            duree_max=duree_plat
        )
        
        # Choisir dessert
        menu["dessert"] = RecetteRandomPicker.choisir_recette(
            recettes,
            categorie="Dessert",
            duree_max=duree_dessert
        )
        
        # Calculer durée totale
        menu["duree_totale"] = sum(
            r["duree_prep"] for r in [menu["entree"], menu["plat"], menu["dessert"]]
            if r is not None
        )
        
        return menu
    
    @staticmethod
    def suggestions_rapides(
        recettes: List[dict],
        duree_max: int = 30,
        nombre: int = 3
    ) -> List[dict]:
        """
        Obtenir plusieurs suggestions de recettes rapides.
        
        Args:
            recettes: Liste de toutes les recettes
            duree_max: Durée maximale en minutes
            nombre: Nombre de suggestions à retourner
            
        Returns:
            Liste de recettes rapides aléatoires
        """
        filtres = FiltresRecette(duree_max=duree_max)
        recettes_rapides = RecetteFilter.filtrer(recettes, filtres)
        
        if not recettes_rapides:
            return []
        
        # S'assurer de ne pas demander plus de recettes qu'il n'y en a
        nombre_a_retourner = min(nombre, len(recettes_rapides))
        
        return random.sample(recettes_rapides, nombre_a_retourner)