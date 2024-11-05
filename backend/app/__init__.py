# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from app.config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    # Import routes to avoid circular imports 
    from app.routes import notes, categories
    app.register_blueprint(notes.bp)
    app.register_blueprint(categories.bp)

    return app