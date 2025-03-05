import json
from .app import app, db
from .models import Questionnaire, Question

import os

@app.cli.command()
def loaddb():
    """
    Charge des données JSON depuis un fichier dans la base de données.
    """
    fichier_json = 'datas/datas.json' 

    if not os.path.exists(fichier_json):
        print(f"Erreur : le fichier '{fichier_json}' n'existe pas.")
        return

    with open(fichier_json, 'r', encoding='utf-8') as file:
        data = json.load(file)

    db.session.query(Question).delete()
    db.session.query(Questionnaire).delete()
    
    for questionnaire_data in data:
        questionnaire = Questionnaire(name=questionnaire_data['name'], url=questionnaire_data['url'])
        db.session.add(questionnaire)
        db.session.flush()  

        for question_data in questionnaire_data['questions']:
            question = Question(
                title=question_data['title'],
                questionType=question_data['questionType'],
                questionnaire_id=questionnaire.id, 
                url=question_data['url']
            )
            db.session.add(question)

    db.session.commit()
    
    print("Données chargées avec succès.")

@app.cli.command()
def syncdb():
    """
    Création de toutes les tables de la BD
    à partir des modèles.
    """
    db.create_all()
    print("Tables créées avec succès.")
