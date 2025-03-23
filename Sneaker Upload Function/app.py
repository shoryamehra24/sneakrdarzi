from flask import Flask, render_template, jsonify
import json
import os

app = Flask(__name__)

# Load sneaker data once to avoid reading the file on every request
DATA_PATH = os.path.join('data', 'sneakers_with_price.json')

def load_sneaker_data():
    try:
        with open(DATA_PATH, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading data: {e}")
        return []

# API route to get sneaker data
@app.route('/api/sneakers', methods=['GET'])
def get_sneakers():
    sneakers_data = load_sneaker_data()
    return jsonify(sneakers_data)

# Serve the frontend
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
