function loadModels() {
    fetch('models.json')
        .then(response => response.json())
        .then(data => {
            const modelsGrid = document.getElementById('models-grid');
            modelsGrid.innerHTML = '';

            if (!data.models || data.models.length === 0) {
                modelsGrid.innerHTML = '<p>No models found!</p>';
                return;
            }

            data.models.forEach(model => {
                const modelBox = document.createElement('a');
                modelBox.href = `model.html?model=${model.name}`;
                modelBox.classList.add('model-box');
                modelBox.innerText = model.name;
                modelsGrid.appendChild(modelBox);
            });
        })
        .catch(error => console.error('Error loading models:', error));
}

function loadModelGallery() {
    const modelName = new URLSearchParams(window.location.search).get('model');

    fetch('models.json')
        .then(response => response.json())
        .then(data => {
            const model = data.models.find(m => m.name === modelName);
            if (!model) return alert('Model not found!');

            document.getElementById('model-name').innerText = `${model.name}'s Gallery`;
            const gallery = document.getElementById('gallery');
            loadImages(model.images);

            document.querySelectorAll('.toggle-buttons button').forEach(button => {
                button.addEventListener('click', () => {
                    gallery.innerHTML = '';
                    button.classList.add('active');
                    button.innerText === "Images" ? loadImages(model.images) : loadVideos(model.videos);
                });
            });

            function loadImages(images) {
                gallery.innerHTML = '';
                images.forEach((src, index) => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.dataset.index = index;
                    img.addEventListener('click', () => openLightbox(images, index, "image"));
                    gallery.appendChild(img);
                });
            }

            function loadVideos(videos) {
                gallery.innerHTML = '';
                videos.forEach((src, index) => {
                    const vid = document.createElement('video');
                    vid.src = src;
                    vid.classList.add('video-thumbnail');
                    vid.muted = vid.loop = vid.autoplay = true;
                    vid.addEventListener('click', () => openLightbox(videos, index, "video"));
                    gallery.appendChild(vid);
                });
            }
        });
}

function openLightbox(media, index, type) {
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');

    let mediaElement = document.createElement(type === "image" ? 'img' : 'video');
    mediaElement.src = media[index];
    mediaElement.classList.add('lightbox-media');
    if (type === "video") mediaElement.controls = true;

    // Close button
    const closeButton = document.createElement('span');
    closeButton.innerText = '×';
    closeButton.classList.add('close');
    closeButton.addEventListener('click', () => lightbox.remove());

    // Prev & Next Buttons
    const prevButton = document.createElement('span');
    prevButton.innerText = '❮';
    prevButton.classList.add('prev');
    prevButton.addEventListener('click', () => {
        index = (index - 1 + media.length) % media.length;
        mediaElement.src = media[index];
    });

    const nextButton = document.createElement('span');
    nextButton.innerText = '❯';
    nextButton.classList.add('next');
    nextButton.addEventListener('click', () => {
        index = (index + 1) % media.length;
        mediaElement.src = media[index];
    });

    lightbox.append(closeButton, mediaElement, prevButton, nextButton);
    document.body.append(lightbox);

    // Always show buttons on mobile with transparent background
    prevButton.style.display = 'block';
    nextButton.style.display = 'block';
    prevButton.style.background = 'rgba(0, 0, 0, 0.5)';
    nextButton.style.background = 'rgba(0, 0, 0, 0.5)';

    // Hide or show buttons based on screen size (for better UX)
    if (window.innerWidth < 768) {
        prevButton.style.display = 'block';
        nextButton.style.display = 'block';
    } else {
        prevButton.style.display = 'block';
        nextButton.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', loadModels);
