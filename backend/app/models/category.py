# app/models/category.py
from app import db
from datetime import datetime

class Category(db.Model):
    """
    The Category model demonstrates several key Computer Science concepts:
    1. Object-Oriented Programming (OOP): This class is a blueprint for category objects
    2. Data Modeling: Converting real-world categories into database structures
    3. Tree Data Structure: Using self-referential relationship to create a hierarchy
    """
    
    __tablename__ = 'category'  # Explicit table naming - database convention
    
    # Primary Key: Unique identifier for each category
    # CS Concept: Database Index & Unique Constraints
    id = db.Column(db.Integer, primary_key=True)
    
    # Basic attribute of a category
    name = db.Column(db.String(100), nullable=False)
    
    # Self-referential Foreign Key - This is what creates the tree structure
    # CS Concept: Tree Data Structure Implementation in Relational Database
    parent_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    
    # Timestamps for tracking record lifecycle
    # CS Concept: Data Lifecycle Management
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship definition - This creates the parent-child connection
    # CS Concept: Graph Theory - Nodes and Edges
    children = db.relationship(
        'Category',  # Points to the same model (self-referential)
        backref=db.backref('parent', remote_side=[id]),  # Creates bidirectional relationship
        cascade='all, delete-orphan'  # Handles deletion of child records
    )
    
    # One-to-Many relationship with Notes
    # CS Concept: Data Relationships
    notes = db.relationship('Note', backref='category', lazy=True)

    def to_dict(self):
        """
        Serialization method - converts object to dictionary
        CS Concept: Data Serialization & API Design
        """
        return {
            'id': self.id,
            'name': self.name,
            'parent_id': self.parent_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }