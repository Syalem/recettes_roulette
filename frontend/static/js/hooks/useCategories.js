const useCategories = () => {
  const [categories, setCategories] = React.useState(Array.isArray(window.DEMO_CATEGORIES) ? window.DEMO_CATEGORIES : []);
  const [loading, setLoading] = React.useState(false);

  const chargerCategories = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await window.recettesAPI.getCategories();
      setCategories(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      const demoData = Array.isArray(window.DEMO_CATEGORIES) ? window.DEMO_CATEGORIES : [];
      setCategories(demoData);
      return demoData;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategorieByName = React.useCallback((nom) => {
    return (Array.isArray(categories) ? categories : []).find(c => c.nom === nom);
  }, [categories]);

  return {
    categories,
    loading,
    chargerCategories,
    getCategorieByName
  };
};