from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session, abort
import os
import json
from datetime import datetime
from functools import wraps
import secrets
import hashlib
import uuid

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'smokin_breadsticks_secret_key'
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')
app.config['IMAGE_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/images')
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Ensure upload folders exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['IMAGE_FOLDER'], exist_ok=True)

# Admin credentials - in a real app, this would be stored in a database with proper password hashing
ADMIN_USERNAME = 'admin'
# Generate a secure password hash
ADMIN_PASSWORD_HASH = hashlib.sha256('admin123'.encode()).hexdigest()

# Admin activity log
admin_activity = []

# Helper functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def generate_secure_filename(filename):
    """Generate a secure filename with UUID to prevent overwriting"""
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    return f"{uuid.uuid4().hex}.{ext}"

def save_activity(action, details):
    """Save admin activity to log"""
    admin_activity.append({
        'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'action': action,
        'details': details
    })
    # Keep only the last 50 activities
    if len(admin_activity) > 50:
        admin_activity.pop(0)

# Authentication decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session or not session['admin_logged_in']:
            flash('Please log in to access the admin area.', 'danger')
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

# Mock data for the website
class MockData:
    @staticmethod
    def get_upcoming_shows():
        return [
            {
                'date': {'day': '15', 'month': 'MAY', 'year': '2025'},
                'location': 'Munich, Germany',
                'venue': 'Backstage Club',
                'address': 'Reitknechtstr. 6, 80639 Munich'
            },
            {
                'date': {'day': '22', 'month': 'MAY', 'year': '2025'},
                'location': 'Berlin, Germany',
                'venue': 'SO36',
                'address': 'Oranienstraße 190, 10999 Berlin'
            },
            {
                'date': {'day': '29', 'month': 'MAY', 'year': '2025'},
                'location': 'Hamburg, Germany',
                'venue': 'Molotow',
                'address': 'Nobistor 14, 22767 Hamburg'
            },
            {
                'date': {'day': '05', 'month': 'JUN', 'year': '2025'},
                'location': 'Vienna, Austria',
                'venue': 'Arena Wien',
                'address': 'Baumgasse 80, 1030 Vienna'
            }
        ]
    
    @staticmethod
    def get_latest_news():
        return [
            {
                'date': 'APR 15TH 2025',
                'title': 'NEW ALBUM ANNOUNCEMENT',
                'content': 'We\'re excited to announce our upcoming album "Breadstick Inferno" will be released this summer!',
                'link': '#'
            },
            {
                'date': 'MAR 22ND 2025',
                'title': 'SUMMER TOUR DATES ANNOUNCED',
                'content': 'Check out our summer tour schedule and get your tickets before they sell out!',
                'link': '/tour'
            },
            {
                'date': 'FEB 10TH 2025',
                'title': 'NEW MERCH AVAILABLE NOW',
                'content': 'Our latest merchandise collection is now available in our online store.',
                'link': '/merch'
            }
        ]
    
    @staticmethod
    def get_featured_music():
        return [
            {
                'title': 'Dough Rising',
                'type': 'Album',
                'year': '2024',
                'cover': 'album1.jpg'
            },
            {
                'title': 'Garlic Knots',
                'type': 'Single',
                'year': '2023',
                'cover': 'album2.jpg'
            },
            {
                'title': 'Marinara Dreams',
                'type': 'EP',
                'year': '2023',
                'cover': 'album3.jpg'
            }
        ]

# Public routes
@app.route('/')
def home():
    upcoming_shows = MockData.get_upcoming_shows()[:4]  # Limit to 4 shows
    latest_news = MockData.get_latest_news()
    featured_music = MockData.get_featured_music()
    
    return render_template('index.html', 
                          upcoming_shows=upcoming_shows,
                          latest_news=latest_news,
                          featured_music=featured_music)

@app.route('/music')
def music():
    return render_template('music.html')

@app.route('/tour')
def tour():
    upcoming_shows = MockData.get_upcoming_shows()
    return render_template('tour.html', upcoming_shows=upcoming_shows)

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/videos')
def videos():
    return render_template('videos.html')

@app.route('/merch')
def merch():
    return render_template('merch.html')

@app.route('/about')
def about():
    return render_template('about.html')

# Admin routes
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Hash the provided password for comparison
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        if username == ADMIN_USERNAME and password_hash == ADMIN_PASSWORD_HASH:
            session['admin_logged_in'] = True
            session['admin_username'] = username
            session['last_login'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            save_activity('Login', f'Admin user {username} logged in')
            
            flash('You have been successfully logged in!', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid username or password. Please try again.', 'danger')
    
    return render_template('admin/login.html')

@app.route('/admin/logout')
def admin_logout():
    if 'admin_logged_in' in session:
        username = session.get('admin_username', 'Unknown')
        save_activity('Logout', f'Admin user {username} logged out')
        
        session.pop('admin_logged_in', None)
        session.pop('admin_username', None)
        flash('You have been successfully logged out!', 'success')
    
    return redirect(url_for('admin_login'))

@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    # Count images in the image folder
    image_count = len([f for f in os.listdir(app.config['IMAGE_FOLDER']) 
                      if os.path.isfile(os.path.join(app.config['IMAGE_FOLDER'], f)) 
                      and allowed_file(f)])
    
    # Get last login time
    last_login = session.get('last_login', 'First login')
    
    # Get recent activity (last 10)
    recent_activity = admin_activity[-10:] if admin_activity else []
    
    return render_template('admin/dashboard.html', 
                          current_user=session.get('admin_username', 'Admin'),
                          image_count=image_count,
                          last_login=last_login,
                          recent_activity=recent_activity)

@app.route('/admin/images')
@admin_required
def admin_images():
    # Get all images from the image folder
    images = []
    for filename in os.listdir(app.config['IMAGE_FOLDER']):
        if os.path.isfile(os.path.join(app.config['IMAGE_FOLDER'], filename)) and allowed_file(filename):
            images.append({
                'filename': filename,
                'path': os.path.join('images', filename),
                'url': url_for('static', filename=f'images/{filename}'),
                'size': os.path.getsize(os.path.join(app.config['IMAGE_FOLDER'], filename)) // 1024  # Size in KB
            })
    
    return render_template('admin/images.html',
                          current_user=session.get('admin_username', 'Admin'),
                          images=images)

@app.route('/admin/images/upload', methods=['POST'])
@admin_required
def admin_upload_image():
    if 'image' not in request.files:
        flash('No file part', 'danger')
        return redirect(url_for('admin_images'))
    
    file = request.files['image']
    
    if file.filename == '':
        flash('No selected file', 'danger')
        return redirect(url_for('admin_images'))
    
    if file and allowed_file(file.filename):
        # Get the target location (where the image will be used)
        target_location = request.form.get('target_location', '')
        
        # Generate a secure filename
        filename = generate_secure_filename(file.filename)
        
        # Save the file
        file.save(os.path.join(app.config['IMAGE_FOLDER'], filename))
        
        save_activity('Upload Image', f'Uploaded image {filename} for {target_location}')
        
        flash(f'Image uploaded successfully as {filename}', 'success')
    else:
        flash('Invalid file type. Allowed types: png, jpg, jpeg, gif, webp', 'danger')
    
    return redirect(url_for('admin_images'))

@app.route('/admin/images/replace/<path:image_path>', methods=['POST'])
@admin_required
def admin_replace_image(image_path):
    if 'image' not in request.files:
        flash('No file part', 'danger')
        return redirect(url_for('admin_images'))
    
    file = request.files['image']
    
    if file.filename == '':
        flash('No selected file', 'danger')
        return redirect(url_for('admin_images'))
    
    # Construct the full path to the image
    image_full_path = os.path.join(app.config['IMAGE_FOLDER'], os.path.basename(image_path))
    
    if not os.path.exists(image_full_path):
        flash('Image not found', 'danger')
        return redirect(url_for('admin_images'))
    
    if file and allowed_file(file.filename):
        # Save the original filename for activity log
        original_filename = os.path.basename(image_path)
        
        # Save the new file with the same name as the original
        file.save(image_full_path)
        
        save_activity('Replace Image', f'Replaced image {original_filename}')
        
        flash(f'Image {original_filename} replaced successfully', 'success')
    else:
        flash('Invalid file type. Allowed types: png, jpg, jpeg, gif, webp', 'danger')
    
    return redirect(url_for('admin_images'))

@app.route('/admin/images/delete/<path:image_path>', methods=['POST'])
@admin_required
def admin_delete_image(image_path):
    # Construct the full path to the image
    image_full_path = os.path.join(app.config['IMAGE_FOLDER'], os.path.basename(image_path))
    
    if not os.path.exists(image_full_path):
        flash('Image not found', 'danger')
        return redirect(url_for('admin_images'))
    
    # Save the original filename for activity log
    original_filename = os.path.basename(image_path)
    
    # Delete the file
    os.remove(image_full_path)
    
    save_activity('Delete Image', f'Deleted image {original_filename}')
    
    flash(f'Image {original_filename} deleted successfully', 'success')
    
    return redirect(url_for('admin_images'))

# API routes for form handling
@app.route('/api/contact', methods=['POST'])
def contact_form():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        # In a real application, this would save to a database or send an email
        # For now, we'll just log it and return success
        print(f"Contact form submission: {name}, {email}, {subject}, {message}")
        
        # Save to a JSON file for demonstration
        contact_data = {
            'name': name,
            'email': email,
            'subject': subject,
            'message': message,
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        contacts_file = os.path.join(app.config['UPLOAD_FOLDER'], 'contacts.json')
        
        # Create or append to the contacts file
        try:
            if os.path.exists(contacts_file):
                with open(contacts_file, 'r') as f:
                    contacts = json.load(f)
            else:
                contacts = []
                
            contacts.append(contact_data)
            
            with open(contacts_file, 'w') as f:
                json.dump(contacts, f, indent=4)
                
            return jsonify({'success': True, 'message': 'Thank you for your message! We will get back to you soon.'})
        except Exception as e:
            print(f"Error saving contact: {e}")
            return jsonify({'success': False, 'message': 'There was an error processing your request. Please try again later.'})

@app.route('/api/newsletter', methods=['POST'])
def newsletter_form():
    if request.method == 'POST':
        email = request.form.get('email')
        
        # In a real application, this would save to a database or send to a mailing service
        # For now, we'll just log it and return success
        print(f"Newsletter subscription: {email}")
        
        # Save to a JSON file for demonstration
        subscription_data = {
            'email': email,
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        subscriptions_file = os.path.join(app.config['UPLOAD_FOLDER'], 'subscriptions.json')
        
        # Create or append to the subscriptions file
        try:
            if os.path.exists(subscriptions_file):
                with open(subscriptions_file, 'r') as f:
                    subscriptions = json.load(f)
            else:
                subscriptions = []
                
            subscriptions.append(subscription_data)
            
            with open(subscriptions_file, 'w') as f:
                json.dump(subscriptions, f, indent=4)
                
            return jsonify({'success': True, 'message': 'Thank you for subscribing to our newsletter!'})
        except Exception as e:
            print(f"Error saving subscription: {e}")
            return jsonify({'success': False, 'message': 'There was an error processing your request. Please try again later.'})

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
