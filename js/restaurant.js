// Clean, optimized restaurant.js - Production ready with clean tablet fix

// Sample menu data
const menuItems = [
    {
        id: 1,
        category: 'appetizers',
        name: 'Truffle Arancini',
        description: 'Crispy risotto balls with truffle oil, parmesan, and fresh herbs',
        price: 14.99,
        image: '../images/menu/truffle-arancini.jpg'
    },
    {
        id: 2,
        category: 'appetizers',
        name: 'Burrata Caprese',
        description: 'Fresh burrata with heirloom tomatoes, basil, and balsamic glaze',
        price: 16.99,
        image: '../images/menu/burrata-caprese.jpg'
    },
    {
        id: 3,
        category: 'appetizers',
        name: 'Antipasto Platter',
        description: 'Selection of cured meats, artisanal cheeses, and marinated vegetables',
        price: 22.99,
        image: '../images/menu/antipasto-platter.jpg'
    },
    {
        id: 4,
        category: 'mains',
        name: 'Osso Buco Milanese',
        description: 'Braised veal shanks with saffron risotto and gremolata',
        price: 34.99,
        image: '../images/menu/osso-buco-milanese.jpg'
    },
    {
        id: 5,
        category: 'mains',
        name: 'Grilled Branzino',
        description: 'Mediterranean sea bass with lemon, capers, and roasted vegetables',
        price: 28.99,
        image: '../images/menu/grilled-branzino.jpg'
    },
    {
        id: 6,
        category: 'mains',
        name: 'Lobster Ravioli',
        description: 'Handmade pasta filled with lobster in a light cream sauce',
        price: 32.99,
        image: '../images/menu/lobster-ravioli.jpg'
    },
    {
        id: 7,
        category: 'mains',
        name: 'Ribeye Fiorentina',
        description: 'Dry-aged ribeye steak with rosemary potatoes and seasonal vegetables',
        price: 42.99,
        image: '../images/menu/ribeye-fiorentina.jpg'
    },
    {
        id: 8,
        category: 'desserts',
        name: 'Tiramisu Classico',
        description: 'Traditional tiramisu with ladyfingers, espresso, and mascarpone',
        price: 9.99,
        image: '../images/menu/tiramisu-classico.jpg'
    },
    {
        id: 9,
        category: 'desserts',
        name: 'Cannoli Siciliani',
        description: 'Crispy shells filled with sweet ricotta and chocolate chips',
        price: 8.99,
        image: '../images/menu/cannoli-siciliani.jpg'
    },
    {
        id: 10,
        category: 'desserts',
        name: 'Panna Cotta',
        description: 'Vanilla panna cotta with seasonal berry compote',
        price: 7.99,
        image: '../images/menu/panna-cotta.jpg'
    },
    {
        id: 11,
        category: 'drinks',
        name: 'House Chianti',
        description: 'Full-bodied Tuscan red wine, perfect with our meat dishes',
        price: 12.99,
        image: '../images/menu/house-chianti.jpg'
    },
    {
        id: 12,
        category: 'drinks',
        name: 'Pinot Grigio',
        description: 'Crisp white wine from Veneto region, pairs well with seafood',
        price: 11.99,
        image: '../images/menu/pinot-grigio.jpg'
    },
    {
        id: 13,
        category: 'drinks',
        name: 'Negroni Sbagliato',
        description: 'Classic Italian cocktail with Campari, sweet vermouth, and prosecco',
        price: 14.99,
        image: '../images/menu/negroni-spagliato.jpg'
    },
    {
        id: 14,
        category: 'drinks',
        name: 'Espresso',
        description: 'Authentic Italian espresso served with lemon twist',
        price: 4.99,
        image: '../images/menu/espresso.jpg'
    }
];

// Reservation storage
let reservations = [];

// Menu state
let showingAllItems = false;
let currentCategory = 'all';

// Simple touch device detection
function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

// Initialize restaurant functionality
function initRestaurant() {
    displayMenu('all');
    initFormValidation();
    initSmoothScrolling();
    setMinDate();
    initParallaxEffect();
}

// Subtle parallax effect for hero image
function initParallaxEffect() {
    const heroImage = document.getElementById('hero-image');
    
    if (!heroImage) return;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;
    
    const throttledParallax = throttle((e) => {
        const { clientX: x, clientY: y } = e;
        const { innerWidth: width, innerHeight: height } = window;
        
        // Calculate movement offset
        const moveX = (x / width - 0.5) * 25;
        const moveY = (y / height - 0.5) * 25;
        
        heroImage.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    }, 16);
    
    document.addEventListener('mousemove', throttledParallax);
    
    // Reset position when mouse leaves
    document.addEventListener('mouseleave', () => {
        heroImage.style.transform = 'translate(0px, 0px) scale(1)';
    });
    
    // Reset when mouse enters hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            heroImage.style.transition = 'transform 0.3s ease';
        });
        
        heroSection.addEventListener('mouseleave', () => {
            heroImage.style.transition = 'transform 0.1s ease-out';
            heroImage.style.transform = 'translate(0px, 0px) scale(1)';
        });
    }
}

// Display menu items - Clean solution using 968px breakpoint
function displayMenu(category) {
    const menuGrid = document.getElementById('menu-grid');
    const filteredItems = category === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === category);

    currentCategory = category;

    // Determine how many items to show initially
    const isMobile = window.innerWidth <= 768;
    const shouldLimitItems = category === 'all' && !showingAllItems && isMobile;
    const itemsToShow = shouldLimitItems ? filteredItems.slice(0, 3) : filteredItems;

    menuGrid.innerHTML = itemsToShow.map((item, index) => {
        const isLastVisibleItem = shouldLimitItems && index === 2;
        return `
            <div class="menu-item" data-category="${item.category}" data-item-id="${item.id}">
                <div class="menu-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="image-placeholder" style="display: none;"></div>
                </div>
                
                <div class="menu-item-overlay">
                    <h3 class="menu-item-name">${item.name}</h3>
                    <span class="menu-item-price">$${item.price}</span>
                </div>
                
                <div class="menu-item-description">
                    <p>${item.description}</p>
                </div>
                
                ${isLastVisibleItem ? `
                    <div class="show-all-overlay" onclick="showAllMenuItems()">
                        <div class="show-all-text">Show All (${filteredItems.length})</div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    // Initialize handlers
    initMenuItemHandlers();
    
    // Only add hover effects on non-touch devices with larger screens
    if (!isTouchDevice() && window.innerWidth > 968) {
        addDesktopHoverEffects();
    }
}

// Show all menu items
function showAllMenuItems() {
    showingAllItems = true;
    displayMenu(currentCategory);
}

// SIMPLE menu item handlers - works for both mobile and desktop
function initMenuItemHandlers() {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;

    // Remove existing listeners by cloning
    const newMenuGrid = menuGrid.cloneNode(true);
    menuGrid.parentNode.replaceChild(newMenuGrid, menuGrid);
    
    // Single click handler for all devices
    newMenuGrid.addEventListener('click', function(e) {
        // Handle show-all overlay
        if (e.target.closest('.show-all-overlay')) {
            return; // Let onclick handle it
        }
        
        // Handle menu item clicks
        const menuItem = e.target.closest('.menu-item');
        if (menuItem) {
            e.preventDefault();
            toggleMenuItemDescription(menuItem);
        }
    });
}

// Toggle menu item description
function toggleMenuItemDescription(menuItem) {
    const description = menuItem.querySelector('.menu-item-description');
    if (!description) return;
    
    const isShowing = description.classList.contains('show');
    
    // Hide all other descriptions
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item !== menuItem) {
            item.querySelector('.menu-item-description').classList.remove('show');
            item.classList.remove('active');
        }
    });
    
    // Toggle this one
    if (isShowing) {
        description.classList.remove('show');
        menuItem.classList.remove('active');
    } else {
        description.classList.add('show');
        menuItem.classList.add('active');
    }
}

// Desktop hover effects - Clean solution using 968px breakpoint  
function addDesktopHoverEffects() {
    // This function now only runs on non-touch devices > 968px
    document.querySelectorAll('.menu-item').forEach(item => {
        if (!item.hasAttribute('data-hover-added')) {
            item.setAttribute('data-hover-added', 'true');
            
            const description = item.querySelector('.menu-item-description');
            
            item.addEventListener('mouseenter', function() {
                description.classList.add('show');
                this.classList.add('active');
            });
            
            item.addEventListener('mouseleave', function() {
                description.classList.remove('show');
                this.classList.remove('active');
            });
        }
    });
}

// Filter menu by category - SIMPLIFIED (no complex height animations)
function filterMenu(category) {
    // Reset showing all items when filtering
    showingAllItems = false;

    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Simply display the new menu - let CSS handle the natural flow
    displayMenu(category);
}

// Mobile menu toggle
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');

    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                document.querySelector('.nav-menu').classList.remove('active');
                document.querySelector('.hamburger').classList.remove('active');
            }
        });
    });
}

// Set minimum date for reservations (today)
function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// Form validation and submission
function initFormValidation() {
    const form = document.getElementById('reservationForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
            submitReservation();
        }
    });
}

// Validate reservation form
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const guests = document.getElementById('guests').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Basic validation
    if (!name || !email || !phone || !guests || !date || !time) {
        showNotification('Please fill in all required fields.', 'error');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showNotification('Please enter a valid phone number.', 'error');
        return false;
    }

    // Date validation (not in the past)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showNotification('Please select a date that is not in the past.', 'error');
        return false;
    }

    // Check if date is Monday (restaurant closed)
    if (selectedDate.getDay() === 1) {
        showNotification('Sorry, we are closed on Mondays. Please select another day.', 'error');
        return false;
    }

    return true;
}

// Submit reservation
function submitReservation() {
    const btn = document.querySelector('#reservationForm .btn-primary');

    // Show loading state
    btn.classList.add('loading');
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        const formData = new FormData(document.getElementById('reservationForm'));
        const reservation = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            guests: formData.get('guests'),
            date: formData.get('date'),
            time: formData.get('time'),
            specialRequests: formData.get('specialRequests') || 'None',
            status: 'confirmed'
        };

        // Store reservation
        reservations.push(reservation);

        // Show success modal
        showSuccessModal(reservation);

        // Reset form
        document.getElementById('reservationForm').reset();
        setMinDate();

        // Reset button state
        btn.classList.remove('loading');
        btn.disabled = false;

    }, 2000);
}

// Show success modal
function showSuccessModal(reservation) {
    const modal = document.getElementById('successModal');
    const message = document.getElementById('confirmationMessage');

    const formattedDate = new Date(reservation.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = formatTime(reservation.time);

    message.innerHTML = `
        <strong>Reservation Details:</strong><br>
        📅 ${formattedDate}<br>
        🕐 ${formattedTime}<br>
        👥 ${reservation.guests} guest(s)<br>
        📧 Confirmation sent to ${reservation.email}
    `;

    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Format time from 24h to 12h format
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
}

// Get directions
function getDirections() {
    const address = "123 Gourmet Street, Culinary District, CD 12345";
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Performance optimization: Throttle function
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced navigation highlighting
function initNavHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to current link
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px 0px 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// Handle window resize - Clean solution
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        document.querySelector('.nav-menu').classList.remove('active');
        document.querySelector('.hamburger').classList.remove('active');

        // Reset showingAllItems when switching to larger screens
        showingAllItems = false;
        displayMenu(currentCategory);
    }
});

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();

        // Hide all menu descriptions
        document.querySelectorAll('.menu-item-description.show').forEach(desc => {
            desc.classList.remove('show');
        });
        
        // Remove active states
        document.querySelectorAll('.menu-item.active').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    initRestaurant();
    initNavHighlighting();

    // Add navigation active styles
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: #2E5BBA !important;
            font-weight: 600;
        }
        .nav-link.active::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: -5px;
            left: 0;
            background: #F39C12;
        }
        
        .hero-image {
            will-change: transform;
            backface-visibility: hidden;
        }
        
        @keyframes logoFadeIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .logo-section {
            animation: logoFadeIn 1s ease-out 0.5s both;
        }
        
        .hero-title {
            animation: logoFadeIn 1s ease-out 0.8s both;
        }
        
        .cta-button {
            animation: logoFadeIn 1s ease-out 1.1s both;
        }
    `;
    document.head.appendChild(style);

    // Enhanced accessibility
    document.querySelectorAll('button, a').forEach(element => {
        element.addEventListener('focus', function () {
            this.style.outline = '2px solid #7DD3C0';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function () {
            this.style.outline = 'none';
        });
    });
});

// OpenStreetMap with Leaflet.js
function initMap() {
    const restaurantLocation = [40.7590, 14.0134];

    const map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: false
    }).setView(restaurantLocation, 16);

    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg?api_key=9ed7428f-a52b-4fb1-9abe-b42ef91ddde1', {
        attribution: '&copy; Stadia Maps &copy; Stamen Design &copy; OpenMapTiles &copy; OpenStreetMap contributors',
        maxZoom: 16
    }).addTo(map);

    const restaurantIcon = L.divIcon({
        html: `
            <div style="
                background: #F39C12; 
                border: 3px solid #ffffff; 
                border-radius: 50%; 
                width: 30px; 
                height: 30px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                font-size: 16px;
            ">🍝</div>
        `,
        className: 'custom-restaurant-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const marker = L.marker(restaurantLocation, { icon: restaurantIcon }).addTo(map);

    marker.bindPopup(`
        <div style="font-family: Georgia, serif; max-width: 250px; text-align: center;">
            <h3 style="margin: 0 0 10px 0; color: #2E5BBA; font-size: 18px;">🇮🇹 Bella Vista</h3>
            <p style="margin: 0; color: #5d4e37; line-height: 1.4;">
                <strong>📍 Costa di Procida</strong><br>
                Authentic Italian cuisine overlooking the Mediterranean<br>
                <em style="color: #F39C12; font-size: 12px;">Serving the flavors of Italy since 1985</em>
            </p>
        </div>
    `).openPopup();

    const mapElement = document.getElementById('map');
    mapElement.style.filter = 'sepia(20%) hue-rotate(180deg) saturate(1.2) brightness(1.05)';
    mapElement.style.borderRadius = '15px';
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initMap, 100);
});

// Fallback display
window.addEventListener('load', () => {
    const mapDiv = document.getElementById('map');
    if (!mapDiv.innerHTML.includes('leaflet')) {
        setTimeout(() => {
            if (!mapDiv.innerHTML.includes('leaflet')) {
                mapDiv.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #7DD3C0, #2E5BBA); color: white; font-family: Georgia, serif; text-align: center; border-radius: 15px;">
                        <div>
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🏝️</div>
                            <h3>Procida Island Location</h3>
                            <p>Beautiful Mediterranean views<br><em>Loading interactive map...</em></p>
                        </div>
                    </div>
                `;
            }
        }, 2000);
    }
});

/* // Scroll detection
window.addEventListener('scroll', function() {
    parent.postMessage('iframe-scrolled', '*');
});

document.addEventListener('click', function() {
    parent.postMessage('iframe-scrolled', '*');
});

document.addEventListener('touchstart', function() {
    parent.postMessage('iframe-scrolled', '*');
}); */