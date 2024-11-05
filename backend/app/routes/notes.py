# backend/app/routes/notes.py
from flask import Blueprint, jsonify, request
from app.models.note import Note
from app import db

bp = Blueprint('notes', __name__, url_prefix='/api/notes')

@bp.route('/', methods=['GET'])
def get_notes():
    notes = Note.query.all()
    return jsonify([note.to_dict() for note in notes])

@bp.route('/', methods=['POST'])
def create_note():
    data = request.get_json()
    note = Note(
        title=data['title'],
        content=data['content'],
        category_id=data.get('category_id'),
        tags=','.join(data.get('tags', []))
    )
    db.session.add(note)
    db.session.commit()
    return jsonify(note.to_dict()), 201