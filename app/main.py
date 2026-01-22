from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.responses import HTMLResponse
from pathlib import Path

from app.api import recettes, filters, random


app = FastAPI(
    title="API Recettes",
    description="API pour gérer vos recettes avec filtrage et sélection aléatoire",
    version="1.0.0",
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monter les fichiers statiques (si tu en as)
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")


# Inclure les routes API
app.include_router(recettes.router, prefix="/api")
app.include_router(filters.router, prefix="/api")
app.include_router(random.router, prefix="/api")


# Route pour servir l'interface web
@app.get("/", response_class=HTMLResponse)
def serve_frontend():
    """Servir l'interface web."""
    html_path = Path("frontend/templates/index.html")
    
    if html_path.exists():
        with open(html_path, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        return """
        <html>
            <body>
                <h1>Interface non trouvée</h1>
                <p>Le fichier frontend/templates/index.html n'existe pas.</p>
                <p>API disponible sur <a href="/docs">/docs</a></p>
            </body>
        </html>
        """

@app.get("/health")
def health():
    """Endpoint de santé."""
    return {"status": "healthy"}

@app.get("/planner", response_class=HTMLResponse)
def planner():
    html_path = Path("../frontend/static/planner.html")
    return serve_frontend()
