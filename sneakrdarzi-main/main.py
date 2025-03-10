from flask import Flask, render_template, jsonify, request, redirect, url_for, session
import json
import os
import requests
from urllib.parse import urlencode

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a real secret key in production

# Load sneaker data from JSON file
with open('sneakers_with_price.json', 'r') as f:
    sneakers_data = json.load(f)

# Google OAuth Configuration
GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"  # Replace with your Google Client ID
GOOGLE_CLIENT_SECRET = "YOUR_GOOGLE_CLIENT_SECRET"  # Replace with your Google Client Secret
GOOGLE_REDIRECT_URI = "http://127.0.0.1:5000/login/callback"
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


@app.route('/')
def home():
    # Serve the landing page instead of redirecting to login
    return render_template('index.html')


@app.route('/shoe-box')
def shoe_box():
    return render_template('shoe-box.html')  # Serve the Shoe Box page


@app.route('/login', methods=['GET'])
def login():
    return render_template('login.html')  # Serve the login page


@app.route('/login/google')
def login_google():
    # Create the Google Auth URL
    params = {
        'client_id': GOOGLE_CLIENT_ID,
        'redirect_uri': GOOGLE_REDIRECT_URI,
        'response_type': 'code',
        'scope': 'email profile',
        'prompt': 'select_account'
    }
    auth_url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
    return redirect(auth_url)


@app.route('/login/callback')
def google_callback():
    # Get the authorization code from the callback
    code = request.args.get('code')

    # Exchange the code for access token
    token_data = {
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'redirect_uri': GOOGLE_REDIRECT_URI,
        'grant_type': 'authorization_code'
    }

    # Make the request to get the token
    response = requests.post(GOOGLE_TOKEN_URL, data=token_data)
    token_json = response.json()

    # Use the token to get user info
    headers = {'Authorization': f"Bearer {token_json['access_token']}"}
    user_info = requests.get(GOOGLE_USER_INFO_URL, headers=headers).json()

    # Store user info in session
    session['user'] = {
        'email': user_info.get('email'),
        'name': user_info.get('name'),
        'picture': user_info.get('picture')
    }

    # Redirect to the shoe box page
    return redirect(url_for('shoe_box'))


@app.route('/login', methods=['POST'])
def login_user():
    # This is a simple example - in a real app, you would validate credentials
    # and implement proper authentication
    email = request.form.get('email')
    password = request.form.get('password')

    # For now, just redirect to shoe-box page after login
    return redirect(url_for('shoe_box'))


@app.route('/register', methods=['POST'])
def register_user():
    # This is a simple example - in a real app, you would store user data
    email = request.form.get('email')
    password = request.form.get('password')

    # For now, just redirect to shoe-box page after registration
    return redirect(url_for('shoe_box'))


@app.route('/api/sneakers', methods=['GET'])
def get_sneakers():
    return jsonify(sneakers_data)


@app.route('/logout')
def logout():
    # Clear the session
    session.clear()
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(debug=True)
