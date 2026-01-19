import subprocess
import json
from datetime import datetime
from pathlib import Path
import sys
import io
import os

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

    # Vérifier si on est sur la branche main, sinon basculer
    try:
        result = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True,
            text=True,
            check=True
        )
        current_branch = result.stdout.strip()
        if current_branch != "main":
            subprocess.run(["git", "checkout", "main"], check=True)
            print("Basculé sur la branche main")
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors du basculement sur main : {e}")
        return

    # Vérifier s'il y a des changements dans recettes.json spécifiquement
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain", "data/recettes.json"],
            capture_output=True,
            text=True,
            check=True
        )
        if not result.stdout.strip():
            print("Aucun changement dans recettes.json")
            return
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de la vérification des changements : {e}")
        return

    # Git add, commit, push
    try:
        subprocess.run(["git", "add", "data/recettes.json"], check=True)

        commit_msg = f"Sync recettes - {nb_recettes} recettes - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        subprocess.run(["git", "commit", "-m", commit_msg], check=True)

        subprocess.run(["git", "push", "origin", "main"], check=True)

        print(f"✅ Synchronisation réussie - {nb_recettes} recettes")
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de la synchronisation : {e}")

if __name__ == "__main__":
    sync_recettes()