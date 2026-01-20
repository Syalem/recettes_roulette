// Module d'export PDF pour le planificateur de repas
// À placer dans: static/js/pdfExporter.js

window.exporterPlanningPDF = function(planSemaine, JOURS, MOMENTS) {
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Générer la liste consolidée des ingrédients
    const ingredientsMap = {};
    Object.values(planSemaine).forEach(repas => {
        if (repas.recette.ingredients) {
            repas.recette.ingredients.forEach(ing => {
                const parts = ing.split(' - ');
                const nom = parts[0].trim();
                const quantite = parts[1] || '';
                
                if (ingredientsMap[nom]) {
                    ingredientsMap[nom].occurrences++;
                    if (quantite) {
                        ingredientsMap[nom].quantites.push(quantite);
                    }
                } else {
                    ingredientsMap[nom] = {
                        nom: nom,
                        occurrences: 1,
                        quantites: quantite ? [quantite] : []
                    };
                }
            });
        }
    });
    
    const listeIngredients = Object.values(ingredientsMap).sort((a, b) => 
        a.nom.localeCompare(b.nom, 'fr')
    );
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Planning de la semaine</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                }
                h1 { 
                    color: #EA580C; 
                    border-bottom: 3px solid #EA580C; 
                    padding-bottom: 10px; 
                }
                h2 { 
                    color: #EA580C; 
                    margin-top: 30px; 
                }
                .jour { 
                    margin-bottom: 20px; 
                    page-break-inside: avoid; 
                }
                .jour h2 { 
                    background: #EA580C; 
                    color: white; 
                    padding: 10px; 
                    margin: 0; 
                }
                .repas { 
                    padding: 10px; 
                    border: 1px solid #ddd; 
                    margin: 5px 0; 
                }
                .moment { 
                    font-weight: bold; 
                    color: #666; 
                }
                .fait { 
                    text-decoration: line-through; 
                    color: #999; 
                }
                .titre { 
                    font-size: 16px; 
                    margin: 5px 0; 
                }
                .duree { 
                    color: #666; 
                    font-size: 14px; 
                }
                .ingredients { 
                    margin-top: 8px; 
                    padding-top: 8px; 
                    border-top: 1px dashed #ddd; 
                }
                .ingredients strong { 
                    color: #EA580C; 
                    font-size: 13px; 
                }
                .ingredients ul { 
                    margin: 5px 0; 
                    padding-left: 20px; 
                    font-size: 13px; 
                    color: #555; 
                }
                .ingredients li { 
                    margin: 2px 0; 
                }
                .liste-courses { 
                    display: none; 
                    background: #f9f9f9; 
                    border: 2px solid #EA580C; 
                    border-radius: 10px; 
                    padding: 20px; 
                    margin: 20px 0; 
                    page-break-before: always; 
                }
                .liste-courses.visible { 
                    display: block; 
                }
                .liste-courses ul { 
                    columns: 2; 
                    column-gap: 30px; 
                    list-style: none; 
                    padding: 0; 
                }
                .liste-courses li { 
                    margin: 8px 0; 
                    padding: 8px; 
                    background: white; 
                    border-radius: 5px; 
                    border-left: 3px solid #EA580C; 
                    break-inside: avoid; 
                }
                .liste-courses .quantite { 
                    color: #666; 
                    font-size: 13px; 
                    margin-left: 5px; 
                }
                @media print {
                    .no-print { 
                        display: none; 
                    }
                    .liste-courses { 
                        display: block; 
                    }
                }
            </style>
        </head>
        <body>
            <h1>🍽️ Planning de la semaine</h1>
    `;

    // Générer le planning jour par jour
    JOURS.forEach(jour => {
        html += `<div class="jour"><h2>${jour}</h2>`;
        
        MOMENTS.forEach(moment => {
            const key = `${jour}-${moment}`;
            const repas = planSemaine[key];
            
            html += `<div class="repas">`;
            html += `<div class="moment">${moment}</div>`;
            
            if (repas) {
                const classes = repas.fait ? 'titre fait' : 'titre';
                html += `<div class="${classes}">${repas.recette.titre}</div>`;
                if (repas.recette.duree_prep) {
                    html += `<div class="duree">⏱️ ${repas.recette.duree_prep} min</div>`;
                }
                
                // Afficher les ingrédients
                if (repas.recette.ingredients && repas.recette.ingredients.length > 0) {
                    html += `<div class="ingredients">`;
                    html += `<strong>Ingrédients :</strong>`;
                    html += `<ul>`;
                    repas.recette.ingredients.forEach(ing => {
                        html += `<li>${ing}</li>`;
                    });
                    html += `</ul>`;
                    html += `</div>`;
                }
            } else {
                html += `<div style="color: #ccc; font-style: italic;">Aucun repas prévu</div>`;
            }
            
            html += `</div>`;
        });
        
        html += `</div>`;
    });

    // Ajouter la liste de courses consolidée
    html += `
        <div id="liste-courses" class="liste-courses">
            <h2>🛒 Liste de courses consolidée</h2>
            <p style="color: #666; margin-bottom: 15px;">Tous les ingrédients nécessaires pour la semaine :</p>
            <ul>
    `;
    
    listeIngredients.forEach(item => {
        html += `<li>`;
        html += `<strong>${item.nom}</strong>`;
        if (item.quantites.length > 0) {
            html += `<span class="quantite">(${item.quantites.join(', ')})</span>`;
        }
        if (item.occurrences > 1) {
            html += ` <span style="color: #EA580C; font-size: 12px;">×${item.occurrences}</span>`;
        }
        html += `</li>`;
    });
    
    html += `
            </ul>
        </div>
    `;

    // Ajouter les boutons de contrôle
    html += `
        <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button id="btn-toggle" onclick="toggleListeCourses()" style="background: #10B981; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-right: 10px;">
                📋 Afficher la liste de courses
            </button>
            <button onclick="envoyerVersBring()" style="background: #F59E0B; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-right: 10px;">
                🛒 Envoyer à Bring!
            </button>
            <button onclick="telechargerListeCourses()" style="background: #3B82F6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-right: 10px;">
                💾 Télécharger liste (TXT)
            </button>
            <button onclick="window.print()" style="background: #EA580C; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                🖨️ Imprimer / Sauvegarder en PDF
            </button>
            <button onclick="window.close()" style="background: #666; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
                Fermer
            </button>
        </div>
        
        <script>
            const ingredientsData = ${JSON.stringify(listeIngredients)};
            
            function toggleListeCourses() {
                const liste = document.getElementById('liste-courses');
                const btn = document.getElementById('btn-toggle');
                liste.classList.toggle('visible');
                btn.textContent = liste.classList.contains('visible') 
                    ? '📋 Masquer la liste de courses' 
                    : '📋 Afficher la liste de courses';
            }
            
            function envoyerVersBring() {
                // Générer le texte formaté pour Bring!
                let texte = '';
                ingredientsData.forEach((item) => {
                    let ligne = item.nom;
                    if (item.quantites.length > 0) {
                        ligne += ' (' + item.quantites.join(', ') + ')';
                    }
                    if (item.occurrences > 1) {
                        ligne += ' ×' + item.occurrences;
                    }
                    texte += ligne + '\\n';
                });
                
                // Copier dans le presse-papier
                navigator.clipboard.writeText(texte).then(() => {
                    // Ouvrir Bring! dans un nouvel onglet
                    const bringUrl = 'https://web.getbring.com';
                    window.open(bringUrl, '_blank');
                    
                    alert('✅ Liste copiée dans le presse-papier !\\n\\n' +
                          '📱 Instructions :\\n' +
                          '1. Connectez-vous à Bring!\\n' +
                          '2. Cliquez sur "Ajouter des articles"\\n' +
                          '3. Collez (Ctrl+V) la liste\\n' +
                          '4. Validez !');
                }).catch(err => {
                    alert('❌ Erreur de copie. Veuillez copier manuellement la liste ci-dessous :\\n\\n' + texte);
                });
            }
            
            function telechargerListeCourses() {
                let texte = '🛒 LISTE DE COURSES\\n';
                texte += '='.repeat(50) + '\\n\\n';
                
                ingredientsData.forEach((item, index) => {
                    texte += '☐ ' + item.nom;
                    if (item.quantites.length > 0) {
                        texte += ' (' + item.quantites.join(', ') + ')';
                    }
                    if (item.occurrences > 1) {
                        texte += ' ×' + item.occurrences;
                    }
                    texte += '\\n';
                });
                
                texte += '\\n' + '='.repeat(50) + '\\n';
                texte += 'Total: ' + ingredientsData.length + ' ingrédients\\n';
                texte += 'Généré le: ' + new Date().toLocaleDateString('fr-FR') + '\\n';
                
                const blob = new Blob([texte], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'liste-courses-' + new Date().toISOString().split('T')[0] + '.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        </` + `script>
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
};