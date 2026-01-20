import subprocess
import json
from datetime import datetime
from pathlib import Path
import os
import sys

# Forcer UTF-8 pour la sortie (nécessaire sur Windows)
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def sync_recettes():
    """Synchroniser les recettes avec GitHub."""
    
    # Vérifier si le fichier existe
    recettes_path = Path("data/recettes.json")
    if not recettes_path.exists():
        print("Fichier de recettes introuvable")
        return
    
    # Lire le nombre de recettes
    with open(recettes_path, encoding='utf-8') as f:
        data = json.load(f)
        nb_recettes = len(data.get("recettes", []))
    
    # Configurer l'identité Git
    subprocess.run(["git", "config", "user.email", "bot@recette-roulette.app"])
    subprocess.run(["git", "config", "user.name", "Recette Roulette Bot"])
    
    # Configurer le remote avec le token (pour Render)
    github_repo_url = os.getenv("GITHUB_REPO_URL")
    if github_repo_url:
        subprocess.run(["git", "remote", "remove", "origin"], stderr=subprocess.DEVNULL)
        subprocess.run(["git", "remote", "add", "origin", github_repo_url])
        print(f"Remote configuré: {github_repo_url.split('@')[1] if '@' in github_repo_url else github_repo_url}")
    
    # Gérer le detached HEAD (Render)
    result = subprocess.run(
        ["git", "symbolic-ref", "-q", "HEAD"],
        capture_output=True
    )
    
    if result.returncode != 0:
        # On est en detached HEAD
        print("Detached HEAD détecté (Render)")
        
        # Récupérer le SHA actuel
        result = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            capture_output=True,
            text=True
        )
        current_sha = result.stdout.strip()
        
        # Forcer la branche main sur le commit actuel
        subprocess.run(["git", "branch", "-f", "main", current_sha])
        
        # Basculer sur main
        subprocess.run(["git", "checkout", "main"])
        print(f"Basculé sur la branche main ({current_sha[:8]})")
    else:
        print("Déjà sur une branche")
    
    # Vérifier s'il y a des changements
    result = subprocess.run(
        ["git", "status", "--porcelain", "data/recettes.json"],
        capture_output=True,
        text=True
    )
    
    if not result.stdout.strip():
        print("Aucun changement à synchroniser")
        return
    
    # Add, commit, push
    try:
        subprocess.run(["git", "add", "data/recettes.json"], check=True)
        
        commit_msg = f"Sync recettes - {nb_recettes} recettes - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        subprocess.run(["git", "commit", "-m", commit_msg], check=True)
        
        # Pull avec rebase avant le push
        subprocess.run(["git", "pull", "--rebase", "origin", "main"], stderr=subprocess.DEVNULL)
        
        # Push (avec force si nécessaire)
        result = subprocess.run(["git", "push", "origin", "main"], capture_output=True)
        
        if result.returncode != 0:
            # Si échec, forcer le push
            print("Push normal échoué, tentative avec force...")
            subprocess.run(["git", "push", "--force", "origin", "main"], check=True)
        
        print(f"✅ Synchronisation réussie - {nb_recettes} recettes")
    except subprocess.CalledProcessError as e:
        print(f"Erreur : {e}")

if __name__ == "__main__":
    sync_recettes()