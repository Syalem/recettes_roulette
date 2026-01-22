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
              <option value="lundi">Lundi</option>
              <option value="mardi">Mardi</option>
              <option value="mercredi">Mercredi</option>
              <option value="jeudi">Jeudi</option>
              <option value="vendredi">Vendredi</option>
              <option value="samedi">Samedi</option>
              <option value="dimanche">Dimanche</option>
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
      const planning = JSON.parse(localStorage.getItem('planning') || '{}');
      
      // Initialiser le tableau si le repas n'existe pas
      if (!planning[mealType]) {
        planning[mealType] = [];
      }
      
      // Créer l'objet recette à ajouter
      const recetteToAdd = {
        id: this.currentRecette.id,
        titre: this.currentRecette.titre,
        duree_prep: this.currentRecette.duree_prep,
        ingredients: this.currentRecette.ingredients,
        categorie: this.currentRecette.categorie,
        sous_categorie: this.currentRecette.sous_categorie || '',
        lien: this.currentRecette.lien || '',
        livre: this.currentRecette.livre || '',
        page: this.currentRecette.page || '',
        notes: this.currentRecette.notes || '',
        tags: this.currentRecette.tags || [],
        date_ajoutee: new Date().toISOString()
      };
      
      // Vérifier si la recette n'existe pas déjà pour ce repas
      const exists = planning[mealType].some(r => r.id === this.currentRecette.id);
      if (exists) {
        alert('Cette recette est déjà présente dans ce jour');
        return;
      }
      
      // Ajouter la recette au planning
      planning[mealType].push(recetteToAdd);
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('planning', JSON.stringify(planning));
      
      // Message de confirmation
      const mealTypeLabel = {
        'lundi': 'Lundi',
        'mardi': 'Mardi',
        'mercredi': 'Mercredi',
        'jeudi': 'Jeudi',
        'vendredi': 'Vendredi',
        'samedi': 'Samedi',
        'dimanche': 'Dimanche'
      };
      
      alert(`✅ "${this.currentRecette.titre}" a été ajoutée à ${mealTypeLabel[mealType] || mealType} !`);
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
          <span>⏱️ ${recette.duree_prep} min</span>
          ${recette.livre ?
            (recette.page != null && recette.page !== '' ?
              `<span>📖 ${recette.livre} page ${recette.page}</span>` :
              `<span>📖 ${recette.livre}</span>`
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
                class="w-auto bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
          📅 Ajouter au planning
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
          this.onDelete(this.currentRecette);
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