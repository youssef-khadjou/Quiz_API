from flask import jsonify, abort, request
from .app import app, db
from .models import Questionnaire, Question


# Route pour la table Questionnaire

@app.route('/questionnaires', methods = ['GET'])
def get_all_questionnaires():
    all_questionnaires = Questionnaire.query.all()
    if not all_questionnaires:
        abort(404)
    return jsonify([questionnaire.to_json() for questionnaire in all_questionnaires])

@app.route('/questionnaires/<int:questionnaire_id>', methods = ['GET'])
def get_one_questionnaire(questionnaire_id):
    one_questionnaire = Questionnaire.query.get(questionnaire_id)
    if one_questionnaire is None: 
        abort(404) 
    return jsonify(one_questionnaire.to_json())

@app.route('/questionnaires', methods = ['DELETE'])
def remove_all_questionnaire():
    all_questionnaires = Questionnaire.query.all()
    if not all_questionnaires:
        abort(404)
    for questionnaire in all_questionnaires:
        db.session.delete(questionnaire)
    db.session.commit()
    return jsonify({'message': 'Touts les questionnaires ont été supprimé avec succés'})

@app.route('/questionnaires/<int:questionnaire_id>', methods = ['DELETE'])
def remove_one_questionnaire(questionnaire_id):
    one_questionnaire = Questionnaire.query.get(questionnaire_id)
    if one_questionnaire is None:
        abort(404)
    db.session.delete(one_questionnaire)
    db.session.commit()
    return jsonify({'message': f'Le questionnaire avec le ID {questionnaire_id} a été supprimé avec succés'})

@app.route('/questionnaires', methods = ['POST'])
def add_questionnaire():
    if request.json is None or 'name' not in request.json or 'url' not in request.json:
        abort(400)
    new_questionnaire = Questionnaire(name = request.json['name'], url = request.json['url'])
    db.session.add(new_questionnaire)
    db.session.commit()
    return jsonify(new_questionnaire.to_json()), 201

@app.route('/questionnaires/<int:questionnaire_id>', methods = ['PUT'])
def update_questionnaire(questionnaire_id):
    one_questionnaire = Questionnaire.query.get(questionnaire_id)
    if one_questionnaire is None: 
        abort(404)
    if 'name' in request.json: 
        if type(request.json['name']) != str: 
            abort(400)
        one_questionnaire.name = request.json['name']
    if 'url' in request.json:
        if type(request.json['url']) != str:
            abort(400)
        one_questionnaire.url = request.json['url']
    db.session.commit()
    return jsonify(one_questionnaire.to_json())  

    
# Route pour la table Question

@app.route('/questionnaires/<int:questionnaire_id>/questions', methods = ['GET'])
def get_all_questions(questionnaire_id):
    all_questions = Question.query.filter_by(questionnaire_id=questionnaire_id).all()
    if not all_questions: 
        abort(404)
    return jsonify([question.to_json() for question in all_questions])

@app.route('/questionnaires/<int:questionnaire_id>/questions/<int:question_id>', methods = ['GET'])
def get_one_question(questionnaire_id, question_id):
    one_question = Question.query.filter_by(id=question_id, questionnaire_id=questionnaire_id).first()
    if one_question is None: 
        abort(404)
    return jsonify(one_question.to_json())

@app.route('/questionnaires/<int:questionnaire_id>/questions', methods = ['DELETE'])
def remove_all_questions(questionnaire_id):
    all_questions = Question.query.filter_by(questionnaire_id=questionnaire_id).all()
    if not all_questions:
        abort(404)
    for question in all_questions:
        db.session.delete(question)
    db.session.commit()
    return jsonify({'message': 'Toutes les questions ont été supprimé avec succés'})

@app.route('/questionnaires/<int:questionnaire_id>/questions/<int:question_id>', methods = ['DELETE'])
def remove_one_question(questionnaire_id, question_id):
    one_question = Question.query.filter_by(id=question_id, questionnaire_id=questionnaire_id).first()
    if one_question is None:
        abort(404)
    db.session.delete(one_question)
    db.session.commit()
    return jsonify({'message': f'La question avec le ID {question_id} à été supprimé avec succés'})

@app.route('/questionnaires/<int:questionnaire_id>/questions', methods=['POST'])
def add_question(questionnaire_id):
    if request.json is None or 'title' not in request.json or 'questionType' not in request.json or 'url' not in request.json: 
        abort(400)
    if not Questionnaire.query.get(questionnaire_id):
        abort(400)
    new_question = Question(title=request.json['title'], questionType=request.json['questionType'], questionnaire_id=questionnaire_id, url=request.json['url'])
    db.session.add(new_question)
    db.session.commit()
    return jsonify(new_question.to_json()), 201

@app.route('/questionnaires/<int:questionnaire_id>/questions/<int:question_id>', methods = ['PUT'])
def update_question(questionnaire_id, question_id):
    one_question = Question.query.filter_by(id=question_id, questionnaire_id=questionnaire_id).first()
    if one_question is None: 
        abort(404)
    if 'title' in request.json: 
        if type(request.json['title']) != str:
            abort(400)
        one_question.title = request.json['title']
    if 'questionType' in request.json: 
        if type(request.json['questionType']) != str: 
            abort(400)
        one_question.questionType = request.json['questionType']
    if 'url' in request.json:
        if type(request.json['url']) != str:
            abort(400)
        one_question.url = request.json['url']
    db.session.commit()
    return jsonify(one_question.to_json())