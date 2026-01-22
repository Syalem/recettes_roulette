const DEFAULT_FILTERS = {
  categories: [],
  sous_categorie: '',
  duree_min: '',
  duree_max: '',
  ingredients: [], // CHANGÉ: de 'ingredient' à 'ingredients' (tableau)
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
    
    if (filtres.duree_max) {
      resultats = resultats.filter(r => r.duree_prep <= parseInt(filtres.duree_max));
    }

    // NOUVEAU: Filtrage par ingrédients multiples
    if (filtres.ingredients && filtres.ingredients.length > 0) {
      resultats = resultats.filter(r => {
        if (!r.ingredients || !Array.isArray(r.ingredients)) return false;
        
        // Normaliser les ingrédients de la recette
        const recetteIngredients = r.ingredients.map(i => {
          if (typeof i === 'string') {
            const parts = i.split(' - ');
            return parts[0].trim().toLowerCase();
          }
          return (i.ingredient || '').toString().trim().toLowerCase();
        });
        
        // Vérifier que TOUS les ingrédients filtrés sont présents dans la recette
        return filtres.ingredients.every(filterIng =>
          recetteIngredients.some(recIng => 
            recIng.includes(filterIng.toLowerCase())
          )
        );
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
        (r.ingredients && r.ingredients.some(ing => {
          const ingStr = typeof ing === 'string' ? ing : (ing.ingredient || '');
          return ingStr.toLowerCase().includes(terme);
        }))
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

  const reinitialiser = React.useCallback(() => {
    setFiltres(DEFAULT_FILTERS);
  }, []);

  return {
    filtres,
    recettesFiltrees,
    modifierFiltre,
    toggleCategorie,
    reinitialiser
  };
};