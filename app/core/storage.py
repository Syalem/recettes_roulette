import json
from pathlib import Path
from typing import List, Optional
from datetime import datetime
import shutil

from app.models.recette import Recette


class RecetteStorage:
    """Gestionnaire de persistance des recettes en JSON et lecture séparée des catégories."""

    def __init__(self, recettes_file: str = "data/recettes.json", categories_file: str = "data/categories.json"):
        self.file_path = Path(recettes_file)
        self.categories_path = Path(categories_file)
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        # Ensure categories directory exists as well
        self.categories_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_storage()

    def _init_storage(self):
        """Initialiser les fichiers de stockage s'ils n'existent pas."""
        if not self.file_path.exists():
            initial_data = {
                "recettes": [],
                "metadata": {
                    "version": "1.0.0",
                    "derniere_modification": datetime.now().isoformat()
                }
            }
            self._write(initial_data)

        if not self.categories_path.exists():
            default_categories = [
                {
                    "nom": "Entrée",
                    "sous_categories": ["Salade", "Soupe", "Charcuterie"]
                },
                {
                    "nom": "Plat principal",
                    "sous_categories": ["Viande", "Poisson", "Végétarien", "Pâtes", "Riz"]
                },
                {
                    "nom": "Dessert",
                    "sous_categories": ["Tarte", "Gâteau", "Crème", "Fruit"]
                }
            ]
            # write categories file
            with open(self.categories_path, 'w', encoding='utf-8') as f:
                json.dump({"categories": default_categories, "metadata": {"version": "1.0.0", "derniere_modification": datetime.now().isoformat()}}, f, indent=2, ensure_ascii=False)
    
    def _read(self) -> dict:
        """Lire le fichier JSON des recettes."""
        with open(self.file_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _read_categories(self) -> dict:
        """Lire le fichier JSON des catégories."""
        with open(self.categories_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _write(self, data: dict):
        """Écrire dans le fichier JSON des recettes avec backup automatique."""
        # Créer backup avant modification
        if self.file_path.exists():
            backup_dir = self.file_path.parent / "backups"
            backup_dir.mkdir(exist_ok=True)
            backup_path = backup_dir / f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            shutil.copy2(self.file_path, backup_path)

            # Garder seulement les 10 derniers backups
            backups = sorted(backup_dir.glob("backup_*.json"))
            for old_backup in backups[:-10]:
                old_backup.unlink()

        # Mettre à jour metadata
        data.setdefault("metadata", {})
        data["metadata"]["derniere_modification"] = datetime.now().isoformat()

        # Écrire avec indentation pour lisibilité
        with open(self.file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def _generer_id(self, recettes: List[dict]) -> int:
        """Générer un ID unique."""
        if not recettes:
            return 1
        return max(r["id"] for r in recettes) + 1
    
    def creer(self, recette: Recette) -> dict:
        """Créer une nouvelle recette."""
        data = self._read()
        
        recette.id = self._generer_id(data["recettes"])
        recette.date_ajout = datetime.now().isoformat()
        
        recette_dict = recette.to_dict()
        data["recettes"].append(recette_dict)
        
        self._write(data)
        return recette_dict
    
    def obtenir(self, recette_id: int) -> Optional[dict]:
        """Obtenir une recette par ID."""
        data = self._read()
        return next((r for r in data["recettes"] if r["id"] == recette_id), None)
    
    def obtenir_toutes(self) -> List[dict]:
        """Obtenir toutes les recettes."""
        data = self._read()
        return data["recettes"]
    
    def modifier(self, recette_id: int, modifications: dict) -> Optional[dict]:
        """Modifier une recette."""
        data = self._read()
        
        for i, recette in enumerate(data["recettes"]):
            if recette["id"] == recette_id:
                data["recettes"][i].update(modifications)
                self._write(data)
                return data["recettes"][i]
        
        return None
    
    def supprimer(self, recette_id: int) -> bool:
        """Supprimer une recette."""
        data = self._read()
        taille_avant = len(data["recettes"])
        
        data["recettes"] = [r for r in data["recettes"] if r["id"] != recette_id]
        
        if len(data["recettes"]) < taille_avant:
            self._write(data)
            return True
        
        return False
    
    def obtenir_categories(self) -> List[dict]:
        """Obtenir toutes les catégories."""
        data = self._read_categories()
        return data.get("categories", [])