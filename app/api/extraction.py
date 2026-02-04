"""
API endpoint for recipe extraction using web scraping (no API needed)
"""
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import json
import urllib3

# Désactiver les avertissements SSL
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Crée un router FastAPI (sans prefix car ajouté dans main.py)
router = APIRouter(tags=["extraction"])

def extract_from_instagram(url: str):
    """Extract recipe from Instagram post"""
    return None, "Instagram nécessite une connexion. Veuillez copier-coller manuellement les ingrédients."

def extract_from_blog(url: str):
    """Extract recipe from a blog/website"""
    try:
        # Headers plus complets pour éviter d'être bloqué
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0'
        }
        # Désactiver la vérification SSL pour éviter les erreurs de certificat
        response = requests.get(url, headers=headers, timeout=10, verify=False)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Get recipe title
        title = None
        for tag in ['h1', 'h2']:
            title_elem = soup.find(tag)
            if title_elem:
                title = title_elem.get_text().strip()
                break

        ingredients = []

        # Strategy 1: Look for lists with "ingredient" in class/id
        ingredient_containers = soup.find_all(['ul', 'ol', 'div'],
            class_=re.compile(r'ingredient', re.I))
        ingredient_containers += soup.find_all(['ul', 'ol', 'div'],
            id=re.compile(r'ingredient', re.I))

        for container in ingredient_containers:
            items = container.find_all('li')
            for item in items:
                text = item.get_text().strip()
                if text and 2 < len(text) < 200:
                    ingredients.append(text)

        # Strategy 2: Look for JSON-LD schema
        if not ingredients:
            scripts = soup.find_all('script', type='application/ld+json')
            for script in scripts:
                try:
                    data = json.loads(script.string)
                    if isinstance(data, dict) and data.get('@type') == 'Recipe':
                        if 'recipeIngredient' in data:
                            ingredients = data['recipeIngredient']
                        if not title and 'name' in data:
                            title = data['name']
                except:
                    continue

        # Strategy 3: Look for lists with quantities
        if not ingredients:
            all_lists = soup.find_all(['ul', 'ol'])
            for ul in all_lists:
                items = ul.find_all('li')
                potential_ingredients = []
                for item in items:
                    text = item.get_text().strip()
                    if any(word in text.lower() for word in ['g', 'ml', 'cl', 'cuillère', 'tasse', 'kg', 'l']):
                        potential_ingredients.append(text)
                
                if len(potential_ingredients) > len(items) / 2 and len(potential_ingredients) > 2:
                    ingredients = potential_ingredients
                    break

        if not ingredients:
            return None, "Aucun ingrédient trouvé sur cette page"

        # Clean up
        ingredients = [ing.strip() for ing in ingredients if ing.strip()]
        ingredients = list(dict.fromkeys(ingredients))[:30]

        return {
            'name': title or "Recette extraite",
            'ingredients': ingredients,
            'source': 'blog'
        }, None

    except requests.RequestException as e:
        return None, f"Erreur lors de la récupération de la page: {str(e)}"
    except Exception as e:
        return None, f"Erreur lors de l'extraction: {str(e)}"


@router.post("/extract-recipe")
async def extract_recipe(request: Request):
    """Extract recipe from URL"""
    try:
        data = await request.json()
        url = data.get('url')

        if not url:
            return JSONResponse(
                status_code=400,
                content={'success': False, 'error': 'URL manquante'}
            )

        # Determine source
        parsed = urlparse(url)
        domain = parsed.netloc.lower()

        # Extract based on source
        if 'instagram.com' in domain:
            result, error = extract_from_instagram(url)
        else:
            result, error = extract_from_blog(url)

        if error:
            return JSONResponse(
                status_code=400,
                content={'success': False, 'error': error}
            )

        if not result:
            return JSONResponse(
                status_code=400,
                content={'success': False, 'error': "Impossible d'extraire les données"}
            )

        return JSONResponse(
            status_code=200,
            content={'success': True, 'data': result}
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': f'Erreur: {str(e)}'}
        )


@router.get("/health")
async def health_check():
    """Health check"""
    return {'status': 'ok', 'message': 'Extraction service ready (web scraping mode)'}