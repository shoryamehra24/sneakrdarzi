# Sneakerदर्ज़ी  
## A sneaker e-commerce website based on the popular dating application swiping models 👟 

<p align="center">
  <img src="SneakerDarziHome.png" alt="My Image" width="300">
</p>

The features of the web-app currently consist of:

JSON data of 200+ sneakers (scraped from CultureCircle)
User login page for authentication
User dashboard 
Sneaker filters
SneakerSearch (upload preferred sneaker image to find similar sneakers in database)
Sneaker Swipe functionality 
Sneaker Cart + Payment Functionality
The structure of the application consists of the following files/folders:

### /templates (folder for html files)'
	  /index.html (home page of application)
	  /login.html (login page)
	  /dashboard.html (dashboard page)
	  /questionnaire.html (filters page)
	  /sneakers.html (sneaker swipe page)
	  /visual-search.html (sneaker upload page)
	  /shoe-box.html (cart page)
	  /shipping.html (shipping page)
	  /payment.html (payment page)
	  /confirmation.html (payment confirmation page)

/partials (folder consisting of fixed header.html and head_links.html)

### /static (folder for css+js+image files)
	/css (folder consisting of css files)
		/home.css (styles for home page)
		/login.css (styles for login page)
		/styles.css (styles for overall website)
### /js (folder consisting of js files)
		/main.js (js file for sneaker upload functionality - MobileNet + Cosine Similarity)
		/login.js (js file for login page functionality)
		/shoebox.js (js file for cart functionality)
		/sneakers.js (js file for sneaker-swipe functionality)
### /img (folder for image assets)

main.py (python file consisting of server, login functionality, routes and data API)

sneakers_with_prices.json (json file consisting of scraped data)

Sneakers.csv (csv file consisting of scraped data)
