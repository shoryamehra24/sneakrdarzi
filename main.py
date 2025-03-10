from flask import Flask, render_template, jsonify, request, redirect, url_for
import json

app = Flask(__name__)

# Load sneaker data from JSON file
with open('sneakers_with_price.json', 'r') as f:
    sneakers_data = json.load(f)

# Temporary storage for checkout data
order_data = {}

@app.route('/')
def home():
    return render_template('home.html')  # Main interface

@app.route('/shoe-box')
def shoe_box():
    return render_template('shoe-box.html')  # Shoe Box page

@app.route('/api/sneakers', methods=['GET'])
def get_sneakers():
    return jsonify(sneakers_data)

# Checkout Routes
@app.route('/shipping', methods=['GET', 'POST'])
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
