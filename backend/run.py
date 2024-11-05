# backend/run.py
from app import create_app, db
from app.models.category import Category  # Import the models explicitly
from app.models.note import Note

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # This will create all tables
        print("Database tables created successfully!")

    # Run the Flask development server
    app.run(debug=True, host='0.0.0.0', port=5000)