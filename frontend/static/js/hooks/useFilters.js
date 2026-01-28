const DEFAULT_FILTERS = {
  categories: [],
  sous_categories: [],
  duree_min: '',
  duree_max: '',
  ingredients: [],
  ingredient_mode: 'any',
  recherche_texte: '',
  tags: [],
  livre: ''
};

const useFilters = (recettes = []) => {
  const [filtres, setFiltres] = React.useState(DEFAULT_FILTERS);

  const appliquerFiltres = React.useCallback(() => {
    if (!Array.isArray(recettes)) return [];
    let resultats = recettes.slice();

    if (filtres.categories && filtres.categories.length > 0) {
      resultats = resultats.filter(r => filtres.categories.includes(r.categorie));
    }

    if (filtres.sous_categories && filtres.sous_categories.length > 0) {
      resultats = resultats.filter(r => filtres.sous_categories.includes(r.sous_categorie));
    }

    if (filtres.duree_min) {
      resultats = resultats.filter(r => r.duree_prep >= parseInt(filtres.duree_min));
    }

    if (filtres.duree_max) {
      resultats = resultats.filter(r => r.duree_prep <= parseInt(filtres.duree_max));
    }

    if (filtres.ingredients && filtres.ingredients.length > 0) {
      resultats = resultats.filter(r => {
        if (!r.ingredients) return false;
        const ingredientsLower = r.ingredients.map(i => i.toLowerCase());
        
        if (filtres.ingredient_mode === 'all') {
          // Tous les ingrédients doivent être présents
          return filtres.ingredients.every(ing =>
            ingredientsLower.some(ri => ri.includes(ing.toLowerCase()))
          );
        } else {
          // Au moins un ingrédient doit être présent
          return filtres.ingredients.some(ing =>
            ingredientsLower.some(ri => ri.includes(ing.toLowerCase()))
          );
        }
      });
    }

    if (filtres.livre) {
      resultats = resultats.filter(r => r.livre === filtres.livre);
    }

    if (filtres.tags && filtres.tags.length > 0) {
      resultats = resultats.filter(r =>
        r.tags && filtres.tags.some(tag => r.tags.includes(tag))
      );
    }

    if (filtres.recherche_texte) {
      const terme = filtres.recherche_texte.toLowerCase();
      resultats = resultats.filter(r => 
        r.titre.toLowerCase().includes(terme) ||
        (r.ingredients && r.ingredients.some(ing => ing.toLowerCase().includes(terme)))
      );
    }

    return resultats;
  }, [filtres, recettes]);

  const recettesFiltrees = React.useMemo(() => appliquerFiltres(), [appliquerFiltres]);

  const modifierFiltre = React.useCallback((nomFiltre, valeur) => {
    setFiltres(prev => ({
      ...prev,
      [nomFiltre]: valeur
    }));
  }, []);

  const toggleCategorie = React.useCallback((categorie) => {
    setFiltres(prev => {
      const categories = Array.isArray(prev.categories) ? prev.categories : [];
      if (categories.includes(categorie)) {
        return {
          ...prev,
          categories: categories.filter(c => c !== categorie)
        };
      } else {
        return {
          ...prev,
          categories: [...categories, categorie]
        };
      }
    });
  }, []);

  const toggleSousCategorie = React.useCallback((sousCategorie) => {
    setFiltres(prev => {
      const sousCategories = Array.isArray(prev.sous_categories) ? prev.sous_categories : [];
      if (sousCategories.includes(sousCategorie)) {
        return {
          ...prev,
          sous_categories: sousCategories.filter(s => s !== sousCategorie)
        };
      } else {
        return {
          ...prev,
          sous_categories: [...sousCategories, sousCategorie]
        };
      }
    });
  }, []);
  
  const toggleIngredient = React.useCallback((ingredient) => {
    setFiltres(prev => {
      const ingredients = Array.isArray(prev.ingredients) ? prev.ingredients : [];
      if (ingredients.includes(ingredient)) {
        return {
          ...prev,
          ingredients: ingredients.filter(i => i !== ingredient)
        };
      } else {
        return {
          ...prev,
          ingredients: [...ingredients, ingredient]
        };
      }
    });
  }, []);

  const reinitialiser = React.useCallback(() => {
    setFiltres(DEFAULT_FILTERS);
  }, []);

  return {
    filtres,
    recettesFiltrees,
    modifierFiltre,
    toggleCategorie,
    toggleSousCategorie,
    toggleIngredient,
    reinitialiser
  };
};