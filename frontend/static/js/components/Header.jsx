const Header = ({ onAddClick, onSyncClick, onPlanningClick }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ChefHat />
            <h1 className="text-3xl font-bold text-gray-900">Mes Recettes</h1>
          </div>
          
          <div className="flex items-stretch gap-2">
            <button
              onClick={onPlanningClick}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg"
              title="Ouvrir le planning"
            >
              📅
              <span className="hidden sm:inline">Planning</span>
            </button>

            <button
              onClick={onSyncClick}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition shadow-lg"
              title="Synchroniser avec GitHub"
            >
              ☁️
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              onClick={onAddClick}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition shadow-lg"
              title="Ajouter une nouvelle recette"
            >
              <Plus />
              <span className="hidden sm:inline">Nouvelle</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};