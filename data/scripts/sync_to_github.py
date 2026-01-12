import subprocess
import json
from datetime import datetime
from pathlib import Path

def sync_recettes():
    """Synchroniser les recettes avec GitHub."""
    
    # Vérifier si le fichier existe
    recettes_path = Path("data/recettes.json")
    if not recettes_path.exists():
        print("❌ Fichier de recettes introuvable")
        return
    
    # Lire le nombre de recettes
    with open(recettes_path) as f:
        data = json.load(f)
        nb_recettes = len(data.get("recettes", []))
    
    # Git add, commit, push
    try:
        subprocess.run(["git", "add", "data/recettes.json"], check=True)
        
        commit_msg = f"Sync recettes - {nb_recettes} recettes - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        subprocess.run(["git", "commit", "-m", commit_msg], check=True)
        
        subprocess.run(["git", "push"], check=True)
        
        print(f"✅ Synchronisation réussie - {nb_recettes} recettes")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Aucun changement ou erreur : {e}")

if __name__ == "__main__":
    sync_recettes()