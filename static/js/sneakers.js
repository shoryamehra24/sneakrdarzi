let currentIndex = 0;
let sneakers = [];
let likedSneakers = JSON.parse(localStorage.getItem('likedSneakers')) || [];  
let sneakerData = []; // Ensure this is mutable
let filteredSneakers = [];


function loadSneakers() {
    fetch('/api/sneakers')
        .then(response => response.json())
        .then(data => {
            sneakers = data;
            showSneaker();
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Show notification when a sneaker is liked
function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function showSneaker(sneakerList) {
    if (!sneakerList || sneakerList.length === 0) return;

    const sneaker = sneakerList[currentIndex % sneakerList.length];
    document.getElementById('sneaker-image').src = sneaker.sneaker_image;
    document.getElementById('sneaker-title').innerText = sneaker.sneaker_title;
    document.getElementById('sneaker-price').innerText = `₹${sneaker.price}`;
    document.getElementById('sneaker-desc').innerText = sneaker.desc;
}

function handleLike() {
    const activeSneakers = filteredSneakers.length > 0 ? filteredSneakers : sneakers;

    if (currentIndex < activeSneakers.length) {
        likedSneakers.push(activeSneakers[currentIndex]);
        localStorage.setItem('likedSneakers', JSON.stringify(likedSneakers));
        showNotification();
        handleSwipe();
    }
}

// Handle "Dislike" action
function handleDislike() {
    handleSwipe();
}

// Swipe to next sneaker
function handleSwipe() {
    const activeSneakers = filteredSneakers.length > 0 ? filteredSneakers : sneakers;

    if (activeSneakers.length === 0) {
        document.getElementById("sneaker-title").innerText = "No sneakers available!";
        return;
    }

    // Increment the index first
    currentIndex++;

    // Reset to start from the beginning when all are shown
    if (currentIndex >= activeSneakers.length) {
        currentIndex = 0;
    }

    // Show the sneaker after updating the index
    showSneaker(activeSneakers);

    console.log(`Current Index: ${currentIndex} / Total: ${activeSneakers.length}`);
}


// Redirect to Shoe Box
function openShoeBox() {
    window.location.href = '/shoe-box';
}


// Load sneakers data on page load
loadSneakers();

document.addEventListener("DOMContentLoaded", function () {
    const filters = JSON.parse(localStorage.getItem("sneakerFilters")) || {
        colors: [],
        brands: []
    };

    function filterSneakers() {
        console.log("Filtering Sneakers...");
        currentIndex = 0; // Reset index when filters change
    
        // Fetch filters from local storage
        const filters = JSON.parse(localStorage.getItem("sneakerFilters")) || {
            colors: [],
            brands: []
        };
    
        localStorage.removeItem("sneakerFilters"); 
    
        filteredSneakers = sneakerData.filter(sneaker => {
            const matchesGender = !filters.gender || sneaker.gender.includes(filters.gender);
            const matchesBudget = isWithinBudget(sneaker.price, filters.budget || "");
    
            // Check for colors as an array
            const matchesColor = !filters.colors.length || 
                filters.colors.some(color => 
                    sneaker.color && sneaker.color.toLowerCase() === color.toLowerCase()
                );
    
                const matchesBrand = !filters.brands.length || 
                filters.brands.some(brand => 
                    sneaker.brand && sneaker.brand.toLowerCase() === brand.toLowerCase()
                );
            
    
            console.log(`Checking Sneaker Color: ${sneaker.color}, Filter: ${filters.colors}`);
    
            return matchesGender && matchesBudget && matchesColor && matchesBrand;
        });
    
        console.log("Filtered Sneakers:", filteredSneakers);
        console.log("Current Filters:", filters);
    
        showSneaker(filteredSneakers);
    }

    function isWithinBudget(price, budget) {
        const priceValue = parseFloat(price);  
        console.log(`Checking budget: Price = ${priceValue}, Budget = ${budget}`);
        if (isNaN(priceValue)) return false;
        switch (budget) {
            case "Under ₹2000": return priceValue < 2000;
            case "₹2000 - ₹5000": return priceValue >= 2000 && priceValue <= 5000;
            case "₹5000 - ₹10000": return priceValue >= 5000 && priceValue <= 10000;
            case "₹10000 - ₹15000": return priceValue >= 10000 && priceValue <= 15000;
            case "₹15000+": return priceValue > 15000;
            default: return true;
        }
    }

    fetch('/api/sneakers')
        .then(response => response.json())
        .then(data => {
            sneakerData = data.map(sneaker => ({
                ...sneaker,
                price: parseFloat(sneaker.price) || 0
            }));

            console.log("Converted Sneaker Data:", sneakerData);
            filterSneakers();  
        })
        .catch(error => console.error("Error loading sneaker data:", error));

    console.log("DOM fully loaded and parsed");

    // Attach event listeners only once
    if (!eventListenersAttached) {
        document.getElementById('dislike-btn').addEventListener('click', handleDislike);
        document.getElementById('like-btn').addEventListener('click', handleLike);
        eventListenersAttached = true; // Set the flag to true after attaching
    }
});



