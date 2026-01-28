from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_login import LoginManager, login_required, logout_user, current_user
from config import Config
from models import db, ParkingSpot, User
from auth import init_auth

# Flask App
app = Flask(__name__)
app.config.from_object(Config)

# Initialize database
db.init_app(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index'

# Initialize Google OAuth
google_auth = init_auth(app)

# Test database connection
with app.app_context():
    try:
        db.create_all()
        print("Database connected and tables are ready.")
    except Exception as e:
        print(f"Database connection failed: {e}")

# ============= FLASK-LOGIN USER LOADER =============
@login_manager.user_loader
def load_user(user_id):
    """
    Flask-Login uses this to reload the user object from the user ID stored in the session
    """
    return User.query.get(int(user_id))

# ============= ROUTES =============
@app.route('/')
def index():
    """Home page route"""
    return render_template('index.html')

# ============= AUTHENTICATION ROUTES =============
@app.route('/login')
def login():
    """
    Redirect user to Google's login page
    """
    login_url = google_auth.get_login_url()
    return redirect(login_url)

@app.route('/login/callback')
def callback():
    """
    Handle callback from Google after user logs in
    """
    # Get user from Google
    user = google_auth.handle_callback()
    
    if user:
        # Log the user in
        from flask_login import login_user
        login_user(user)
        
        # Redirect based on whether profile is complete
        if user.is_profile_complete():
            return redirect(url_for('index'))
        else:
            return redirect(url_for('complete_profile'))
    else:
        return "Login failed", 400

@app.route('/logout')
@login_required
def logout():
    """
    Log out the current user
    """
    logout_user()
    return redirect(url_for('index'))

@app.route('/complete-profile')
@login_required
def complete_profile():
    """
    Page for new users to complete their profile
    For now, just redirect to home - we'll build the UI in the next step
    """
    return render_template('index.html')

# ============= API ROUTES =============
@app.route('/api/current-user')
def get_current_user():
    """
    Get current logged-in user info
    """
    if current_user.is_authenticated:
        return jsonify({
            'authenticated': True,
            'user': current_user.to_dict()
        })
    else:
        return jsonify({
            'authenticated': False,
            'user': None
        })

@app.route('/api/update-profile', methods=['POST'])
@login_required
def update_profile():
    """
    Update user profile information
    """
    try:
        data = request.get_json()
        
        # Update user fields
        if 'major' in data:
            current_user.major = data['major']
        if 'grade_level' in data:
            current_user.grade_level = data['grade_level']
        if 'graduation_year' in data:
            current_user.graduation_year = data['graduation_year']
        if 'housing_type' in data:
            current_user.housing_type = data['housing_type']
        if 'preferred_parking_types' in data:
            current_user.preferred_parking_types = data['preferred_parking_types']
        
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'user': current_user.to_dict()
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/parking-spots', methods=['GET'])
def get_parking_spots():
    """API route to get all parking spots"""
    try:
        spots = ParkingSpot.query.all()
        spots_data = [spot.to_dict() for spot in spots]

        return jsonify({
            'status': 'success',
            'count': len(spots_data),
            'data': spots_data
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/parking-spots/filter', methods=['GET'])
def filter_parking_spots():
    """API route to filter parking spots based on query parameters"""
    try:
        query = ParkingSpot.query

        # Get query parameters
        campus_location = request.args.get('campus')
        parking_type = request.args.get('type')
        max_cost = request.args.get('max_cost', type=float)

        # Apply filters
        if campus_location:
            query = query.filter(ParkingSpot.campus_location == campus_location)
        if parking_type:
            query = query.filter(ParkingSpot.parking_type == parking_type)
        if max_cost is not None:
            query = query.filter(ParkingSpot.cost <= max_cost)

        filtered_spots = query.all()
        spots_data = [spot.to_dict() for spot in filtered_spots]

        return jsonify({
            'status': 'success',
            'count': len(spots_data),
            'data': spots_data
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    
# ============= RECOMMENDATION LOGIC =============
   
@app.route('/api/recommendations', methods=['GET'])
@login_required

def get_recommendations():
    """
    Get personalized parking spot recommendations for the current user
    """
    try:
        # Simple recommendation logic based on user's preferred parking types
        pass
        """
        return jsonify({
            'status': 'success',
            'count': len(spots_data),
            'data': spots_data
        })
        """
    except Exception as e:
        """
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
        """
# ============= SEARCH LOGIC ============= 

@app.route('/api/search-logic', methods=['GET'])
def search_parking_spots():
    """
    Search parking spots based on a query string
    """
    try:
        # Simple search logic
        pass
        """
        return jsonify({
            'status': 'success',
            'count': len(spots_data),
            'data': spots_data
        })
        """
    except Exception as e:
        """
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
        """
# ============= ADD PARKINGSPOT =============
@app.route('/api/add-parking-spot', methods=['POST'])
def add_parking_spot():
    """
    Add a new parking spot to the database
    """
    try:
        pass
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
# Run app
if __name__ == '__main__':
    app.run(debug=True, port=5000)