const RecetteCard = ({ recette, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 cursor-pointer h-full flex flex-col"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
        {recette.titre}
      </h3>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1 whitespace-nowrap">
          <Clock className="w-4 h-4" />
          {recette.duree_prep} min
        </span>
        {recette.livre && (
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Book className="w-4 h-4" />
            {recette.livre}
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full">
          {recette.categorie}
        </span>
        {recette.sous_categorie && (
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
            {recette.sous_categorie}
          </span>
        )}
      </div>

      <div className="border-t border-gray-200 pt-3 flex-1">
        <p className="text-sm font-medium text-gray-700 mb-2">Ingrédients:</p>
        <ul className="text-sm text-gray-600 space-y-1">
          {recette.ingredients && recette.ingredients.slice(0, 3).map((ing, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span className="line-clamp-1">{ing}</span>
            </li>
          ))}
          {recette.ingredients && recette.ingredients.length > 3 && (
            <li className="text-gray-400 italic">
              +{recette.ingredients.length - 3} autres...
            </li>
          )}
        </ul>
      </div>

      {recette.tags && recette.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {recette.tags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};