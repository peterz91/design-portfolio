// UNIFIED PROJECT DATA STRUCTURE
const projects = {
    restaurant: {
        title: "Restaurant website",
        description: "Designed a vibrant website and logo for a fictional restaurant in Procida, Italy, drawing inspiration from the island's iconic colorful houses that cascade down to the Mediterranean coastline.",
        demoUrl: "./projects/restaurant.html",
        items: [
            { 
                type: 'hero', 
                src: 'images/bella-vista-showcase-hero.webp' 
            },
            { 
                type: 'desktop-iframe',
                desktop: 'images/restaurant-menu-desktop.webp',
                iframe: './projects/restaurant.html'
            },
            { 
                type: 'desktop', 
                src: 'images/restaurant-our-story-desktop.webp' 
            },
            { 
                type: 'desktop', 
                src: 'images/restaurant-form-desktop.webp' 
            },
            { 
                type: 'desktop', 
                src: 'images/restaurant-contact-desktop.webp' 
            }
        ]
    },
    pricecheck: {
        title: "Price check web app",
        description: "A practical web application for finding the store with cheapest prices based on your shopping list.",
        demoUrl: null, // Coming soon
        items: [
            {
                type: 'mobile-grid',
                items: [
                    'images/pricecheck-mobile-1.webp',
                    'images/pricecheck-mobile-2.webp',
                    'images/pricecheck-mobile-3.webp',
                    'images/pricecheck-mobile-4.webp'
                ]
            }
        ]
    }
};

// Current active project
let currentProject = 'restaurant';

// THEME FUNCTIONALITY
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
}

function initializeTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

// GALLERY RENDERING
function createGalleryItem(item) {
    switch (item.type) {
        case 'hero':
            return `
                <div class="gallery-item hero">
                    <img src="${item.src}" alt="Project hero image" loading="lazy">
                </div>
            `;
        
        case 'desktop':
            return `
                <div class="gallery-item desktop">
                    <img src="${item.src}" alt="Desktop screenshot" loading="lazy">
                </div>
            `;
        
        case 'desktop-iframe':
            return `
                <div class="gallery-desktop-iframe">
                    <div class="gallery-item desktop">
                        <img src="${item.desktop}" alt="Desktop screenshot" loading="lazy">
                    </div>
                    <div class="gallery-item iframe">
                        <div class="scroll-indicator">
                            <span class="scroll-text">Scroll down</span>
                            <div class="scroll-mouse">
                                <div class="scroll-wheel"></div>
                            </div>
                        </div>
                        <iframe src="${item.iframe}" sandbox="allow-same-origin" scrolling="yes" loading="lazy"></iframe>
                    </div>
                </div>
            `;
        
        case 'mobile-grid':
            const mobileItems = item.items.map(src => `
                <div class="gallery-item mobile">
                    <img src="${src}" alt="Mobile screenshot" loading="lazy" onerror="this.style.display='none'; console.warn('Image not found: ${src}');">
                </div>
            `).join('');
            
            return `
                <div class="gallery-mobile-grid">
                    ${mobileItems}
                </div>
            `;
        
        case 'iframe':
            return `
                <div class="gallery-item iframe">
                    <div class="scroll-indicator">
                        <span class="scroll-text">Scroll down</span>
                        <div class="scroll-mouse">
                            <div class="scroll-wheel"></div>
                        </div>
                    </div>
                    <iframe src="${item.src}" sandbox="allow-same-origin" scrolling="yes" loading="lazy"></iframe>
                </div>
            `;
        
        default:
            console.warn('Unknown gallery item type:', item.type);
            return '';
    }
}

function renderProject(projectKey) {
    const project = projects[projectKey];
    if (!project) {
        console.error('Project not found:', projectKey);
        return;
    }
    
    currentProject = projectKey;
    
    // Update description
    const descriptionEl = document.querySelector('.project-description');
    if (descriptionEl) {
        const demoLink = project.demoUrl 
            ? `<span class="live-demo" onclick="openDemo('${projectKey}')">Live demo.</span>`
            : '<span style="color: var(--text-secondary); font-style: italic;">Coming soon!</span>';
        
        descriptionEl.innerHTML = `${project.description} ${demoLink}`;
    }
    
    // Render gallery
    const gallery = document.querySelector('.project-gallery');
    if (gallery) {
        gallery.innerHTML = project.items
            .map(item => createGalleryItem(item))
            .join('');
        
        // Initialize scroll indicators after rendering
        setTimeout(initScrollIndicators, 100);
    }
}

// TAB FUNCTIONALITY
function generateTabs() {
    const tabsContainer = document.querySelector('.nav-tabs');
    if (!tabsContainer) return;
    
    const tabsHTML = Object.entries(projects)
        .map(([key, project]) => `
            <button class="nav-tab ${key === currentProject ? 'active' : ''}" 
                    onclick="switchProject('${key}')" 
                    data-project="${key}">
                ${project.title}
            </button>
        `).join('');
    
    tabsContainer.innerHTML = tabsHTML;
}

function switchProject(projectKey) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-project="${projectKey}"]`)?.classList.add('active');
    
    // Render new project
    renderProject(projectKey);
}

// DEMO OPENING
function openDemo(projectKey) {
    const project = projects[projectKey];
    if (project?.demoUrl) {
        window.open(project.demoUrl, '_blank');
    } else {
        alert(`${project?.title || 'Project'} coming soon!`);
    }
}

// Legacy functions for compatibility
function openRestaurant() {
    openDemo('restaurant');
}

function openPriceCheck() {
    openDemo('pricecheck');
}

// SCROLL INDICATORS
function initScrollIndicators() {
    const scrollIndicators = document.querySelectorAll('.scroll-indicator');
    
    scrollIndicators.forEach(indicator => {
        let hideTimer = null;
        let hasBeenHidden = false;
        
        function hideIndicator() {
            if (!hasBeenHidden) {
                indicator.classList.add('hidden');
                hasBeenHidden = true;
            }
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
        }
        
        // Auto-hide after 3 seconds when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasBeenHidden) {
                    if (!hideTimer) {
                        hideTimer = setTimeout(hideIndicator, 3000);
                    }
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });
        
        observer.observe(indicator);
        
        // Hide on interaction
        const container = indicator.closest('.gallery-item.iframe');
        if (container) {
            ['mousedown', 'touchstart', 'click'].forEach(eventType => {
                container.addEventListener(eventType, hideIndicator, { 
                    passive: true, 
                    once: true 
                });
            });
        }
    });
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Generate tabs and render initial project
    generateTabs();
    renderProject(currentProject);
    
    // Theme system change listener
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!document.documentElement.hasAttribute('data-theme-manual')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // Keyboard accessibility for theme toggle
    document.querySelector('.theme-toggle')?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });
});

// UTILITY FUNCTIONS FOR FUTURE EXPANSION

/**
 * Add a new project to the system
 * @param {string} key - Project key
 * @param {Object} projectData - Project configuration
 */
function addProject(key, projectData) {
    projects[key] = projectData;
    generateTabs();
    console.log(`Project '${key}' added successfully`);
}

/**
 * Remove a project from the system
 * @param {string} key - Project key to remove
 */
function removeProject(key) {
    if (projects[key]) {
        delete projects[key];
        
        // Switch to first available project if current was removed
        if (currentProject === key) {
            const firstProject = Object.keys(projects)[0];
            if (firstProject) {
                renderProject(firstProject);
            }
        }
        
        generateTabs();
        console.log(`Project '${key}' removed successfully`);
    }
}

/**
 * Get project configuration
 * @param {string} key - Project key
 * @returns {Object|null} Project data or null if not found
 */
function getProject(key) {
    return projects[key] || null;
}

/**
 * List all available projects
 * @returns {Array} Array of project keys
 */
function listProjects() {
    return Object.keys(projects);
}