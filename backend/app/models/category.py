# backend/app/models/category.py
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Category(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    children = db.relationship('Category')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.Column, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with notes
    notes = db.relationship('Note', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'parent_id': self.parent_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }