// Loader and page transitions
window.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('page-loader');
    const content = document.querySelector('main');

    // Initialize AOS animations - different configs for different pages
    if (document.querySelector('#galleryGrid')) {
        // Homepage specific AOS init
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    } else if (document.querySelector('#reservationForm')) {
        // Reservasi page - simpler AOS to avoid conflicts
        AOS.init({
            duration: 600,
            once: true,
            offset: 50,
            disable: function() {
                // Disable AOS on small screens to prevent conflicts
                return window.innerWidth < 768;
            }
        });
    } else {
        // Other pages - basic AOS
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });
    }
    
    // Pre-load images for smoother experience
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    function hideLoader() {
        if (loader) {
            loader.classList.add('hide');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }
        if (content) {
            content.classList.add('show');
        }
    }
    
    // Check if all images are loaded
    if (images.length > 0) {
        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        hideLoader();
                    }
                });
            }
        });
    } else {
        hideLoader();
    }
    
    // Fallback if images take too long
    setTimeout(hideLoader, 3000);
});

// Contact section interactions
const followUsBtn = document.getElementById('followUsBtn');
const visitUsBtn = document.getElementById('visitUsBtn');
const contactUsBtn = document.getElementById('contactUsBtn');
const contactBoxes = document.getElementById('contactBoxes');
let boxesVisible = false;

followUsBtn.addEventListener('click', () => {
    contactBoxes.classList.toggle('show');
    boxesVisible = !boxesVisible;
});

visitUsBtn.addEventListener('click', () => {
    window.open('https://maps.google.com?q=Jl. Wisata Alam No. 1, Kelong, Indonesia', '_blank');
});

contactUsBtn.addEventListener('click', () => {
    window.open('tel:081111128011', '_self');
});

// Smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load More Gallery Functionality with Reset
function initLoadMoreGallery() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const resetBtn = document.getElementById('resetBtn');
    const hiddenGallery = document.getElementById('hiddenGallery');
    const galleryGrid = document.getElementById('galleryGrid');
    let isLoaded = false;
    
    if (loadMoreBtn && hiddenGallery) {
        // Load More functionality
        loadMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isLoaded) {
                // Add loading state
                this.classList.add('loading');
                this.textContent = 'Loading...';
                
                // Simulate loading delay for better UX
                setTimeout(() => {
                    // Show hidden gallery with animation
                    hiddenGallery.style.display = 'grid';
                    
                    // Trigger animation after display is set
                    setTimeout(() => {
                        hiddenGallery.classList.add('show');
                        
                        // Initialize AOS for new items
                        const newItems = hiddenGallery.querySelectorAll('.load-more-item');
                        newItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.animationDelay = `${index * 0.1}s`;
                            }, 50);
                        });
                    }, 50);
                    
                    // Update button state
                    this.classList.remove('loading');
                    this.classList.add('loaded');
                    this.textContent = 'Semua Foto Telah Dimuat';
                    this.style.cursor = 'not-allowed';
                    this.style.display = 'none'; // Hide Load More button
                    
                    // Show Reset button
                    if (resetBtn) {
                        resetBtn.style.display = 'inline-block';
                        resetBtn.style.opacity = '0';
                        resetBtn.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            resetBtn.style.opacity = '1';
                            resetBtn.style.transform = 'translateY(0)';
                        }, 100);
                    }
                    
                    isLoaded = true;
                    
                    // Scroll to new content smoothly
                    setTimeout(() => {
                        hiddenGallery.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }, 300);
                    
                }, 800); // Loading delay
            }
        });

        // Reset functionality
        if (resetBtn) {
            resetBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add loading state for reset
                this.classList.add('loading');
                this.textContent = 'Resetting...';
                
                setTimeout(() => {
                    // Hide additional images with animation
                    hiddenGallery.classList.remove('show');
                    
                    setTimeout(() => {
                        hiddenGallery.style.display = 'none';
                        
                        // Reset states
                        isLoaded = false;
                        
                        // Show Load More button again
                        loadMoreBtn.style.display = 'inline-block';
                        loadMoreBtn.classList.remove('loaded');
                        loadMoreBtn.textContent = 'Load More';
                        loadMoreBtn.style.cursor = 'pointer';
                        
                        // Hide Reset button
                        this.style.display = 'none';
                        this.classList.remove('loading');
                        this.textContent = 'Reset Gallery';
                        
                        // Scroll back to gallery grid
                        galleryGrid.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                        
                    }, 300);
                    
                }, 500); // Reset delay
            });
        }
    }
}

// Service Row Animation on Scroll
function observeServiceRows() {
    const serviceRows = document.querySelectorAll('.service-row');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    serviceRows.forEach((row) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(50px)';
        row.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(row);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoadMoreGallery();
    observeServiceRows();
    observeGalleryItems();
    initMenuFilter();
    initMenuInteractions();
    observeMenuItems();
});

// Gallery Items Animation
function observeGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    galleryItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Menu filtering functionality
function initMenuFilter() {
    const categoryButtons = document.querySelectorAll('.menu-category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            menuItems.forEach((item, index) => {
                const itemCategory = item.dataset.category;
                
                if (targetCategory === 'all' || itemCategory === targetCategory) {
                    setTimeout(() => {
                        item.classList.remove('hidden');
                        item.style.display = 'block';
                    }, index * 50);
                } else {
                    item.classList.add('hidden');
                    setTimeout(() => {
                        if (item.classList.contains('hidden')) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

// Menu items hover effects and modal functionality
function initMenuInteractions() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const viewBtn = item.querySelector('.menu-view-btn');
        const image = item.querySelector('.menu-image img');
        const title = item.querySelector('.menu-info h3').textContent;
        const description = item.querySelector('.menu-info p').textContent;
        const price = item.querySelector('.menu-price').textContent;
        
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showMenuModal(image.src, title, description, price);
            });
        }
        
        // Click on item to show modal
        item.addEventListener('click', function() {
            showMenuModal(image.src, title, description, price);
        });
    });
}

// Show menu modal
function showMenuModal(imageSrc, title, description, price) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('menuModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'menuModal';
        modal.className = 'menu-modal';
        modal.innerHTML = `
            <div class="menu-modal-content">
                <span class="menu-modal-close">&times;</span>
                <div class="menu-modal-image-container">
                    <img id="menuModalImage" src="" alt="" class="menu-modal-image">
                </div>                <div class="menu-modal-info">
                    <h3 id="menuModalTitle"></h3>
                    <p id="menuModalDescription"></p>
                    <div id="menuModalPrice" class="menu-modal-price"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add modal close functionality
        const closeBtn = modal.querySelector('.menu-modal-close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Update modal content
    document.getElementById('menuModalImage').src = imageSrc;
    document.getElementById('menuModalTitle').textContent = title;
    document.getElementById('menuModalDescription').textContent = description;
    document.getElementById('menuModalPrice').textContent = price;
    
    // Show modal
    modal.style.display = 'flex';
}

// Menu section animation on scroll
function observeMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    console.log('observeMenuItems called, found items:', menuItems.length);
    
    if (menuItems.length === 0) {
        console.log('No menu items found, exiting function');
        return;
    }
    
    // Simple approach: just show all items immediately
    menuItems.forEach((item, index) => {
        console.log('Processing menu item:', index, item);
        
        // Make sure items are visible
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.style.display = 'block';
        item.style.visibility = 'visible';
        
        console.log('Menu item styles set:', {
            opacity: item.style.opacity,
            transform: item.style.transform,
            display: item.style.display,
            visibility: item.style.visibility
        });
    });
}
