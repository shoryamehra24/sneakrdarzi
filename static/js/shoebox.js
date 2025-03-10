function loadShoeBox() {
    const likedSneakers = JSON.parse(localStorage.getItem('likedSneakers')) || [];
    const shoeBoxItems = document.getElementById('shoe-box-items');
    const subtotalElement = document.getElementById('subtotal');
    shoeBoxItems.innerHTML = '';
    let subtotal = 0;

    likedSneakers.forEach((sneaker, index) => {
        subtotal += parseFloat(sneaker.price) || 0;
        const card = `
        <div class="row align-items-center p-3 border rounded shadow-sm">
            <div class="col-md-4 text-center">
                <img src="${sneaker.sneaker_image}" alt="${sneaker.sneaker_title}" class="img-fluid" style="max-width: 200px;">
            </div>
            <div class="col-md-8">
                <h5>${sneaker.sneaker_title}</h5>
                <p class="text-muted">${sneaker.desc}</p>
                <p class="text-secondary">${sneaker.gender}</p>
                <p class="text-success"><strong>₹${sneaker.price}</strong></p>
                <button class="btn btn-danger" onclick="removeFromShoeBox(${index})">Remove</button>
            </div>
        </div>`;
        shoeBoxItems.innerHTML += card;
    });

    // Update the subtotal display
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
}

function removeFromShoeBox(index) {
    let likedSneakers = JSON.parse(localStorage.getItem('likedSneakers')) || [];
    likedSneakers.splice(index, 1);
    localStorage.setItem('likedSneakers', JSON.stringify(likedSneakers));
    loadShoeBox();
}

function goBack() {
    window.location.href = '/';
}

// Initial load
loadShoeBox();
