// Gallery Management System
class GalleryManager {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.modal = null;
        this.init();
    }

    init() {
        this.loadImages();
        this.setupGallery();
        this.createModal();
        this.setupEventListeners();
    }

    loadImages() {
        // Load images from data or configuration
        this.images = [
            {
                src: 'assets/img/gallery/automation1.jpg',
                alt: 'Automation Project Setup',
                title: 'Industrial Automation',
                category: 'automation',
                description: 'PLC programming and system integration in industrial automation projects.'
            },
            {
                src: 'assets/img/gallery/software1.jpg',
                alt: '.NET Development Project',
                title: 'Software Development',
                category: 'software',
                description: 'Fullstack .NET application development with modern frameworks.'
            },
            {
                src: 'assets/img/gallery/it-support1.jpg',
                alt: 'IT Support Setup',
                title: 'IT Infrastructure',
                category: 'it',
                description: 'Network configuration and technical support in enterprise environment.'
            },
            {
                src: 'assets/img/gallery/embedded1.jpg',
                alt: 'Embedded Systems Development',
                title: 'Embedded Systems',
                category: 'embedded',
                description: 'Hardware and firmware development for embedded applications.'
            },
            {
                src: 'assets/img/gallery/cloud1.jpg',
                alt: 'Cloud Infrastructure',
                title: 'Cloud Technology',
                category: 'cloud',
                description: 'AWS cloud infrastructure and Docker containerization.'
            },
            {
                src: 'assets/img/gallery/robotics1.jpg',
                alt: 'Robotics Project',
                title: 'Robotics & Automation',
                category: 'robotics',
                description: 'Robotic systems development and automation solutions.'
            }
        ];
    }

    setupGallery() {
        const galleryContainer = document.querySelector('.gallery-grid');
        if (!galleryContainer) return;

        // Clear existing content
        galleryContainer.innerHTML = '';

        // Create gallery items
        this.images.forEach((image, index) => {
            const galleryItem = this.createGalleryItem(image, index);
            galleryContainer.appendChild(galleryItem);
        });

        // Add filter functionality if filter buttons exist
        this.setupFilters();
    }

    createGalleryItem(image, index) {
        const item = document.createElement('div');
        item.className = `gallery-item reveal ${image.category}`;
        item.setAttribute('data-index', index);
        
        item.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <h4>${image.title}</h4>
                    <p>${image.description}</p>
                    <div class="gallery-tags">
                        <span class="tag">${image.category}</span>
                    </div>
                </div>
            </div>
        `;

        // Add click event
        item.addEventListener('click', () => this.openModal(index));

        return item;
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (!filterButtons.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterGallery(filter);
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    filterGallery(filter) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.add('visible');
                }, 100);
            } else {
                item.classList.remove('visible');
                item.style.display = 'none';
            }
        });
    }

    createModal() {
        // Create modal element
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
                <button class="modal-nav modal-prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="modal-nav modal-next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <img class="modal-img" src="" alt="">
                <div class="modal-info">
                    <h3 class="modal-title"></h3>
                    <p class="modal-description"></p>
                    <div class="modal-meta">
                        <span class="modal-index"></span>
                        <span class="modal-category"></span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);

        // Add modal styles if not already added
        if (!document.querySelector('.modal-styles')) {
            const style = document.createElement('style');
            style.className = 'modal-styles';
            style.textContent = `
                .modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 3000;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                
                .modal.active {
                    display: flex;
                    animation: fadeIn 0.3s ease-out;
                }
                
                .modal-content {
                    max-width: 90%;
                    max-height: 90%;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    position: relative;
                    animation: scaleIn 0.3s ease-out;
                }
                
                .modal-img {
                    width: 100%;
                    height: auto;
                    max-height: 70vh;
                    object-fit: contain;
                    display: block;
                }
                
                .modal-info {
                    padding: 1.5rem;
                    background: white;
                }
                
                .modal-title {
                    margin: 0 0 0.5rem 0;
                    color: #333;
                }
                
                .modal-description {
                    color: #666;
                    margin: 0 0 1rem 0;
                    line-height: 1.6;
                }
                
                .modal-meta {
                    display: flex;
                    justify-content: space-between;
                    color: #999;
                    font-size: 0.875rem;
                }
                
                .modal-close, .modal-nav {
                    position: absolute;
                    background: rgba(0, 0, 0, 0.5);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    z-index: 1;
                }
                
                .modal-close:hover, .modal-nav:hover {
                    background: rgba(0, 0, 0, 0.8);
                }
                
                .modal-close {
                    top: 1rem;
                    right: 1rem;
                }
                
                .modal-nav {
                    top: 50%;
                    transform: translateY(-50%);
                }
                
                .modal-prev {
                    left: 1rem;
                }
                
                .modal-next {
                    right: 1rem;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupEventListeners() {
        // Close modal on close button click
        this.modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Navigation arrows
        this.modal.querySelector('.modal-prev').addEventListener('click', () => {
            this.navigate(-1);
        });

        this.modal.querySelector('.modal-next').addEventListener('click', () => {
            this.navigate(1);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    this.navigate(-1);
                    break;
                case 'ArrowRight':
                    this.navigate(1);
                    break;
            }
        });

        // Touch events for mobile swiping
        let touchStartX = 0;
        let touchEndX = 0;

        this.modal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.modal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        // Prevent scrolling when modal is open
        this.modal.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.navigate(1); // Swipe left
            } else {
                this.navigate(-1); // Swipe right
            }
        }
    }

    openModal(index) {
        this.currentIndex = parseInt(index);
        this.updateModal();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Track gallery view
        console.log('Gallery opened:', this.images[this.currentIndex].title);
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Add closing animation
        this.modal.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => {
            this.modal.style.animation = '';
        }, 300);
    }

    navigate(direction) {
        this.currentIndex += direction;
        
        // Loop through images
        if (this.currentIndex < 0) {
            this.currentIndex = this.images.length - 1;
        } else if (this.currentIndex >= this.images.length) {
            this.currentIndex = 0;
        }
        
        this.updateModal();
        
        // Add navigation animation
        const img = this.modal.querySelector('.modal-img');
        img.style.animation = 'fadeIn 0.3s ease-out';
        setTimeout(() => {
            img.style.animation = '';
        }, 300);
    }

    updateModal() {
        const image = this.images[this.currentIndex];
        const modalImg = this.modal.querySelector('.modal-img');
        const modalTitle = this.modal.querySelector('.modal-title');
        const modalDescription = this.modal.querySelector('.modal-description');
        const modalIndex = this.modal.querySelector('.modal-index');
        const modalCategory = this.modal.querySelector('.modal-category');

        modalImg.src = image.src;
        modalImg.alt = image.alt;
        modalTitle.textContent = image.title;
        modalDescription.textContent = image.description;
        modalIndex.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        modalCategory.textContent = image.category.toUpperCase();
    }

    // Additional functionality
    addImage(imageData) {
        this.images.push(imageData);
        this.setupGallery();
    }

    removeImage(index) {
        this.images.splice(index, 1);
        this.setupGallery();
    }

    searchGallery(query) {
        const searchTerm = query.toLowerCase();
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const category = item.classList[1];
            
            if (title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                category.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.add('visible');
            } else {
                item.style.display = 'none';
                item.classList.remove('visible');
            }
        });
    }

    // Export gallery data
    exportGalleryData() {
        return JSON.stringify(this.images, null, 2);
    }

    // Import gallery data
    importGalleryData(data) {
        try {
            this.images = JSON.parse(data);
            this.setupGallery();
            return true;
        } catch (error) {
            console.error('Failed to import gallery data:', error);
            return false;
        }
    }
}

// Initialize gallery manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.gallery-grid')) {
        window.galleryManager = new GalleryManager();
    }
});

// Utility functions for gallery
function downloadImage(src, filename) {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function shareImage(src, title, description) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: description,
            url: src
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${title}: ${description} - ${src}`);
        alert('Link copied to clipboard!');
    }
}