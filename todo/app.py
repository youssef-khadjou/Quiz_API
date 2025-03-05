from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = ('sqlite:///quizz.db')
app.config['SQLALCHEMY_ECHO'] = True

cors = CORS(app, resources ={r"/*":{"origins":"*"}})

db = SQLAlchemy(app)
