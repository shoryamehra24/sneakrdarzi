let currentIndex = 0;
let sneakers = [];
let likedSneakers = JSON.parse(localStorage.getItem('likedSneakers')) || [];  // Initialize likedSneakers

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

function showSneaker() {
    if (currentIndex < sneakers.length) {
        const sneaker = sneakers[currentIndex];
        document.getElementById('sneaker-image').src = sneaker.sneaker_image;
        document.getElementById('sneaker-title').innerText = sneaker.sneaker_title;
        document.getElementById('sneaker-price').innerText = sneaker.price;
        document.getElementById('sneaker-desc').innerText = sneaker.desc;
    } else {
        document.getElementById('sneaker-card').innerHTML = '<h3>No more sneakers!</h3>';
    }
}

// Handle "Like" action
function handleLike() {
    const likedSneaker = sneakers[currentIndex];
    likedSneakers.push(likedSneaker);    // Add to likedSneakers
    localStorage.setItem('likedSneakers', JSON.stringify(likedSneakers));  // Save to localStorage
    showNotification();  // Show "Liked" message
    handleSwipe(true);   // Move to next sneaker
}

// Handle "Dislike" action
function handleDislike() {
    handleSwipe(false);  // Move to next sneaker
}

// Swipe to next sneaker
function handleSwipe(like) {
    currentIndex++;
    showSneaker();
}

// Redirect to Shoe Box
function openShoeBox() {
    window.location.href = '/shoe-box';  // Correct path for Flask route
}

// Event listeners for buttons
document.getElementById('dislike-btn').addEventListener('click', handleDislike);
document.getElementById('like-btn').addEventListener('click', handleLike);

// Load sneakers data on page load
loadSneakers();
