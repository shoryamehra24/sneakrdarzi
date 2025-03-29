let model;
let uploadedFeatures; // Store uploaded image features globally

// Load MobileNet model
async function loadModel() {
  try {
    model = await mobilenet.load();
    console.log("Model loaded successfully!");
  } catch (error) {
    console.error("Error loading the model:", error);
  }
}

// Fetch sneaker data from Flask API
async function fetchSneakerData() {
  const response = await fetch('/api/sneakers');
  return await response.json();
}

// Extract features for a single image
async function extractFeatures(imgElement) {
  if (!model) {
    console.error("Model is not loaded yet.");
    alert("Model is still loading. Please wait...");
    return null;
  }

  const tensorImg = tf.image.resizeBilinear(tf.browser.fromPixels(imgElement), [224, 224])
    .expandDims(0);

  const features = await model.infer(tensorImg, true); // Extract embeddings
  const featureArray = features.dataSync(); // Convert to array
  console.log('Extracted Features:', featureArray); // Log features

  return featureArray;
}

// Cache sneaker features
async function cacheSneakerFeatures() {
  const sneakers = await fetchSneakerData();
  const sneakerFeatures = {};

  for (const sneaker of sneakers) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Bypass CORS issue
    img.src = sneaker.sneaker_image;

    await new Promise(resolve => img.onload = resolve); // Wait for image to load
    const features = await extractFeatures(img);

    if (features) {
      console.log(`Features for ${sneaker.sneaker_title}:`, features);
      sneakerFeatures[sneaker.sneaker_title] = features;
    }
  }

  localStorage.setItem('sneakerFeatures', JSON.stringify(sneakerFeatures));
  console.log('Sneaker features cached!');
}

// Cosine similarity function
function cosineSimilarity(vecA, vecB) {
  const dotProduct = tf.tensor1d(vecA).dot(tf.tensor1d(vecB)).dataSync()[0];
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val ** 2, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Handle image upload
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Clear localStorage to reset cached sneaker features
  localStorage.removeItem('sneakerFeatures');

  const reader = new FileReader();
  reader.onload = async function(e) {
    const imgElement = document.createElement('img');
    imgElement.src = e.target.result;

    await new Promise(resolve => imgElement.onload = resolve); // Wait for the image to load
    uploadedFeatures = await extractFeatures(imgElement); // Store features globally
    console.log('Uploaded Image Features:', uploadedFeatures);

    // Re-cache sneaker features after upload
    await cacheSneakerFeatures();
  };
  reader.readAsDataURL(file);
}

// Compare uploaded image with sneaker features
let previouslyDisplayedSneakers = new Set(); // Store displayed sneakers globally

async function compareWithSneakers() {
  const sneakerFeatures = JSON.parse(localStorage.getItem('sneakerFeatures')) || {};
  const sneakers = await fetchSneakerData();

  const similarities = sneakers
    .filter(sneaker => !previouslyDisplayedSneakers.has(sneaker.sneaker_title)) // Filter out already shown sneakers
    .map(sneaker => {
      const sneakerFeature = sneakerFeatures[sneaker.sneaker_title];
      if (!sneakerFeature) return { ...sneaker, similarity: -1 };

      const similarity = cosineSimilarity(uploadedFeatures, sneakerFeature);
      return { ...sneaker, similarity };
    });

  const sortedResults = similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 9);

  // Add displayed sneakers to the set
  sortedResults.forEach(sneaker => previouslyDisplayedSneakers.add(sneaker.sneaker_title));

  displayResults(sortedResults);
}
// Display sneaker results
function displayResults(sneakers) {
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.innerHTML = '';

  sneakers.forEach(sneaker => {
    const card = `
      <div class="col-md-4">
        <div class="sneaker-card card">
          <img src="${sneaker.sneaker_image}" class="sneaker-image card-img-top">
          <div class="card-body">
            <h5 class="card-title">${sneaker.sneaker_title}</h5>
            <p class="card-text">₹ ${sneaker.price}</p>
          </div>
        </div>
      </div>
    `;
    resultsContainer.innerHTML += card;
  });
}

// Initialize app
(async function initialize() {
  await loadModel(); // Load the model first
  if (!localStorage.getItem('sneakerFeatures')) {
    await cacheSneakerFeatures(); // Cache sneaker features on first load
  }
})();

// Event listeners
document.getElementById('sneakerImage').addEventListener('change', handleImageUpload);
document.getElementById('checkBtn').addEventListener('click', compareWithSneakers);