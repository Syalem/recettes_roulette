const FilterPanel = ({
  categories,
  filtres,
  allIngredients,
  onToggleCategorie,
  onToggleSousCategorie,
  onModifierFiltre,
  onReinitialiser,
  onApplyFilters
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onApplyFilters();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Catégories avec sous-catégories */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Catégorie
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 p-3 rounded-lg bg-gray-50">
            {Array.isArray(categories) && categories.map(cat => (
              <div key={cat.nom} className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={(filtres.categories || []).includes(cat.nom)}
                    onChange={() => onToggleCategorie(cat.nom)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{cat.nom}</span>
                </label>
                {/* Sous-catégories */}
                {cat.sous_categories && Array.isArray(cat.sous_categories) && (
                  <div className="ml-6 space-y-1">
                    {cat.sous_categories.map(scat => (
                      <label key={scat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(filtres.sous_categories || []).includes(scat)}
                          onChange={() => onToggleSousCategorie(scat)}
                          className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-600">{scat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ingrédient */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Ingrédient
          </label>
          <select
            value={filtres.ingredient || ''}
            onChange={(e) => onModifierFiltre('ingredient', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Tous</option>
            {allIngredients.map(ing => (
              <option key={ing} value={ing}>{ing}</option>
            ))}
          </select>
        </div>

        {/* Durée max */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Durée max (min)
          </label>
          <input
            type="number"
            min="0"
            step="5"
            value={filtres.duree_max || ''}
            onChange={(e) => onModifierFiltre('duree_max', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Ex: 30"
          />
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3">
        <button
          onClick={onApplyFilters}
          className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
        >
          Appliquer les filtres
        </button>
        <button
          onClick={onReinitialiser}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};