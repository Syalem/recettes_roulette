// Module popup réutilisable pour afficher les détails d'une recette
// À placer dans frontend/static/js/popup-recette.js

(function(window) {
  'use strict';

  // Icônes SVG
  const ICONS = {
    X: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>`,
    ExternalLink: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                           d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                   </svg>`,
    CookingPot: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cooking-pot-icon lucide-cooking-pot">
              <path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/>
              </svg>`,
    Clock: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`,
    Book: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>`,
    Calendrier: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-days-icon lucide-calendar-days">
              <path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>
              </svg>`
  };


  // Classe pour gérer le popup
  class RecettePopup {
    constructor() {
      this.popupElement = null;
      this.currentRecette = null;
      this.onEdit = null;
      this.onDelete = null;
    }

    // Créer l'élément du popup
    createPopupElement() {
      const popup = document.createElement('div');
      popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto';
      popup.style.display = 'none';
      popup.id = 'recette-popup-overlay';

      popup.innerHTML = `
        <div class="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-8" id="recette-popup-content">
          <div class="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900" id="popup-title">Détails de la recette</h2>
            <button id="popup-close-btn" class="text-gray-400 hover:text-gray-600">
              ${ICONS.X}
            </button>
          </div>

          <div class="p-6 space-y-4" id="popup-body">
            <!-- Contenu dynamique -->
          </div>

          <div class="flex gap-3 p-6 border-t border-gray-200" id="popup-footer">
            <!-- Boutons dynamiques -->
          </div>
        </div>
      `;

      // Fermer au clic sur l'overlay
      popup.addEventListener('click', (e) => {
        if (e.target.id === 'recette-popup-overlay') {
          this.close();
        }
      });

      // Fermer au clic sur le bouton X
      const closeBtn = popup.querySelector('#popup-close-btn');
      closeBtn.addEventListener('click', () => this.close());

      document.body.appendChild(popup);
      this.popupElement = popup;
    }

    // Afficher le modal de sélection du repas
    showMealSelection() {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-2xl max-w-sm w-full">
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Sélectionner le repas</h3>
            <select id="meal-type-select" class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500">
              <option value="">-- Choisir un repas --</option>
              <option value="Lundi-Midi">Lundi midi</option>
              <option value="Lundi-Soir">Lundi soir</option>
              <option value="Mardi-Midi">Mardi midi</option>
              <option value="Mardi-Soir">Mardi soir</option>
              <option value="Mercredi-Midi">Mercredi midi</option>
              <option value="Mercredi-Soir">Mercredi soir</option>
              <option value="Jeudi-Midi">Jeudi midi</option>
              <option value="Jeudi-Soir">Jeudi soir</option>
              <option value="Vendredi-Midi">Vendredi midi</option>
              <option value="Vendredi-Soir">Vendredi soir</option>
              <option value="Samedi-Midi">Samedi midi</option>
              <option value="Samedi-Soir">Samedi soir</option>
              <option value="Dimanche-Midi">Dimanche midi</option>
              <option value="Dimanche-Soir">Dimanche soir</option>
            </select>

            <div class="flex gap-2">
              <button class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition" onclick="this.closest('.fixed').remove();">
                Annuler
              </button>
              <button id="confirm-meal-btn" class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Bouton confirmer
      const confirmBtn = document.getElementById('confirm-meal-btn');
      const selectInput = document.getElementById('meal-type-select');

      confirmBtn.addEventListener('click', () => {
        const mealType = selectInput.value;
        if (!mealType) {
          alert('Veuillez sélectionner un repas');
          return;
        }

        this.addToPlanning(mealType);
        modal.remove();
      });

      // Fermer en cliquant en dehors
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }

    // Ajouter la recette au planning
    addToPlanning(mealType) {
      // Récupérer le planning existant du localStorage
      const planning = JSON.parse(localStorage.getItem('meal-plan') || '{}');

      // Initialiser le tableau si le repas n'existe pas
      if (!planning[mealType]) {
        planning[mealType] = [];
      }

      // Créer l'objet recette à ajouter
      const recetteToAdd = {
          titre: this.currentRecette.titre,
          duree_prep: this.currentRecette.duree_prep,
          ingredients: this.currentRecette.ingredients,
          categorie: this.currentRecette.categorie,
          sous_categorie: this.currentRecette.sous_categorie || '',
          lien: this.currentRecette.lien || '',
          livre: this.currentRecette.livre || '',
          page: this.currentRecette.page || '',
          tags: this.currentRecette.tags || [],
          notes: this.currentRecette.notes || '',
          id: this.currentRecette.id,
          date_ajout: new Date().toISOString()
      }

      // Vérifier si la recette n'existe pas déjà pour ce repas
      const exists = planning[mealType].some(r => r.id === this.currentRecette.id);
      if (exists) {
        alert('Cette recette est déjà présente dans ce jour');
        return;
      }

      // Ajouter la recette au planning
      //planning[mealType].push(recetteToAdd.recette);
      const new_planning = {
        ...planning,
        [mealType]: {
          recette: recetteToAdd
        }
      };
      // Sauvegarder dans le localStorage
      localStorage.setItem('meal-plan', JSON.stringify(new_planning));

      // Message de confirmation
      const mealTypeLabel = {
      'Lundi-Midi': 'Lundi midi',
      'Lundi-Soir': 'Lundi soir',
      'Mardi-Midi': 'Mardi midi',
      'Mardi-Soir': 'Mardi soir',
      'Mercredi-Midi': 'Mercredi midi',
      'Mercredi-Soir': 'Mercredi soir',
      'Jeudi-Midi': 'Jeudi midi',
      'Jeudi-Soir': 'Jeudi soir',
      'Vendredi-Midi': 'Vendredi midi',
      'Vendredi-Soir': 'Vendredi soir',
      'Samedi-Midi': 'Samedi midi',
      'Samedi-Soir': 'Samedi soir',
      'Dimanche-Midi': 'Dimanche midi',
      'Dimanche-Soir': 'Dimanche soir'
      };
    }

    // Formater les ingrédients
    formatIngredient(ing) {
      if (!ing) return { name: '', quantity: '' };

      if (typeof ing === 'string') {
        const parts = ing.split(' - ');
        return {
          name: parts[0] || '',
          quantity: parts[1] || ''
        };
      }

      return {
        name: ing.ingredient || '',
        quantity: ing.quantity || ''
      };
    }

    // Afficher une recette
    show(recette, options = {}) {
      if (!this.popupElement) {
        this.createPopupElement();
      }

      this.currentRecette = recette;
      this.onEdit = options.onEdit || null;
      this.onDelete = options.onDelete || null;

      // Remplir le contenu
      const body = this.popupElement.querySelector('#popup-body');
      body.innerHTML = `
        <h3 class="text-xl font-bold">${recette.titre}</h3>

        <div class="flex items-center gap-4 text-sm text-gray-600">
          <span class="inline-flex items-center gap-1">
            ${ICONS.Clock}
            ${recette.duree_prep} min
          </span>

          <span class="inline-flex items-center gap-1">
            ${ICONS.CookingPot}
            ${recette.duree_cuisson} min
          </span>

          ${recette.livre ?
            (recette.page != null && recette.page !== '' ?
              `<span class="inline-flex items-center gap-1">${ICONS.Book} ${recette.livre} page ${recette.page}</span>` :
              `<span class="inline-flex items-center gap-1">${ICONS.Book} ${recette.livre}</span>`
            ) :
            ''
          }
        </div>

        <div class="flex flex-wrap gap-2">
          ${recette.categorie ? `
            <span class="inline-block bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full">
              ${recette.categorie}
            </span>
          ` : ''}
          ${recette.sous_categorie ? `
            <span class="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
              ${recette.sous_categorie}
            </span>
          ` : ''}
        </div>

        ${recette.lien ? `
          <div>
            <a href="${recette.lien}"
               target="_blank"
               rel="noopener noreferrer"
               class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              ${ICONS.ExternalLink}
              <span>Recette complète</span>
            </a>
          </div>
        ` : ''}

        <div>
          <p class="font-medium mb-2">Ingrédients:</p>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1">
            ${(recette.ingredients || []).map(ing => {
              const { name, quantity } = this.formatIngredient(ing);
              return `<li>${name}${quantity ? ` - ${quantity}` : ''}</li>`;
            }).join('')}
          </ul>
        </div>

        ${recette.tags && recette.tags.length > 0 ? `
          <div>
            <p class="font-medium mb-2">Tags:</p>
            <div class="flex flex-wrap gap-1">
              ${recette.tags.map(tag => `
                <span class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  #${tag}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${recette.notes ? `
          <div>
            <p class="font-medium mb-2">Notes:</p>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">${recette.notes}</p>
          </div>
        ` : ''}
      `;

      // Remplir le footer avec les boutons
      const footer = this.popupElement.querySelector('#popup-footer');
      const buttons = [];

      if (this.onEdit) {
        buttons.push(`
          <button id="popup-edit-btn"
                  class="px-4 py-2 mr-auto border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Éditer
          </button>
        `);
      }

      // Bouton "Ajouter au planning" (toujours visible)
        buttons.push(`
          <button id="popup-add-to-planning-btn"
                  class="w-auto bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition inline-flex items-center gap-1">
            ${ICONS.Calendrier} Ajouter au planning
          </button>
        `);

      if (this.onDelete) {
        buttons.push(`
          <button id="popup-delete-btn"
                  class="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            Supprimer
          </button>
        `);
      }

      footer.innerHTML = buttons.join('');

      // Ajouter les event listeners
      footer.querySelector('#popup-add-to-planning-btn')?.addEventListener('click', () => {
        this.showMealSelection();
      });

      if (this.onEdit) {
        footer.querySelector('#popup-edit-btn')?.addEventListener('click', () => {
          this.onEdit(this.currentRecette);
          this.close();
        });
      }

      if (this.onDelete) {
        footer.querySelector('#popup-delete-btn')?.addEventListener('click', () => {
          this.onDelete(this.currentRecette.id);
          this.close();
        });
      }

      // Afficher le popup
      this.popupElement.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    // Fermer le popup
    close() {
      if (this.popupElement) {
        this.popupElement.style.display = 'none';
        document.body.style.overflow = '';
        this.currentRecette = null;
      }
    }

    // Détruire le popup
    destroy() {
      if (this.popupElement) {
        this.popupElement.remove();
        this.popupElement = null;
      }
      this.currentRecette = null;
      this.onEdit = null;
      this.onDelete = null;
    }
  }

  // Instance globale
  window.RecettePopup = RecettePopup;

  // Helper pour créer une instance facilement
  window.createRecettePopup = function() {
    return new RecettePopup();
  };

})(window);