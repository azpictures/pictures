// Function to load models dynamically into the models listing page
function loadModels() {
    fetch('models.json')
        .then(response => response.json())
        .then(data => {
            const modelsGrid = document.getElementById('models-grid');

            // Check if models exist in the JSON data
            if (data.models && data.models.length > 0) {
                // Iterate over each model and create HTML dynamically
                data.models.forEach(model => {
                    const modelBox = document.createElement('a');
                    modelBox.classList.add('model-box');
                    modelBox.href = `model.html?model=${encodeURIComponent(model.name)}`;

                    modelBox.innerHTML = `
                        <h2>${model.name}</h2>
                    `;
                    modelsGrid.appendChild(modelBox);
                });
            } else {
                modelsGrid.innerHTML = '<p>No models found.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading models:', error);
            const modelsGrid = document.getElementById('models-grid');
            modelsGrid.innerHTML = '<p>There was an error loading the models.</p>';
        });
}

// Function to load the model's gallery based on query string (model name)
function loadModelGallery() {
    const urlParams = new URLSearchParams(window.location.search);
    const modelName = urlParams.get('model');

    fetch('models.json')
        .then(response => response.json())
        .then(data => {
            const model = data.models.find(model => model.name === modelName);
            if (model) {
                document.getElementById('model-name').innerText = `${model.name}'s Gallery`;

                const gallery = document.getElementById('gallery');
                model.images.forEach((image, index) => {
                    const img = document.createElement('img');
                    img.src = image;
                    img.alt = model.name;
                    img.classList.add('gallery-img');
                    img.dataset.index = index; // Store the index of the image
                    img.addEventListener('click', () => openLightbox(model.images, index)); // Open lightbox on click
                    gallery.appendChild(img);
                });
            } else {
                alert('Model not found!');
            }
        })
        .catch(error => console.error('Error loading model data:', error));
}

// Function to open the lightbox with navigation
function openLightbox(images, currentIndex) {
    // Create the lightbox container
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');

    // Create the lightbox image
    const lightboxImg = document.createElement('img');
    lightboxImg.src = images[currentIndex];
    lightboxImg.classList.add('lightbox-img');

    // Create the close button
    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(lightbox); // Close the lightbox
    });

    // Create the previous button
    const prevButton = document.createElement('button');
    prevButton.classList.add('prev');
    prevButton.innerHTML = '&#10094;';
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        lightboxImg.src = images[currentIndex]; // Update image on click
    });

    // Create the next button
    const nextButton = document.createElement('button');
    nextButton.classList.add('next');
    nextButton.innerHTML = '&#10095;';
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        lightboxImg.src = images[currentIndex]; // Update image on click
    });

    // Append everything to the lightbox
    lightbox.appendChild(closeButton);
    lightbox.appendChild(prevButton);
    lightbox.appendChild(nextButton);
    lightbox.appendChild(lightboxImg);

    // Append the lightbox to the body
    document.body.appendChild(lightbox);
}
