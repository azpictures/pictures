// Function to load the list of models
function loadModels() {
    fetch('models.json')
        .then(response => response.json())
        .then(data => {
            const modelsGrid = document.getElementById('models-grid');

            // Empty grid before adding models
            modelsGrid.innerHTML = '';

            // Check if there are models
            if (!data.models || data.models.length === 0) {
                const noModelsMessage = document.createElement('p');
                noModelsMessage.innerText = 'No models found!';
                modelsGrid.appendChild(noModelsMessage);
                return;
            }

            // Create model items and append them to the grid
            data.models.forEach(model => {
                const modelBox = document.createElement('a');
                modelBox.href = `model.html?model=${model.name}`;
                modelBox.classList.add('model-box');
                modelBox.innerText = model.name;
                modelsGrid.appendChild(modelBox);
            });
        })
        .catch(error => {
            console.error('Error loading models:', error);
        });
}

// Function to load the gallery of a specific model
function loadModelGallery() {
    const urlParams = new URLSearchParams(window.location.search);
    const modelName = urlParams.get('model');

    fetch('models.json')
        .then(response => response.json())
        .then(data => {
            const model = data.models.find(model => model.name === modelName);

            // Display error if model is not found
            if (!model) {
                alert('Model not found!');
                return;
            }

            document.getElementById('model-name').innerText = `${model.name}'s Gallery`;

            const gallery = document.getElementById('gallery');
            const toggleButtons = document.querySelectorAll('.toggle-buttons button');

            // Initialize gallery with images
            loadImages(model.images);

            // Set up button functionality
            toggleButtons.forEach(button => {
                button.addEventListener('click', () => {
                    if (button.innerText === "Images") {
                        loadImages(model.images);
                    } else if (button.innerText === "Videos") {
                        loadVideos(model.videos);
                    }

                    // Toggle active class on buttons
                    toggleButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
            });

            function loadImages(images) {
                gallery.innerHTML = ''; // Clear existing content
                images.forEach((image, index) => {
                    const img = document.createElement('img');
                    img.src = image;
                    img.alt = model.name;
                    img.classList.add('gallery-item');
                    img.dataset.index = index;
                    img.dataset.type = "image";
                    img.addEventListener('click', () => openLightbox(model.images, model.videos, index, "image"));
                    gallery.appendChild(img);
                });
            }

            function loadVideos(videos) {
                gallery.innerHTML = ''; // Clear existing content
                videos.forEach((video, index) => {
                    const videoThumb = document.createElement('video');
                    videoThumb.src = video;
                    videoThumb.classList.add('gallery-item', 'video-thumbnail');
                    videoThumb.dataset.index = index;
                    videoThumb.dataset.type = "video";
                    videoThumb.muted = true;
                    videoThumb.loop = true;
                    videoThumb.autoplay = true;
                    videoThumb.addEventListener('click', () => openLightbox(model.images, model.videos, index, "video"));
                    gallery.appendChild(videoThumb);
                });
            }
        })
        .catch(error => console.error('Error loading model data:', error));
}

// Function to open the lightbox with sliding/swiping functionality
function openLightbox(images, videos, currentIndex, type) {
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');

    let mediaElement;
    if (type === "image") {
        mediaElement = document.createElement('img');
        mediaElement.src = images[currentIndex];
        mediaElement.classList.add('lightbox-media');
    } else {
        mediaElement = document.createElement('video');
        mediaElement.src = videos[currentIndex];
        mediaElement.classList.add('lightbox-media');
        mediaElement.controls = true;
    }

    const closeButton = document.createElement('span');
    closeButton.innerText = '×';
    closeButton.classList.add('close');
    closeButton.addEventListener('click', () => {
        lightbox.remove();
    });

    lightbox.appendChild(closeButton);
    lightbox.appendChild(mediaElement);

    document.body.appendChild(lightbox);

    // Add swipe event listener for touch devices
    let startX = 0;
    let endX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].screenX;

        // Detect swipe direction
        if (startX > endX) {
            // Swipe left (next)
            currentIndex = (currentIndex + 1) % (type === "image" ? images.length : videos.length);
        } else if (startX < endX) {
            // Swipe right (previous)
            currentIndex = (currentIndex - 1 + (type === "image" ? images.length : videos.length)) % (type === "image" ? images.length : videos.length);
        }

        // Update media element after swipe
        if (type === "image") {
            mediaElement.src = images[currentIndex];
        } else {
            mediaElement.src = videos[currentIndex];
        }
    });

    // Add click functionality to move between images and videos
    lightbox.addEventListener('click', (e) => {
        // Make sure clicks on media element itself (image/video) are handled
        if (e.target === mediaElement) {
            if (type === "image") {
                currentIndex = (currentIndex + 1) % images.length;
            } else {
                currentIndex = (currentIndex + 1) % videos.length;
            }

            // Update the media element to the next one
            if (type === "image") {
                mediaElement.src = images[currentIndex];
            } else {
                mediaElement.src = videos[currentIndex];
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', loadModels); // This will load models when the page is loaded
