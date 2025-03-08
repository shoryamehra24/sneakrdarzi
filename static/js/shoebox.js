function loadShoeBox() {
    const likedSneakers = JSON.parse(localStorage.getItem('likedSneakers')) || [];
    const shoeBoxItems = document.getElementById('shoe-box-items');
    shoeBoxItems.innerHTML = '';

    likedSneakers.forEach((sneaker, index) => {
        const card = `
        <div class="col">
            <div class="card h-100">
                <img src="${sneaker.sneaker_image}" class="card-img-top" alt="${sneaker.sneaker_title}">
                <div class="card-body">
                    <h5 class="card-title">${sneaker.sneaker_title}</h5>
                    <p class="card-text fst-italic">${sneaker.desc}</p>
                    <p class="text-secondary">${sneaker.gender}</p>
                    <p class="text-success">${sneaker.price}</p>
                    <button class="btn btn-danger" onclick="removeFromShoeBox(${index})">Remove</button>
                </div>
            </div>
        </div>`;
        shoeBoxItems.innerHTML += card;
    });
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

loadShoeBox();
