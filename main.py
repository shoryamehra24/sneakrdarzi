from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# Load sneaker data from JSON file
with open('sneakers_with_price.json', 'r') as f:
    sneakers_data = json.load(f)

@app.route('/')
def home():
    return render_template('home.html')  # Serve the main interface

@app.route('/shoe-box')
def shoe_box():
    return render_template('shoe-box.html')  # Serve the Shoe Box page

@app.route('/api/sneakers', methods=['GET'])
def get_sneakers():
    return jsonify(sneakers_data)

if __name__ == '__main__':
    app.run(debug=True)
