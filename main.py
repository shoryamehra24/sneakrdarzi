from flask import Flask, render_template, jsonify, request, redirect, url_for, session, flash
import json
import re  # Add this line at the beginning of your script
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3



app = Flask(__name__)
app.secret_key = 'your_secret_key'
# Load sneaker data from JSON file
with open('sneakers_with_price.json', 'r') as f:
    sneakers_data = json.load(f)

# Login required decorator
# Login required decorator
def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            flash('Please log in to access this page', 'error')
            return redirect(url_for('login_user'))
        return f(*args, **kwargs)
    return decorated_function

# Password validation function
def is_valid_password(password):
    pattern = r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$'
    return re.match(pattern, password)

# Temporary storage for checkout data
order_data = {}
@app.route('/dashboard')
@login_required
def home():
    return render_template('dashboard.html')  # Load questionnaire first

@app.route('/visual_search')
@login_required
def visual_search():
    return render_template('visual_search.html')

@app.route('/', methods=['GET', 'POST'])
def login_user():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Validate password format
        if not is_valid_password(password):
            flash('Password must be at least 6 characters long, contain one uppercase letter, one number, and one special character.', 'error')
            return redirect(url_for('login_user'))

        # Example login validation (replace with database check)
        if email == 'user@gmail.com' and password == 'Password@123':  # Example strong password
            session['logged_in'] = True
            session['email'] = email
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid email or password. Please try again.', 'error')

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('login_user'))

@app.route('/login_google')
def login_google():
    # This is a placeholder for Google OAuth implementation
    # In a real application, you'd implement proper Google OAuth here
    session['logged_in'] = True
    session['email'] = 'google_user@example.com'
    flash('Logged in with Google', 'success')
    return redirect(url_for('home'))



@app.route('/questionnaire', methods=['GET', 'POST'])
@login_required
def questionnaire():
    return render_template('questionnaire.html')  # Load questionnaire page

@app.route('/sneakers')
@login_required
def sneakers():
    return render_template('sneakers.html')  # After questionnaire, show sneakers

@app.route('/trending')
@login_required
def recommendations():
    return render_template('recommendations.html')  # After questionnaire, show sneakers

@app.route('/shoe-box')
def shoe_box():
    return render_template('shoe-box.html')  # Shoe Box page

@app.route('/api/sneakers', methods=['GET'])
def get_sneakers():
    return jsonify(sneakers_data)

# Checkout Routes
@app.route('/shipping', methods=['GET', 'POST'])
@login_required
def shipping():
    if request.method == 'POST':
        order_data['first_name'] = request.form['first_name']
        order_data['last_name'] = request.form['last_name']
        order_data['address'] = request.form['address']
        order_data['city'] = request.form['city']
        order_data['zip_code'] = request.form['zip_code']
        order_data['country'] = request.form['country']
        return redirect(url_for('payment'))  # Redirects to payment page
    return render_template('shipping.html')  # Loads shipping page on GET request


@app.route('/payment', methods=['GET', 'POST'])

def payment():
    if request.method == 'POST':
        order_data['card_name'] = request.form['card_name']
        order_data['card_number'] = request.form['card_number']
        order_data['expiry_date'] = request.form['expiry_date']
        order_data['cvv'] = request.form['cvv']
        return redirect(url_for('confirmation'))
    return render_template('payment.html')

@app.route('/confirmation')

def confirmation():
    return render_template('confirmation.html', order_number="SWP886689")

if __name__ == '__main__':
    app.run(debug=True)
