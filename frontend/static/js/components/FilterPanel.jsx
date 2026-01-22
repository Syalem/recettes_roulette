const FilterPanel = ({
  categories,
  filtres,
  allIngredients,
  onToggleCategorie,
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
    <div className="border-t border-gray-200 px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <select
            value={filtres.categories && filtres.categories.length > 0 ? filtres.categories[0] : ''}
            onChange={(e) => {
              if (e.target.value) {
                onToggleCategorie(e.target.value);
              } else {
                if (filtres.categories && filtres.categories.length > 0) {
                  filtres.categories.forEach(cat => onToggleCategorie(cat));
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Toutes</option>
            {Array.isArray(categories) && categories.map(cat => (
              <option key={cat.nom} value={cat.nom}>{cat.nom}</option>
            ))}
          </select>
        </div>

        {/* Ingrédient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingrédient
          </label>
          <select
            value={filtres.ingredient || ''}
            onChange={(e) => onModifierFiltre('ingredient', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Tous</option>
            {allIngredients.map(ing => (
              <option key={ing} value={ing}>{ing}</option>
            ))}
          </select>
        </div>

        {/* Durée max */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durée max (min)
          </label>
          <input
            type="number"
            min="0"
            step="5"
            value={filtres.duree_max || ''}
            onChange={(e) => onModifierFiltre('duree_max', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Ex: 30"
          />
        </div>
      </div>

      {/* Buttons row */}
      <div className="flex gap-3">
        <button
          onClick={onApplyFilters}
          className="flex-1 bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 transition font-medium"
        >
          Appliquer les filtres
        </button>
        <button
          onClick={onReinitialiser}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};