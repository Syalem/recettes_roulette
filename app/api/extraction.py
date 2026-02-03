"""
API endpoint for recipe extraction using web scraping (no API needed)
"""
from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import JSONResponse
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import json

# Crée un router FastAPI
router = APIRouter(prefix="/extraction", tags=["extraction"])

def extract_from_instagram(url: str):
    """
    Extract recipe from Instagram post
    Instagram blocks direct scraping, so we'll use a fallback method
    """
    try:
        # Instagram nécessite une connexion, donc on retourne un message d'erreur
        return None, "Instagram nécessite une connexion. Veuillez copier-coller manuellement les ingrédients."
    except Exception as e:
        return None, str(e)

def extract_from_blog(url: str):
    """
    Extract recipe from a blog/website
    Uses common patterns to find ingredients
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Get recipe title
        title = None
        title_tags = ['h1', 'h2']
        for tag in title_tags:
            title_elem = soup.find(tag)
            if title_elem:
                title = title_elem.get_text().strip()
                break

        # Try to find ingredients section
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
                if text and len(text) > 2 and len(text) < 200:
                    ingredients.append(text)

        # Strategy 2: Look for common recipe schemas (JSON-LD)
        if not ingredients:
            scripts = soup.find_all('script', type='application/ld+json')
            for script in scripts:
                try:
                    data = json.loads(script.string)
                    if isinstance(data, dict):
                        if data.get('@type') == 'Recipe':
                            if 'recipeIngredient' in data:
                                ingredients = data['recipeIngredient']
                            if not title and 'name' in data:
                                title = data['name']
                except:
                    continue

        # Strategy 3: Look for lists with ingredient-like content
        if not ingredients:
            all_lists = soup.find_all(['ul', 'ol'])
            for ul in all_lists:
                items = ul.find_all('li')
                potential_ingredients = []
                for item in items:
                    text = item.get_text().strip()
                    # Check if it looks like an ingredient
                    if any(word in text.lower() for word in ['g', 'ml', 'cl', 'cuillère', 'tasse', 'kg', 'l']):
                        potential_ingredients.append(text)

                # If more than half the items look like ingredients, use this list
                if len(potential_ingredients) > len(items) / 2 and len(potential_ingredients) > 2:
                    ingredients = potential_ingredients
                    break

        if not ingredients:
            return None, "Aucun ingrédient trouvé sur cette page"

        # Clean up ingredients
        ingredients = [ing.strip() for ing in ingredients if ing.strip()]
        ingredients = list(dict.fromkeys(ingredients))  # Remove duplicates

        if not title:
            title = "Recette extraite"

        return {
            'name': title,
            'ingredients': ingredients[:30],  # Limit to 30 ingredients
            'source': 'blog'
        }, None

    except requests.RequestException as e:
        return None, f"Erreur lors de la récupération de la page: {str(e)}"
    except Exception as e:
        return None, f"Erreur lors de l'extraction: {str(e)}"

@router.post("/extract-recipe")
async def extract_recipe(request: Request):
    """
    Extract recipe information from a URL using web scraping.

    Expected JSON body:
    {
        "url": "https://blog.com/recipe"
    }

    Returns:
    {
        "success": true,
        "data": {
            "name": "Recipe name",
            "ingredients": ["ingredient 1", "ingredient 2", ...],
            "source": "blog"
        }
    }
    """
    try:
        data = await request.json()
        url = data.get('url')

        if not url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="URL manquante"
            )

        # Parse URL to determine source
        parsed = urlparse(url)
        domain = parsed.netloc.lower()

        # Check if it's Instagram
        if 'instagram.com' in domain:
            result, error = extract_from_instagram(url)
            if error:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=error
                )
        else:
            # Try to extract from blog/website
            result, error = extract_from_blog(url)
            if error:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=error
                )

        if not result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Impossible d'extraire les données de cette URL"
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                'success': True,
                'data': result
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur inattendue: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        'status': 'ok',
        'message': 'Extraction service ready (web scraping mode)'
    }