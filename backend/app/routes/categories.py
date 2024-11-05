# backend/app/routes/categories.py
from flask import Blueprint, jsonify, request
from app.models.category import Category
from app import db

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

