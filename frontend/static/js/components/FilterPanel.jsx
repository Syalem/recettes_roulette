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

  const selectedCategories = filtres.categories || [];
  const selectedIngredients = filtres.ingredients || [];

  const toggleIngredient = (ingredient) => {
    const current = filtres.ingredients || [];
    const newIngredients = current.includes(ingredient)
      ? current.filter(i => i !== ingredient)
      : [...current, ingredient];
    onModifierFiltre('ingredients', newIngredients);
  };

  return (
    <div className="border-t border-gray-200 px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Catégories - Multi-select avec checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <div className="border border-gray-300 rounded-lg bg-white max-h-40 overflow-y-auto">
            {Array.isArray(categories) && categories.map(cat => (
              <label
                key={cat.nom}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.nom)}
                  onChange={() => onToggleCategorie(cat.nom)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-2 text-gray-700">{cat.nom}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ingrédients - Multi-select avec checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingrédient
          </label>
          <div className="border border-gray-300 rounded-lg bg-white max-h-40 overflow-y-auto">
            {allIngredients.map(ing => (
              <label
                key={ing}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(ing)}
                  onChange={() => toggleIngredient(ing)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-2 text-gray-700">{ing}</span>
              </label>
            ))}
          </div>
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