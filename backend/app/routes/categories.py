# backend/app/routes/categories.py
from flask import Blueprint, jsonify, request
from app.models.category import Category
from app import db
from app.models.note import Note

bp = Blueprint('categories', __name__, url_prefix='/api/categories')

@bp.route('/', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([category.to_dict() for category in categories])

@bp.route('/', methods=['POST'])
def create_category():
    data = request.get_json()
    category = Category(
        name = data['name'],
        parent_id = data.get('parent_id')
    )
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201

@bp.route('/<int:id>', methods=['DELETE'])
def delete_category(id):
    """
    Delete a category and set its notes to uncategorized
    """
    category = Category.query.get_or_404(id)

    # Update all notes in this category to have no category
    Note.query.filter_by(category_id=id).update({Note.category_id: None})

    # Delete the category
    db.session.delete(category)
    db.session.commit()

    return '', 204