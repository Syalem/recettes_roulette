window.recettesAPI = {
  async getAll() {
    try {
      const response = await fetch(`${window.API_URL}/recettes`);
      return response.json();
    } catch (error) {
      console.error('Erreur getAll:', error);
      return window.DEMO_RECIPES || [];
    }
  },

  async create(data) {
    try {
      const response = await fetch(`${window.API_URL}/recettes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.ok ? response.json() : null;
    } catch (error) {
      console.error('Erreur create:', error);
      return null;
    }
  },

  async update(id, data) {
    try {
      const response = await fetch(`${window.API_URL}/recettes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.ok ? response.json() : null;
    } catch (error) {
      console.error('Erreur update:', error);
      return null;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${window.API_URL}/recettes/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur delete:', error);
      return false;
    }
  },

  async getCategories() {
    try {
      const response = await fetch(`${window.API_URL}/recettes/categories/liste`);
      return response.json();
    } catch (error) {
      console.error('Erreur getCategories:', error);
      return window.DEMO_CATEGORIES || [];
    }
  },

  async getRandomRecette(params = {}) {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
      const response = await fetch(`${window.API_URL}/random/recette/simple?${searchParams}`);
      return response.ok ? response.json() : null;
    } catch (error) {
      console.error('Erreur getRandomRecette:', error);
      return null;
    }
  },

  async syncGitHub() {
    try {
      const response = await fetch(`${window.API_URL}/recettes/sync`, {
        method: 'POST'
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur syncGitHub:', error);
      return false;
    }
  }
};