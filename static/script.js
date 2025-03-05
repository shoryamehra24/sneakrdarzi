let currentIndex = 0;
let sneakers = [];

function loadSneakers() {
    fetch('/api/sneakers')
        .then(response => response.json())
        .then(data => {
            sneakers = data;
            showSneaker();
        })
        .catch(error => console.error('Error fetching data:', error));
}

function showSneaker() {
    if (currentIndex < sneakers.length) {
        const sneaker = sneakers[currentIndex];
        document.getElementById('sneaker-image').src = sneaker.sneaker_image;
        document.getElementById('sneaker-title').innerText = sneaker.sneaker_title;
        document.getElementById('sneaker-price').innerText = sneaker.price;
    } else {
        document.getElementById('sneaker-card').innerHTML = '<h3>No more sneakers!</h3>';
    }
}

function handleSwipe(like) {
    currentIndex++;
    showSneaker();
}

document.getElementById('dislike-btn').addEventListener('click', () => handleSwipe(false));
document.getElementById('like-btn').addEventListener('click', () => handleSwipe(true));

loadSneakers();
