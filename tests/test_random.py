import pytest
from app.core.random_picker import RecetteRandomPicker

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

def test_choisir_recette_avec_categorie(recettes_exemple):
    recette = RecetteRandomPicker.choisir_recette(
        recettes_exemple,
        categorie="Entrée"
    )
    
    assert recette is not None
    assert recette["categorie"] == "Entrée"

def test_choisir_recette_avec_duree_max(recettes_exemple):
    recette = RecetteRandomPicker.choisir_recette(
        recettes_exemple,
        duree_max=20
    )
    
    assert recette is not None
    assert recette["duree_prep"] <= 20

def test_choisir_recette_aucun_resultat(recettes_exemple):
    recette = RecetteRandomPicker.choisir_recette(
        recettes_exemple,
        duree_max=5
    )
    
    assert recette is None

def test_composer_menu(recettes_exemple):
    menu = RecetteRandomPicker.choisir_menu(recettes_exemple)
    
    assert "entree" in menu
    assert "plat" in menu
    assert "dessert" in menu
    assert "duree_totale" in menu