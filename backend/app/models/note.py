# backend/app/models/note.py
from app import db
from datetime import datetime
from sqlalchemy import Index

class Note(db.Model):
    """
    The Note model demonstrates:
    1. Foreign Key Relationships: Connecting related data
    2. Data Type Choices: Using appropriate types for different kinds of data
    3. Metadata Management: Tracking creation and updates
    """
    
    __tablename__ = 'note'
    
    # Database Columns - each represents a piece of data about our note
    # CS Concept: Data Types and Storage
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)  # Fixed-length string
    content = db.Column(db.Text)  # Variable-length text
    
    # Foreign Key - Creates a connection to the Category model
    # CS Concept: Referential Integrity
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    
    # Array-like data stored as comma-separated string
    # CS Concept: Data Structure Transformation (Array ↔ String)
    tags = db.Column(db.String(200))
    
    # Automatic timestamps
    # CS Concept: System-managed Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Add indexes for search optimization
    # CS Concept: Database indexing
    __table_args__ = (
        Index('idx_note_title', 'title'),   # Index for title searches
        Index('idx_note_tags', 'tags'),     # Index for tag searches
    )

    def to_dict(self):
        """
        Converts note object to dictionary format
        CS Concept: Data Transformation & API Response Formatting
        """
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category_id': self.category_id,
            # Transform comma-separated string back to array
            'tags': self.tags.split(',') if self.tags else [],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }