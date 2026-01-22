const useRecettes = () => {
  const [recettes, setRecettes] = React.useState(Array.isArray(window.DEMO_RECIPES) ? window.DEMO_RECIPES : []);
  const [loading, setLoading] = React.useState(false);

  const chargerRecettes = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await window.recettesAPI.getAll();
      setRecettes(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur chargement recettes:', error);
      setRecettes(window.DEMO_RECIPES || []);
      return window.DEMO_RECIPES || [];
    } finally {
      setLoading(false);
    }
  }, []);

  const ajouterRecette = React.useCallback(async (recetteData) => {
    try {
      const result = await window.recettesAPI.create(recetteData);
      if (result) {
        await chargerRecettes();
        return true;
      }
    } catch (error) {
      const newRecette = {
        ...recetteData,
        id: (recettes?.length || 0) + 1,
        date_ajout: new Date().toISOString()
      };
      setRecettes([...(recettes || []), newRecette]);
      return true;
    }
    return false;
  }, [recettes]);

  const editerRecette = React.useCallback(async (id, recetteData) => {
    try {
      const result = await window.recettesAPI.update(id, recetteData);
      if (result) {
        await chargerRecettes();
        return true;
      }
    } catch (error) {
      setRecettes((recettes || []).map(r => r.id === id ? { ...r, ...recetteData } : r));
      return true;
    }
    return false;
  }, [recettes]);

  const supprimerRecette = React.useCallback(async (id) => {
    if (!confirm('Supprimer cette recette ?')) return false;
    try {
      const success = await window.recettesAPI.delete(id);
      if (success) {
        await chargerRecettes();
        return true;
      }
    } catch (error) {
      setRecettes((recettes || []).filter(r => r.id !== id));
      return true;
    }
    return false;
  }, [recettes]);

  const tirerAleatoire = React.useCallback(async (params = {}) => {
    try {
      const recette = await window.recettesAPI.getRandomRecette(params);
      return recette;
    } catch (error) {
      const filtrees = (recettes && recettes.length > 0) ? recettes : window.DEMO_RECIPES;
      return filtrees[Math.floor(Math.random() * filtrees.length)];
    }
  }, [recettes]);

  const synchroniserGitHub = React.useCallback(async () => {
    try {
      const success = await window.recettesAPI.syncGitHub();
      return success;
    } catch (error) {
      console.error('Erreur sync:', error);
      return false;
    }
  }, []);

  return {
    recettes,
    loading,
    chargerRecettes,
    ajouterRecette,
    editerRecette,
    supprimerRecette,
    tirerAleatoire,
    synchroniserGitHub
  };
};