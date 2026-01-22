// Constantes globales
window.API_URL = '/api';

window.DEMO_CATEGORIES = [
  { nom: "Entrée", sous_categories: ["Salade", "Soupe", "Charcuterie"] },
  { nom: "Plat principal", sous_categories: ["Viande", "Poisson", "Végétarien", "Pâtes", "Riz"] },
  { nom: "Dessert", sous_categories: ["Tarte", "Gâteau", "Crème", "Fruit"] }
];

window.DEMO_RECIPES = [
  { 
    id: 1, 
    titre: "Pâtes Carbonara", 
    duree_prep: 20, 
    ingredients: ["Pâtes", "Oeufs", "Lardons", "Parmesan"], 
    categorie: "Plat principal", 
    sous_categorie: "Pâtes", 
    tags: ["Italien", "Rapide"],
    lien: "",
    livre: "",
    page: "",
    notes: ""
  },
  { 
    id: 2, 
    titre: "Salade César", 
    duree_prep: 15, 
    ingredients: ["Salade romaine", "Poulet", "Parmesan", "Croûtons"], 
    categorie: "Entrée", 
    sous_categorie: "Salade", 
    tags: ["Frais", "Léger"],
    lien: "",
    livre: "",
    page: "",
    notes: ""
  }
];

window.MEAL_TYPES = {
        'lundi': 'Lundi',
        'mardi': 'Mardi',
        'mercredi': 'Mercredi',
        'jeudi': 'Jeudi',
        'vendredi': 'Vendredi',
        'samedi': 'Samedi',
        'dimanche': 'Dimanche'
};