from .app import db

class Questionnaire(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    url = db.Column(db.String(100))

    def __init__(self, name, url):
        self.name = name
        self.url = url

    def __repr__(self):
        return f"<Questionnaire(id={self.id}, title={self.name}, url={self.url})>"

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
        }

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120))
    questionType = db.Column(db.String(120))
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'))
    url = db.Column(db.String(100))

    def __init__(self, title, questionType, questionnaire_id, url):
        self.title = title
        self.questionType = questionType
        self.questionnaire_id = questionnaire_id
        self.url = url

    def __repr__(self):
        return f"<Question(id={self.id}, title={self.title}, questionType={self.questionType}, url={self.url})>"

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'questionType': self.questionType,
            'questionnaire_id': self.questionnaire_id,
            'url': self.url
        }
