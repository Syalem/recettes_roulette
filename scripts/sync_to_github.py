import subprocess
import json
from datetime import datetime
from pathlib import Path
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def sync_recettes():
    """Synchroniser les recettes avec GitHub."""
    
    # Vérifier si le fichier existe
    recettes_path = Path("data/recettes.json")
    if not recettes_path.exists():
        print("Fichier de recettes introuvable")
        return
    
    # Lire le nombre de recettes
    with open(recettes_path) as f:
        data = json.load(f)
        nb_recettes = len(data.get("recettes", []))
    
    # Configurer l'identité Git (nécessaire sur Render)
    try:
        subprocess.run(
            ["git", "config", "user.email", "bot@recette-roulette.app"],
            check=True
        )
        subprocess.run(
            ["git", "config", "user.name", "Recette Roulette Bot"],
            check=True
        )
        
        # Vérifier si le remote origin existe, sinon l'ajouter
        result = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            # Récupérer l'URL du repo depuis les variables d'environnement
            import os
            repo_url = os.getenv("GITHUB_REPO_URL")
            if repo_url:
                subprocess.run(
                    ["git", "remote", "add", "origin", repo_url],
                    check=True
                )
                print(f"Remote origin configuré: {repo_url}")
            else:
                print("ERREUR: Variable GITHUB_REPO_URL non définie")
                return
    except subprocess.CalledProcessError as e:
        print(f"Erreur de configuration Git : {e}")
        return
    
    # Git add, commit, push
    try:
        subprocess.run(["git", "add", "data/recettes.json"], check=True)
        
        commit_msg = f"Sync recettes - {nb_recettes} recettes - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        subprocess.run(["git", "commit", "-m", commit_msg], check=True)
        
        subprocess.run(["git", "push", "-u", "origin", "main"], check=True)
        
        print(f"Synchronisation réussie - {nb_recettes} recettes")
    except subprocess.CalledProcessError as e:
        print(f"Aucun changement ou erreur : {e}")

if __name__ == "__main__":
    sync_recettes()