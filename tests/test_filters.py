import pytest
from app.core.filters import RecetteFilter, FiltresRecette

@pytest.fixture
def recettes_exemple():
    return [
        {
            "id": 1,
            "titre": "Pâtes carbonara",
            "duree_prep": 20,
            "ingredients": ["Pâtes", "Oeufs", "Lardons"],
            "categorie": "Plat principal",
            "sous_categorie": "Pâtes"
        },
        {
            "id": 2,
            "titre": "Salade César",
            "duree_prep": 15,
            "ingredients": ["Salade", "Poulet", "Parmesan"],
            "categorie": "Entrée",
            "sous_categorie": "Salade"
        },
        {
            "id": 3,
            "titre": "Tarte aux pommes",
            "duree_prep": 60,
            "ingredients": ["Pommes", "Pâte", "Sucre"],
            "categorie": "Dessert",
            "sous_categorie": "Tarte"
        }
    ]

def test_filtre_categorie(recettes_exemple):
    filtres = FiltresRecette(categorie="Plat principal")
    resultats = RecetteFilter.filtrer(recettes_exemple, filtres)
    
    assert len(resultats) == 1
    assert resultats[0]["titre"] == "Pâtes carbonara"

def test_filtre_duree_max(recettes_exemple):
    filtres = FiltresRecette(duree_max=20)
    resultats = RecetteFilter.filtrer(recettes_exemple, filtres)
    
    assert len(resultats) == 2
    assert all(r["duree_prep"] <= 20 for r in resultats)

def test_filtre_ingredients(recettes_exemple):
    filtres = FiltresRecette(ingredients_inclus=["Oeufs"])
    resultats = RecetteFilter.filtrer(recettes_exemple, filtres)
    
    assert len(resultats) == 1
    assert resultats[0]["titre"] == "Pâtes carbonara"

def test_tri_duree(recettes_exemple):
    resultats = RecetteFilter.trier(recettes_exemple, critere="duree_prep")
    
    assert resultats[0]["duree_prep"] == 15
    assert resultats[-1]["duree_prep"] == 60