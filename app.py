from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# Load sneaker data from JSON file
with open('sneakers.json', 'r') as f:
    sneakers_data = json.load(f)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/sneakers', methods=['GET'])
def get_sneakers():
    return jsonify(sneakers_data)

if __name__ == '__main__':
    app.run(debug=True)
