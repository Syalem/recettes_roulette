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
      'Lundi-Midi': 'Lundi midi',
      'Lundi-Soir': 'Lundi soir',
      'Mardi-Midi': 'Mardi midi',
      'Mardi-Soir': 'Mardi soir',
      'Mercredi-Midi': 'Mercredi midi',
      'Mercredi-Soir': 'Mercredi soir',
      'Jeudi-Midi': 'Jeudi midi',
      'Jeudi-Soir': 'Jeudi soir',
      'Vendredi-Midi': 'Vendredi midi',
      'Vendredi-Soir': 'Vendredi soir',
      'Samedi-Midi': 'Samedi midi',
      'Samedi-Soir': 'Samedi soir',
      'Dimanche-Midi': 'Dimanche midi',
      'Dimanche-Soir': 'Dimanche soir'
};