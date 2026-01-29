/**
 * Gallery Manager
 * Handles image gallery functionality including modal view, filtering, and navigation
 */

class GalleryManager {
    constructor() {
        this.gallery = null;
        this.images = [];
        this.filteredImages = [];
        this.categories = new Set(['all']);
        this.currentFilter = 'all';
        this.currentIndex = 0;
        this.modal = null;
        this.isModalOpen = false;
        this.viewMode = 'grid'; // 'grid' or 'list'
        this.sortBy = 'default';
        this.searchTerm = '';
        
        this.defaultConfig = {
            enableFiltering: true,
            enableSearch: true,
            enableSorting: true,
            enableLightbox: true,
            itemsPerPage: 12,
            animationSpeed: 300,
            modalZoom: true,
            modalKeyboardNav: true,
            modalTouchSwipe: true
        };
    }

    init() {
        console.log('🔧 Initializing Gallery Manager...');
        
        this.gallery = document.querySelector('.gallery-grid');
        if (!this.gallery) {
            console.warn('⚠️ Gallery element not found');
            return;
        }
        
        this.loadImages();
        this.setupGallery();
        this.setupControls();
        this.setupModal();
        this.setupEventListeners();
        
        console.log('✅ Gallery Manager Initialized');
        console.log(`📸 Loaded ${this.images.length} images, ${this.categories.size} categories`);
    }

    loadImages() {
        // Get images from gallery items
        const galleryItems = this.gallery.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            if (!img) return;
            
            const imageData = {
                id: index + 1,
                src: img.src,
                alt: img.alt || `Gallery image ${index + 1}`,
                title: item.querySelector('h4')?.textContent || `Image ${index + 1}`,
                description: item.querySelector('p')?.textContent || '',
                category: item.classList[1] || 'uncategorized',
                element: item,
                loaded: false
            };
            
            // Extract category from element classes
            item.classList.forEach(className => {
                if (className !== 'gallery-item' && className !== 'reveal') {
                    imageData.category = className;
                    this.categories.add(className);
                }
            });
            
            this.images.push(imageData);
            
            // Store data attributes
            item.dataset.galleryId = imageData.id;
            item.dataset.category = imageData.category;
            
            // Lazy load image
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
        });
        
        // Set filtered images to all images initially
        this.filteredImages = [...this.images];
    }

    setupGallery() {
        // Add view mode class
        this.gallery.classList.add(`view-${this.viewMode}`);
        
        // Add data attributes for filtering
        this.gallery.dataset.filter = this.currentFilter;
        this.gallery.dataset.view = this.viewMode;
        
        // Initialize animations
        this.initGalleryAnimations();
    }

    setupControls() {
        // Create controls if they don't exist
        if (!document.querySelector('.gallery-controls')) {
            this.createControls();
        }
        
        // Set up filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.filterGallery(filter);
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
        
        // Set up search
        const searchInput = document.querySelector('.gallery-search input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchGallery(e.target.value);
            });
        }
        
        // Set up sorting
        const sortSelect = document.querySelector('.gallery-sort select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortGallery(e.target.value);
            });
        }
        
        // Set up view toggle
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.dataset.view;
                this.toggleView(view);
                
                // Update active button
                viewButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    createControls() {
        const controlsHTML = `
            <div class="gallery-controls">
                <div class="gallery-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    ${Array.from(this.categories)
                        .filter(cat => cat !== 'all')
                        .map(cat => `
                            <button class="filter-btn" data-filter="${cat}">
                                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        `).join('')}
                </div>
                
                <div class="gallery-search">
                    <input type="text" placeholder="Search images..." class="search-input">
                    <button class="search-btn">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                
                <div class="gallery-view">
                    <button class="view-btn active" data-view="grid" title="Grid View">
                        <i class="fas fa-th"></i>
                    </button>
                    <button class="view-btn" data-view="list" title="List View">
                        <i class="fas fa-list"></i>
                    </button>
                </div>
            </div>
        `;
        
        this.gallery.insertAdjacentHTML('beforebegin', controlsHTML);
    }

    setupModal() {
        // Create modal if it doesn't exist
        if (!document.getElementById('gallery-modal')) {
            const modalHTML = `
                <div id="gallery-modal" class="modal gallery-modal">
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
                        
                        <div class="modal-image-container">
                            <img class="modal-image" src="" alt="">
                            <div class="modal-loader">
                                <div class="loading-spinner"></div>
                            </div>
                        </div>
                        
                        <div class="modal-info">
                            <h3 class="modal-title"></h3>
                            <p class="modal-description"></p>
                            <div class="modal-meta">
                                <span class="modal-index"></span>
                                <span class="modal-category"></span>
                            </div>
                            <div class="modal-actions">
                                <button class="modal-action-btn" data-action="download">
                                    <i class="fas fa-download"></i>
                                    Download
                                </button>
                                <button class="modal-action-btn" data-action="share">
                                    <i class="fas fa-share"></i>
                                    Share
                                </button>
                                <button class="modal-action-btn" data-action="zoom">
                                    <i class="fas fa-search-plus"></i>
                                    Zoom
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        this.modal = document.getElementById('gallery-modal');
        
        // Set up modal event listeners
        this.setupModalEvents();
    }

    setupModalEvents() {
        if (!this.modal) return;
        
        // Close button
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Navigation buttons
        const prevBtn = this.modal.querySelector('.modal-prev');
        const nextBtn = this.modal.querySelector('.modal-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.navigateModal(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.navigateModal(1);
            });
        }
        
        // Action buttons
        const actionBtns = this.modal.querySelectorAll('.modal-action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleModalAction(action);
            });
        });
        
        // Keyboard navigation
        if (this.defaultConfig.modalKeyboardNav) {
            document.addEventListener('keydown', (e) => {
                if (!this.isModalOpen) return;
                
                switch(e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.navigateModal(-1);
                        break;
                    case 'ArrowRight':
                        this.navigateModal(1);
                        break;
                }
            });
        }
        
        // Touch/swipe support
        if (this.defaultConfig.modalTouchSwipe && 'ontouchstart' in window) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            this.modal.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            this.modal.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
        }
        
        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    setupEventListeners() {
        // Gallery item click
        this.gallery.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (!galleryItem) return;
            
            e.preventDefault();
            
            const galleryId = parseInt(galleryItem.dataset.galleryId);
            this.openModal(galleryId);
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Lazy load images
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        }
    }

    setupLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('img');
                    if (img && !img.loaded) {
                        // Load image
                        const src = img.dataset.src || img.src;
                        img.src = src;
                        img.loaded = true;
                        
                        // Mark image as loaded
                        const galleryId = parseInt(entry.target.dataset.galleryId);
                        const imageData = this.images.find(img => img.id === galleryId);
                        if (imageData) {
                            imageData.loaded = true;
                        }
                    }
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        
        // Observe all gallery items
        const galleryItems = this.gallery.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            observer.observe(item);
        });
    }

    initGalleryAnimations() {
        // Use IntersectionObserver for reveal animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        const galleryItems = this.gallery.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            observer.observe(item);
        });
    }

    filterGallery(filter) {
        this.currentFilter = filter;
        this.gallery.dataset.filter = filter;
        
        if (filter === 'all') {
            this.filteredImages = [...this.images];
        } else {
            this.filteredImages = this.images.filter(img => img.category === filter);
        }
        
        // Apply search if there's a search term
        if (this.searchTerm) {
            this.filteredImages = this.filteredImages.filter(img => 
                img.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                img.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                img.category.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        
        // Apply sorting
        this.applySorting();
        
        // Render filtered images
        this.renderFilteredImages();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('galleryFilter', {
            detail: { filter, count: this.filteredImages.length }
        }));
        
        console.log(`🔍 Filtered gallery: ${filter} (${this.filteredImages.length} images)`);
    }

    searchGallery(term) {
        this.searchTerm = term.toLowerCase().trim();
        
        // Reset to all filter when searching
        if (this.searchTerm && this.currentFilter !== 'all') {
            this.currentFilter = 'all';
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === 'all') {
                    btn.classList.add('active');
                }
            });
        }
        
        if (!this.searchTerm) {
            this.filterGallery(this.currentFilter);
            return;
        }
        
        this.filteredImages = this.images.filter(img => 
            img.title.toLowerCase().includes(this.searchTerm) ||
            img.description.toLowerCase().includes(this.searchTerm) ||
            img.category.toLowerCase().includes(this.searchTerm)
        );
        
        // Apply sorting
        this.applySorting();
        
        // Render filtered images
        this.renderFilteredImages();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('gallerySearch', {
            detail: { term: this.searchTerm, count: this.filteredImages.length }
        }));
    }

    sortGallery(sortType) {
        this.sortBy = sortType;
        this.applySorting();
        this.renderFilteredImages();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('gallerySort', {
            detail: { sortType }
        }));
    }

    applySorting() {
        switch(this.sortBy) {
            case 'title-asc':
                this.filteredImages.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                this.filteredImages.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'date-newest':
                // Assuming images have date property
                this.filteredImages.sort((a, b) => (b.date || 0) - (a.date || 0));
                break;
            case 'date-oldest':
                this.filteredImages.sort((a, b) => (a.date || 0) - (b.date || 0));
                break;
            case 'category':
                this.filteredImages.sort((a, b) => a.category.localeCompare(b.category));
                break;
            default:
                // Default sorting (by id)
                this.filteredImages.sort((a, b) => a.id - b.id);
        }
    }

    renderFilteredImages() {
        // Clear current gallery
        this.gallery.innerHTML = '';
        
        if (this.filteredImages.length === 0) {
            this.showNoResults();
            return;
        }
        
        // Create gallery items for filtered images
        this.filteredImages.forEach((image, index) => {
            const galleryItem = this.createGalleryItem(image, index);
            this.gallery.appendChild(galleryItem);
        });
        
        // Re-initialize animations
        setTimeout(() => {
            this.initGalleryAnimations();
        }, 50);
        
        // Update gallery info
        this.updateGalleryInfo();
    }

    createGalleryItem(image, index) {
        const item = document.createElement('div');
        item.className = `gallery-item reveal ${image.category}`;
        item.dataset.galleryId = image.id;
        item.dataset.category = image.category;
        item.dataset.index = index;
        
        // Add view mode class
        if (this.viewMode === 'list') {
            item.classList.add('list-view');
        }
        
        const imgSrc = image.loaded ? image.src : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3C/svg%3E';
        
        item.innerHTML = `
            <img src="${imgSrc}" 
                 alt="${image.alt}" 
                 ${!image.loaded ? `data-src="${image.src}"` : ''}
                 loading="lazy">
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
        
        return item;
    }

    showNoResults() {
        this.gallery.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No images found</h3>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
                <button class="btn btn-sm" onclick="window.galleryManager.clearSearch()">
                    Clear Search
                </button>
            </div>
        `;
    }

    updateGalleryInfo() {
        const infoElement = document.querySelector('.gallery-info-count');
        if (!infoElement) return;
        
        infoElement.textContent = `Showing ${this.filteredImages.length} of ${this.images.length} images`;
    }

    toggleView(viewMode) {
        this.viewMode = viewMode;
        this.gallery.dataset.view = viewMode;
        this.gallery.classList.remove('view-grid', 'view-list');
        this.gallery.classList.add(`view-${viewMode}`);
        
        // Update all gallery items
        const galleryItems = this.gallery.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.classList.toggle('list-view', viewMode === 'list');
        });
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('galleryViewChange', {
            detail: { viewMode }
        }));
    }

    openModal(galleryId) {
        if (!this.defaultConfig.enableLightbox) return;
        
        const imageData = this.images.find(img => img.id === galleryId);
        if (!imageData) return;
        
        this.currentIndex = this.filteredImages.findIndex(img => img.id === galleryId);
        if (this.currentIndex === -1) return;
        
        this.isModalOpen = true;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update modal content
        this.updateModalContent(imageData);
        
        // Preload adjacent images
        this.preloadAdjacentImages();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('galleryModalOpen', {
            detail: { imageData, index: this.currentIndex }
        }));
        
        // Track analytics
        if (window.portfolioApp && window.portfolioApp.components.analytics) {
            window.portfolioApp.components.analytics.trackEvent('gallery', 'image_open', imageData.title);
        }
    }

    updateModalContent(imageData) {
        if (!this.modal) return;
        
        const modalImage = this.modal.querySelector('.modal-image');
        const modalTitle = this.modal.querySelector('.modal-title');
        const modalDescription = this.modal.querySelector('.modal-description');
        const modalIndex = this.modal.querySelector('.modal-index');
        const modalCategory = this.modal.querySelector('.modal-category');
        const modalLoader = this.modal.querySelector('.modal-loader');
        
        // Show loader
        if (modalLoader) {
            modalLoader.style.display = 'flex';
        }
        
        // Set image source
        modalImage.src = imageData.src;
        modalImage.alt = imageData.alt;
        
        // Update info
        if (modalTitle) modalTitle.textContent = imageData.title;
        if (modalDescription) modalDescription.textContent = imageData.description;
        if (modalIndex) modalIndex.textContent = `${this.currentIndex + 1} / ${this.filteredImages.length}`;
        if (modalCategory) modalCategory.textContent = imageData.category.toUpperCase();
        
        // Hide loader when image loads
        modalImage.onload = () => {
            if (modalLoader) {
                modalLoader.style.display = 'none';
            }
        };
        
        // Handle image error
        modalImage.onerror = () => {
            if (modalLoader) {
                modalLoader.style.display = 'none';
            }
            modalImage.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="200" y="150" text-anchor="middle" fill="%23999"%3EImage not available%3C/text%3E%3C/svg%3E';
        };
    }

    closeModal() {
        this.isModalOpen = false;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear modal image to free memory
        const modalImage = this.modal.querySelector('.modal-image');
        if (modalImage) {
            modalImage.src = '';
        }
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('galleryModalClose'));
    }

    navigateModal(direction) {
        const newIndex = this.currentIndex + direction;
        
        // Handle wrap-around
        if (newIndex < 0) {
            this.currentIndex = this.filteredImages.length - 1;
        } else if (newIndex >= this.filteredImages.length) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = newIndex;
        }
        
        const imageData = this.filteredImages[this.currentIndex];
        this.updateModalContent(imageData);
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('galleryModalNavigate', {
            detail: { direction, index: this.currentIndex, imageData }
        }));
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.navigateModal(1); // Swipe left
            } else {
                this.navigateModal(-1); // Swipe right
            }
        }
    }

    preloadAdjacentImages() {
        // Preload next and previous images
        const indices = [
            this.currentIndex - 1,
            this.currentIndex + 1
        ].filter(index => index >= 0 && index < this.filteredImages.length);
        
        indices.forEach(index => {
            const imageData = this.filteredImages[index];
            if (imageData && !imageData.loaded) {
                const img = new Image();
                img.src = imageData.src;
                imageData.loaded = true;
            }
        });
    }

    handleModalAction(action) {
        const imageData = this.filteredImages[this.currentIndex];
        if (!imageData) return;
        
        switch(action) {
            case 'download':
                this.downloadImage(imageData);
                break;
            case 'share':
                this.shareImage(imageData);
                break;
            case 'zoom':
                this.toggleZoom();
                break;
        }
    }

    downloadImage(imageData) {
        const link = document.createElement('a');
        link.href = imageData.src;
        link.download = `${imageData.title.replace(/\s+/g, '_')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Track analytics
        if (window.portfolioApp && window.portfolioApp.components.analytics) {
            window.portfolioApp.components.analytics.trackEvent('gallery', 'image_download', imageData.title);
        }
    }

    shareImage(imageData) {
        if (navigator.share) {
            navigator.share({
                title: imageData.title,
                text: imageData.description,
                url: imageData.src
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${imageData.title}: ${imageData.description} - ${imageData.src}`)
                .then(() => {
                    if (window.portfolioApp) {
                        window.portfolioApp.showNotification('Link copied to clipboard!', 'success');
                    }
                })
                .catch(console.error);
        }
        
        // Track analytics
        if (window.portfolioApp && window.portfolioApp.components.analytics) {
            window.portfolioApp.components.analytics.trackEvent('gallery', 'image_share', imageData.title);
        }
    }

    toggleZoom() {
        const modalImage = this.modal.querySelector('.modal-image');
        if (!modalImage) return;
        
        modalImage.classList.toggle('zoomed');
        
        // Update button text
        const zoomBtn = this.modal.querySelector('[data-action="zoom"]');
        if (zoomBtn) {
            const icon = zoomBtn.querySelector('i');
            if (modalImage.classList.contains('zoomed')) {
                icon.className = 'fas fa-search-minus';
                zoomBtn.querySelector('span').textContent = 'Zoom Out';
            } else {
                icon.className = 'fas fa-search-plus';
                zoomBtn.querySelector('span').textContent = 'Zoom';
            }
        }
    }

    handleResize() {
        // Adjust gallery layout based on screen size
        const isMobile = window.innerWidth < 768;
        
        if (isMobile && this.viewMode === 'list') {
            this.toggleView('grid');
            
            // Update view buttons
            const viewButtons = document.querySelectorAll('.view-btn');
            viewButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.view === 'grid') {
                    btn.classList.add('active');
                }
            });
        }
    }

    clearSearch() {
        const searchInput = document.querySelector('.gallery-search input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.searchTerm = '';
        this.filterGallery(this.currentFilter);
    }

    addImage(imageData) {
        // Generate unique ID
        imageData.id = this.images.length + 1;
        imageData.loaded = false;
        
        // Add category
        if (imageData.category) {
            this.categories.add(imageData.category);
        }
        
        this.images.push(imageData);
        this.filteredImages.push(imageData);
        
        // Update controls if they exist
        this.updateFilterButtons();
        
        // Render new image
        this.renderFilteredImages();
        
        console.log(`➕ Added image: ${imageData.title}`);
    }

    updateFilterButtons() {
        const filtersContainer = document.querySelector('.gallery-filters');
        if (!filtersContainer) return;
        
        // Get current categories
        const currentCategories = Array.from(this.categories);
        const existingFilters = Array.from(filtersContainer.querySelectorAll('.filter-btn'))
            .map(btn => btn.dataset.filter);
        
        // Add new category buttons
        currentCategories.forEach(category => {
            if (!existingFilters.includes(category) && category !== 'all') {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.dataset.filter = category;
                button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                
                button.addEventListener('click', () => {
                    this.filterGallery(category);
                    
                    // Update active button
                    const filterButtons = document.querySelectorAll('.filter-btn');
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
                
                filtersContainer.appendChild(button);
            }
        });
    }

    getGalleryStats() {
        return {
            totalImages: this.images.length,
            filteredImages: this.filteredImages.length,
            categories: Array.from(this.categories),
            currentFilter: this.currentFilter,
            viewMode: this.viewMode,
            sortBy: this.sortBy
        };
    }

    destroy() {
        // Clean up event listeners
        window.removeEventListener('resize', this.handleResize);
        
        // Close modal if open
        if (this.isModalOpen) {
            this.closeModal();
        }
        
        // Remove modal from DOM
        if (this.modal && this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
        }
        
        console.log('🧹 Gallery Manager Cleaned Up');
    }
}

// Make gallery manager globally accessible for debugging
if (typeof window !== 'undefined') {
    window.GalleryManager = GalleryManager;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryManager;
}