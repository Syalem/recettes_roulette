from dataclasses import dataclass, asdict
from typing import List, Optional
from datetime import datetime

@dataclass
class Recette:
    """Modèle de données pour une recette."""
    titre: str
    duree_prep: int  # en minutes
    ingredients: List[str]
    categorie: str
    sous_categorie: str
    id: Optional[int] = None
    lien: Optional[str] = None
    livre: Optional[str] = None
    page: Optional[int] = None
    date_ajout: Optional[str] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    
    def __post_init__(self):
        """Validation et normalisation après initialisation."""
        if self.date_ajout is None:
            self.date_ajout = datetime.now().isoformat()
        
        if self.tags is None:
            self.tags = []
    
    def to_dict(self) -> dict:
        """Convertir en dictionnaire."""
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Recette':
        """Créer une instance depuis un dictionnaire."""
        return cls(**data)