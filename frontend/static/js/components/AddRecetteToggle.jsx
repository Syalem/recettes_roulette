import React, { useState } from 'react';

// Simple SVG Icons as components
const Wand2 = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 4V2" />
    <path d="M15 16v-2" />
    <path d="M8 9h2" />
    <path d="M20 9h2" />
    <path d="M17.8 11.8 19 13" />
    <path d="M15 9h0" />
    <path d="M17.8 6.2 19 5" />
    <path d="m3 21 9-9" />
    <path d="M12.2 6.2 11 5" />
  </svg>
);

const FileEdit = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
  </svg>
);

const AddRecetteToggle = ({ 
  isOpen, 
  onClose, 
  onSave, 
  categories,
  initialRecette = null,
  loading = false,
  RecetteExtractor,
  AddRecetteManual
}) => {
  // Si on édite une recette existante, on va directement en mode manuel
  const [mode, setMode] = useState(initialRecette ? 'manual' : 'choice');

  const handleClose = () => {
    setMode(initialRecette ? 'manual' : 'choice');
    onClose();
  };

  const handleExtractedRecipe = (extractedData) => {
    // Convertir les données extraites au format attendu
    const recetteData = {
      titre: extractedData.name,
      lien: extractedData.url,
      ingredients: extractedData.ingredients.map(ing => ({ 
        ingredient: ing, 
        quantity: '' 
      })),
      duree_prep: '',
      categorie: '',
      sous_categorie: '',
      livre: '',
      page: '',
      tags: [],
      notes: ''
    };
    
    // Passer en mode manuel avec les données pré-remplies
    setMode('manual');
    // On utilise un petit délai pour s'assurer que le modal manuel est monté
    setTimeout(() => {
      // Le AddRecetteManual recevra ces données via initialRecette
      onClose();
      // On doit rouvrir avec les données
      // Pour cela, on va passer par un état intermédiaire
    }, 0);
  };

  if (!isOpen) return null;

  // Mode choix initial
  if (mode === 'choice') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
            <h2 className="text-2xl font-bold">Nouvelle recette</h2>
            <p className="text-orange-100 text-sm mt-1">
              Comment souhaitez-vous ajouter votre recette ?
            </p>
          </div>

          {/* Choix */}
          <div className="p-6 space-y-4">
            <button
              onClick={() => setMode('auto')}
              className="w-full group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 rounded-xl p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="bg-purple-500 text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <Wand2 />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    Extraction automatique
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Collez un lien Instagram ou d'un blog de recette. 
                    Les ingrédients seront extraits automatiquement.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-purple-600 text-xs font-medium">
                    <span className="bg-purple-100 px-2 py-1 rounded">Instagram</span>
                    <span className="bg-purple-100 px-2 py-1 rounded">Blogs</span>
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode('manual')}
              className="w-full group relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 hover:border-orange-400 rounded-xl p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="bg-orange-500 text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <FileEdit />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    Saisie manuelle
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Entrez tous les détails de votre recette manuellement, 
                    comme d'habitude.
                  </p>
                  <div className="mt-3 text-orange-600 text-xs font-medium">
                    Contrôle total sur les informations
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0">
            <button
              onClick={handleClose}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mode extraction automatique
  if (mode === 'auto') {
    return (
      <RecetteExtractor 
        isOpen={isOpen}
        onClose={handleClose}
        onSave={onSave}
        onExtracted={handleExtractedRecipe}
        onSwitchToManual={() => setMode('manual')}
      />
    );
  }

  // Mode manuel
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <AddRecetteManual
        isOpen={isOpen}
        onClose={handleClose}
        onSave={onSave}
        categories={categories}
        initialRecette={initialRecette}
        loading={loading}
        onSwitchToAuto={() => setMode('auto')}
      />
    </div>
  );
};

export default AddRecetteToggle;
