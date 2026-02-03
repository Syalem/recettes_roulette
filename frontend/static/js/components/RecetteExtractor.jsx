const RecetteExtractor = ({ 
  isOpen, 
  onClose, 
  onSave,
  onExtracted,
  onSwitchToManual 
}) => {
  const [url, setUrl] = React.useState('');
  const [extractedData, setExtractedData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedRecipe, setEditedRecipe] = React.useState(null);

  const extractRecipe = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Appeler votre API Flask au lieu de l'API Anthropic directement
      const response = await fetch('/api/extract-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'extraction');
      }

      const parsed = result.data;
      
      if (!parsed.ingredients || parsed.ingredients.length === 0) {
        throw new Error('Aucun ingrédient trouvé à cette URL');
      }
      
      setExtractedData(parsed);
      setEditedRecipe({
        name: parsed.name,
        url: url,
        ingredients: parsed.ingredients
      });
      setIsEditing(true);
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Impossible d\'extraire la recette. Vérifiez l\'URL ou essayez une autre source.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...editedRecipe.ingredients];
    newIngredients[index] = value;
    setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setEditedRecipe({
      ...editedRecipe,
      ingredients: [...editedRecipe.ingredients, '']
    });
  };

  const removeIngredient = (index) => {
    setEditedRecipe({
      ...editedRecipe,
      ingredients: editedRecipe.ingredients.filter((_, i) => i !== index)
    });
  };

  const saveRecipe = () => {
    const cleanedIngredients = editedRecipe.ingredients.filter(ing => ing.trim() !== '');
    
    if (!editedRecipe.name || cleanedIngredients.length === 0) {
      alert('Veuillez remplir le nom et ajouter au moins un ingrédient');
      return;
    }
    
    const finalRecipe = {
      name: editedRecipe.name,
      url: editedRecipe.url,
      ingredients: cleanedIngredients,
      source: extractedData?.source || 'manual'
    };
    
    // Appeler le callback onExtracted si fourni
    if (onExtracted) {
      onExtracted(finalRecipe);
    } else if (onSave) {
      onSave(finalRecipe);
    }
    
    reset();
  };

  const reset = () => {
    setUrl('');
    setExtractedData(null);
    setEditedRecipe(null);
    setIsEditing(false);
    setError('');
  };

  const startManualEntry = () => {
    if (onSwitchToManual) {
      onSwitchToManual();
    } else {
      setEditedRecipe({
        name: '',
        url: '',
        ingredients: ['']
      });
      setIsEditing(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                🍳 Extraction automatique
              </h1>
              <p className="text-gray-600 mt-1">
                Collez un lien Instagram ou d'un blog de recette
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!isEditing ? (
            <>
              <div className="space-y-4">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && extractRecipe()}
                    placeholder="https://instagram.com/p/... ou https://blog.com/recette"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none transition-colors"
                    disabled={isLoading}
                  />
                </div>

                <button
                  onClick={extractRecipe}
                  disabled={isLoading || !url}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeDasharray="60" strokeDashoffset="30"></circle>
                      </svg>
                      Extraction en cours...
                    </>
                  ) : (
                    'Extraire les ingrédients'
                  )}
                </button>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={startManualEntry}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline"
                  >
                    Ou saisir manuellement
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">💡 Sources supportées</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Posts Instagram (ingrédients dans la description)</li>
                  <li>• Blogs de recettes</li>
                  <li>• Sites de cuisine populaires</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {extractedData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Extraction réussie depuis {extractedData.source === 'instagram' ? 'Instagram' : 'un blog'}
                  </div>
                  <p className="text-sm text-green-600">
                    Vous pouvez maintenant valider ou modifier les informations ci-dessous
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom de la recette
                </label>
                <input
                  type="text"
                  value={editedRecipe.name}
                  onChange={(e) => setEditedRecipe({ ...editedRecipe, name: e.target.value })}
                  placeholder="Ex: Tarte aux pommes de grand-mère"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL source (optionnel)
                </label>
                <input
                  type="url"
                  value={editedRecipe.url}
                  onChange={(e) => setEditedRecipe({ ...editedRecipe, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ingrédients
                </label>
                <div className="space-y-2">
                  {editedRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder="Ex: 500g de farine"
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
                      />
                      <button
                        onClick={() => removeIngredient(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addIngredient}
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Ajouter un ingrédient
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={reset}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={saveRecipe}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Continuer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
