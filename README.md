## 🚀 Utilisation

**Lancer l'application :**
```bash
uvicorn app.main:app --reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

http://localhost:8000
```

**Exemples de requêtes :**
# 1. Filtrer par catégorie et durée
```bash
curl -X POST http://localhost:8000/api/filtrer/ \
  -H "Content-Type: application/json" \
  -d '{
    "categorie": "Plat principal",
    "duree_max": 30
  }'
```
# 2. Obtenir une recette aléatoire
```bash
curl -X POST http://localhost:8000/api/random/recette \
  -H "Content-Type: application/json" \
  -d '{
    "categorie": "Dessert",
    "duree_max": 45
  }'
```
# 3. Composer un menu complet
```bash
curl -X POST http://localhost:8000/api/random/menu \
  -H "Content-Type: application/json" \
  -d '{
    "duree_max_totale": 90
  }'
```
# 4. Suggestions rapides
```bash
curl http://localhost:8000/api/random/suggestions?duree_max=20&nombre=5
```
# 5. Enregistrer les recettes
```bash
cp data/recettes.json ~/Documents/recettes_backup_$(date +%Y%m%d).json
```

# 6. Structure du projet
```
recettes_app/
├── app/
│   ├── __init__.py
│   ├── main.py             
│   ├── core/
│   │   ├── __init__.py
│   │   ├── storage.py
│   │   ├── filters.py
│   │   └── random_picker.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── recette.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── recette.py
│   │   └── filters.py
│   └── api/
│       ├── __init__.py
│       ├── recettes.py
│       ├── filters.py
│       └── random.py
├── frontend/
│   ├── templates/
│   │   └── index.html
│   └── static/
├── data/
│   ├── recettes.json
│   └── backups/
├── requirements.txt
└── .env
```