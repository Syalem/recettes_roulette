const DEFAULT_RECIPE = {
  titre: '',
  duree_prep: '',
  ingredients: [{ ingredient: '', quantity: '' }],
  categorie: '',
  sous_categorie: '',
  lien: '',
  livre: '',
  page: '',
  tags: [],
  notes: ''
};

const AddRecetteManual = ({ 
  isOpen, 
  onClose, 
  onSave, 
  categories,
  initialRecette = null,
  loading = false,
  onSwitchToAuto = null  // Nouvelle prop pour basculer vers l'extraction auto
}) => {
  const [recette, setRecette] = React.useState(DEFAULT_RECIPE);
  const ingredientRefs = React.useRef([]);

  React.useEffect(() => {
    if (initialRecette) {
      const mappedIngredients = (initialRecette.ingredients || []).map(i => {
        if (!i) return { ingredient: '', quantity: '' };
        if (typeof i === 'string') {
          const parts = i.split(' - ');
          return { ingredient: parts[0] || '', quantity: parts[1] || '' };
        }
        return { ingredient: i.ingredient || '', quantity: i.quantity || '' };
      });
      setRecette({ ...initialRecette, ingredients: mappedIngredients });
    } else {
      setRecette(DEFAULT_RECIPE);
    }
  }, [initialRecette, isOpen]);

  const categorieSelectionnee = categories && Array.isArray(categories) 
    ? categories.find(c => c.nom === recette.categorie)
    : null;

  const handleSave = async () => {
    if (!recette.titre || !recette.duree_prep || !recette.categorie) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const ingredientsFiltrés = recette.ingredients
      .map(it => {
        if (!it) return '';
        if (typeof it === 'string') return it.trim();
        const name = (it.ingredient || '').trim();
        const qty = (it.quantity || '').toString().trim();
        return qty ? `${name} - ${qty}` : name;
      })
      .filter(s => s && s.length > 0);

    if (ingredientsFiltrés.length === 0) {
      alert('Veuillez ajouter au moins un ingrédient');
      return;
    }

    const recetteData = {
      ...recette,
      duree_prep: parseInt(recette.duree_prep),
      page: recette.page || '',
      ingredients: ingredientsFiltrés
    };

    await onSave(recetteData);
  };

  const modifierIngredient = (index, field, value) => {
    const newIngredients = [...recette.ingredients];
    const current = newIngredients[index] || { ingredient: '', quantity: '' };
    newIngredients[index] = { ...current, [field]: value };
    setRecette({ ...recette, ingredients: newIngredients });
  };

  const ajouterIngredient = () => {
    setRecette(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredient: '', quantity: '' }]
    }));
    
    // Focus sur le nouvel ingrédient après un petit délai
    setTimeout(() => {
      const inputs = document.querySelectorAll('input[name="ingredient"]');
      if (inputs.length) {
        const lastInput = inputs[inputs.length - 1];
        lastInput.focus();
      }
    }, 50);
  };

  const handleIngredientKeyDown = (e, index) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      // Tab = aller à la quantité (input suivant dans la même ligne)
      const quantityInput = e.target.parentElement.querySelector('input:nth-of-type(2)');
      if (quantityInput) {
        quantityInput.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      // Entrée = ajouter un nouvel ingrédient et y placer le curseur
      const newIngredients = [...recette.ingredients, { ingredient: '', quantity: '' }];
      setRecette({ ...recette, ingredients: newIngredients });
      
      // Focus sur le nouvel ingrédient après un petit délai
      setTimeout(() => {
        if (ingredientRefs.current[newIngredients.length - 1]) {
          ingredientRefs.current[newIngredients.length - 1].focus();
        }
      }, 50);
    }
  };

  const handleQuantityKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      // Entrée = ajouter un nouvel ingrédient et y placer le curseur
      const newIngredients = [...recette.ingredients, { ingredient: '', quantity: '' }];
      setRecette({ ...recette, ingredients: newIngredients });
      
      // Focus sur le nouvel ingrédient après un petit délai
      setTimeout(() => {
        if (ingredientRefs.current[newIngredients.length - 1]) {
          ingredientRefs.current[newIngredients.length - 1].focus();
        }
      }, 50);
    }
  };

  const supprimerIngredient = (index) => {
    const newIngredients = recette.ingredients.filter((_, i) => i !== index);
    setRecette({ ...recette, ingredients: newIngredients });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-8">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {recette.id ? 'Éditer la recette' : 'Nouvelle recette'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Bouton pour basculer vers l'extraction auto (seulement si on n'édite pas une recette existante) */}
          {!recette.id && onSwitchToAuto && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-purple-900 font-medium mb-1">
                    ✨ Gain de temps !
                  </p>
                  <p className="text-xs text-purple-700">
                    Vous avez un lien Instagram ou d'un blog ? Laissez-nous extraire les ingrédients automatiquement.
                  </p>
                </div>
                <button
                  onClick={onSwitchToAuto}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition whitespace-nowrap"
                >
                  Extraction auto
                </button>
              </div>
            </div>
          )}

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la recette *
            </label>
            <input
              type="text"
              value={recette.titre}
              onChange={(e) => setRecette({ ...recette, titre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Ex: Pâtes à la carbonara"
            />
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée de préparation (minutes) *
            </label>
            <input
              type="number"
              value={recette.duree_prep}
              onChange={(e) => setRecette({ ...recette, duree_prep: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Ex: 30"
            />
          </div>

          {/* Catégorie et Sous-catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                value={recette.categorie}
                onChange={(e) => setRecette({ 
                  ...recette, 
                  categorie: e.target.value,
                  sous_categorie: '' 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Sélectionner...</option>
                {categories && Array.isArray(categories) && categories.map(cat => (
                  <option key={cat.nom} value={cat.nom}>{cat.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sous-catégorie *
              </label>
              <select
                value={recette.sous_categorie}
                onChange={(e) => setRecette({ ...recette, sous_categorie: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                disabled={!recette.categorie}
              >
                <option value="">Sélectionner...</option>
                {categorieSelectionnee?.sous_categories && Array.isArray(categorieSelectionnee.sous_categories) && categorieSelectionnee.sous_categories.map(sc => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ingrédients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingrédients *
            </label>
            <div className="space-y-2">
              {recette.ingredients.map((ingObj, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    ref={el => ingredientRefs.current[idx] = el}
                    type="text"
                    name="ingredient"
                    value={ingObj.ingredient}
                    onChange={(e) => modifierIngredient(idx, 'ingredient', e.target.value)}
                    onKeyDown={(e) => handleIngredientKeyDown(e, idx)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder={`Ingrédient ${idx + 1}`}
                  />
                  <input
                    type="text"
                    value={ingObj.quantity}
                    onChange={(e) => modifierIngredient(idx, 'quantity', e.target.value)}
                    onKeyDown={(e) => handleQuantityKeyDown(e, idx)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Qtté (ex: 200g)"
                  />
                  {recette.ingredients.length > 1 && (
                    <button
                      onClick={() => supprimerIngredient(idx)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={ajouterIngredient}
              className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Ajouter un ingrédient
            </button>
          </div>

          {/* Livre et Page */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Livre (optionnel)
              </label>
              <input
                type="text"
                value={recette.livre}
                onChange={(e) => setRecette({ ...recette, livre: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: Cuisine italienne"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page
              </label>
              <input
                type="text"
                value={recette.page}
                onChange={(e) => setRecette({ ...recette, page: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: 42"
              />
            </div>
          </div>

          {/* Lien */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lien (optionnel)
            </label>
            <input
              type="url"
              value={recette.lien}
              onChange={(e) => setRecette({ ...recette, lien: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="https://..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              value={recette.notes}
              onChange={(e) => setRecette({ ...recette, notes: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Astuces, variantes..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};
