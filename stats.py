from app.core.storage import RecetteStorage

storage = RecetteStorage()
recettes = storage.obtenir_toutes()

print(f"Tu as {len(recettes)} recettes")
for r in recettes:
    print(f"- {r['titre']} ({r['categorie']})")