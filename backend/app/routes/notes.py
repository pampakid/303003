# backend/app/routes/notes.py
from flask import Blueprint, jsonify, request
from app.models.note import Note
from app import db

# Blueprint: Flask's way of modularizing routes
# CS Concept: Modular Design Pattern
bp = Blueprint('notes', __name__, url_prefix='/api/notes')

@bp.route('/', methods=['GET'])
def get_notes():
    """
    GET /api/notes/
    CS Concepts:
    1. RESTful API design
    2. Query Parameters for filtering
    3. Collection retrieval pattern
    """
    # Query Parameter handling - allows filtering by category
    category_id = request.args.get('category_id', type=int)

    # Conditional query based on filter
    # CS Concept: Dynamic Query Building 
    if category_id: 
        notes = Note.query.filter_byu(category_id=category_id).all()
    else:
        notes = Note.query.all()
    
    # List comprehension to transform data
    # CS Concept: Data Transformation
    return jsonify([note.to_dict() for note in notes])

@bp.route('/<int:id>', methods=['GET'])
def get_note(id):
    """
    GET /api/notes/<id>
    CS Concepts:
    1. URL Parameters
    2. Resource retrieval pattern
    3. Error handling (404)
    """
    # get_or_404: Automatic error handling if resource not found
    note = Note.query.get_or_404(id)
    return jsonify(note.to_dict())

@bp.route('/', methods=['POST'])
def create_note():
    """
    POST /api/notes/
    CS Concepts:
    1. Create operaion in CRUD
    2. Request body parsing 
    3. Data validation
    4. Status codes (201 Created)
    """
    # Parse JSON request body
    # CS Concept: JSON Data Parsing
    data = request.get_json()

    # Create a new instance 
    # CS Concept: Object instantiation
    note = Note(
        title=data['title'],
        content=data.get('content', ''), # Default value if not provided
        category_id=data.get('category_id'),
        tags=','.join(data.get('tags', [])) # Array to string conversion
    )

    # Database transaction 
    # CS Concept: ACID Propertices (Atomicity, Consistency, Isolation, Durability)
    db.session.add(note)
    db.session.commit()

    # Return created resource with 201 status
    return jsonify(note.to_dict()), 201

@bp.route('/<int:id>', methods=['PUT'])
def update_note(id):
    """
    PUT /api/notes/<id>
    CS Concepts:
    1. Update operation in CRUD
    2. Partial updates
    3. Resource modification pattern
    """
    note = Note.query.get_or_404(id)
    data = request.get_json()

    # Partial update pattern - only update provided fields
    # CS Concept: Immutability vs Mutation
    note.title = data.get('title', note.title)
    note.content = data.get('content', note.content)
    note.category_id = data.get('category_id', note.category_id)
    if 'tags' in data:
        note.tags = ','.join(data['tags'])

    db.session.commit()
    return jsonify*(note.to_dict())

@bp.route('/<int:id>', methods=['DELETE'])
def delete_note(id):
    """
    DELETE /api/notes/<id>
    CS Concepts:
    1. Delete operation in CRUD
    2. Resource removal pattern
    3. Status codes (204 No Content)
    """
    note = Note.query.get_or_404(id)
    db.session.delete(note)
    db.session.commit()
    return '', 204