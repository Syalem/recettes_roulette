const App = () => {
  const { recettes, loading, chargerRecettes, ajouterRecette, editerRecette, supprimerRecette, tirerAleatoire, synchroniserGitHub } = useRecettes();
  const { categories, chargerCategories } = useCategories();
  const { filtres, recettesFiltrees, modifierFiltre, toggleCategorie, reinitialiser } = useFilters(recettes);

  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [recetteEnCours, setRecetteEnCours] = React.useState(null);
  const [recetteAleatoire, setRecetteAleatoire] = React.useState(null);
  const [modalLoading, setModalLoading] = React.useState(false);
  const popupRef = React.useRef(null);

  React.useEffect(() => {
    chargerRecettes();
    chargerCategories();

    if (window.RecettePopup) {
      popupRef.current = new window.RecettePopup();
    }

    return () => {
      if (popupRef.current) {
        popupRef.current.destroy();
      }
    };
  }, []);

  const allIngredients = React.useMemo(() => {
    return Array.from(new Set(
      recettes.flatMap(r => r.ingredients || []).map(i => {
        if (!i) return '';
        if (typeof i === 'string') {
          const parts = i.split(' - ');
          return (parts[0] || '').trim();
        }
        return (i.ingredient || '').toString().trim();
      }).filter(Boolean)
    )).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [recettes]);

  const handleApplyFilters = () => {
    console.log('Filtres appliqués:', filtres);
  };

  const handleAddRecette = () => {
    setRecetteEnCours(null);
    setShowAddModal(true);
  };

  const handleSaveRecette = async (recetteData) => {
    setModalLoading(true);
    try {
      let success;
      if (recetteEnCours?.id) {
        success = await editerRecette(recetteEnCours.id, recetteData);
      } else {
        success = await ajouterRecette(recetteData);
      }
      
      if (success) {
        setShowAddModal(false);
        setRecetteEnCours(null);
        await chargerRecettes();
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenRecette = (recette) => {
    if (popupRef.current) {
      popupRef.current.show(recette, {
        onEdit: (r) => {
          setRecetteEnCours(r);
          setShowAddModal(true);
        },
        onDelete: supprimerRecette
      });
    }
  };

  const handleSyncGitHub = async () => {
    const success = await synchroniserGitHub();
    if (success) {
      alert('✅ Recettes synchronisées avec GitHub !');
      await chargerRecettes();
    } else {
      alert('❌ Erreur de synchronisation');
    }
  };

  const handleRandomRecette = async () => {
    const params = {};
    if (filtres.categories && filtres.categories.length > 0) {
      params.categories = filtres.categories;
    }
    if (filtres.duree_max) {
      params.duree_max = parseInt(filtres.duree_max);
    }

    const recette = await tirerAleatoire(params);
    setRecetteAleatoire(recette);
  };

  const handlePlanningClick = () => {
    window.location.href = '../static/planner.html';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header
        onAddClick={handleAddRecette}
        onSyncClick={handleSyncGitHub}
        onPlanningClick={handlePlanningClick}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        <SearchBar
          searchValue={filtres.recherche_texte}
          onSearchChange={(value) => modifierFiltre('recherche_texte', value)}
          onFilterClick={() => setShowFilterPanel(!showFilterPanel)}
          onRandomClick={handleRandomRecette}
          loading={loading}
        />

        {showFilterPanel && (
          <FilterPanel
            categories={categories}
            filtres={filtres}
            allIngredients={allIngredients}
            onToggleCategorie={toggleCategorie}
            onModifierFiltre={modifierFiltre}
            onReinitialiser={reinitialiser}
            onApplyFilters={handleApplyFilters}
          />
        )}

        {recetteAleatoire && (
          <SuggestionCard
            recette={recetteAleatoire}
            onClose={() => setRecetteAleatoire(null)}
            onClick={() => handleOpenRecette(recetteAleatoire)}
          />
        )}

        {recettesFiltrees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recettesFiltrees.map(recette => (
              <RecetteCard
                key={recette.id}
                recette={recette}
                onClick={() => handleOpenRecette(recette)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune recette trouvée</p>
          </div>
        )}
      </main>

      <AddRecetteModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setRecetteEnCours(null);
        }}
        onSave={handleSaveRecette}
        categories={categories}
        initialRecette={recetteEnCours}
        loading={modalLoading}
      />
    </div>
  );
};