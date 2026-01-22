const SuggestionCard = ({ recette, onClose, onClick }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
      className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-xl p-8 mb-8 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">🎲 Suggestion du jour</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-white hover:text-gray-200"
          aria-label="Fermer la suggestion"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <h3 className="text-3xl font-bold mb-4">
        {recette.titre}
      </h3>

      <div className="flex gap-6 text-lg flex-wrap">
        <span className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {recette.duree_prep} min
        </span>
        <span className="flex items-center gap-2">
          {recette.categorie}
        </span>
      </div>
    </div>
  );
};