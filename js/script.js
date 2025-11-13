// UNIFIED PROJECT DATA STRUCTURE
const projects = {
    pricecheck: {
        title: "Uštedi App",
        description: [
            "Ustedi is an app for finding the store with the cheapest prices based on your shopping list. I designed a straightforward solution: search for items, build a list, see the nearest store with the best prices. I handled everything end-to-end: wireframes, user flows, high-fidelity UI, and a complete Figma design system with accessibility built in. I also designed the core brand.",
            "As I worked through the wireframes and flows, I discovered that even simple interfaces have significant complexity beneath the surface. I ran into edge cases and scenarios I hadn't anticipated. This project taught me the importance of systems thinking rather than just making pretty screens scalable design requires anticipating complexity early and building flexible systems that accommodate real-world use."
        ],
        demoUrl: null, // Coming soon
        items: [
            { 
                type: 'hero', 
                src: 'images/ustedi-hero-thumb.webp',
                fullRes: 'images/ustedi-hero-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/ustedi-screens-lht-thumb.webp',
                fullRes: 'images/ustedi-screens-lht-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/ustedi-screens-drk-thumb.webp',
                fullRes: 'images/ustedi-screens-drk-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/ustedi-wireframes-thumb.webp',
                fullRes: 'images/ustedi-wireframes-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/ustedi-inuse-1-thumb.webp',
                fullRes: 'images/ustedi-inuse-1-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/ustedi-inuse-2-thumb.webp',
                fullRes: 'images/ustedi-inuse-2-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/ustedi-logo-main-thumb.webp',
                fullRes: 'images/ustedi-logo-main-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/ustedi-logo-alternate-thumb.webp',
                fullRes: 'images/ustedi-logo-alternate-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/ustedi-logo-variants-thumb.webp',
                fullRes: 'images/ustedi-logo-variants-full.webp'
            },
        ]
    },
    stmnt_studios: {
        title: "STMNT Studios",
        description: "A website redesign for a video production company in San Francisco. The client wanted more leads from the website so the focus was on CRO principles and best practices.",
        demoUrl: null,
        items: [
            { 
                type: 'hero', 
                src: 'images/stmnt-hero-thumb.webp',
                fullRes: 'images/stmnt-hero-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/stmnt-original-1-thumb.webp',
                fullRes: 'images/stmnt-original-1-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/stmnt-redesign-1-thumb.webp',
                fullRes: 'images/stmnt-redesign-1-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/stmnt-original-2-thumb.webp',
                fullRes: 'images/stmnt-original-2-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/stmnt-redesign-2-thumb.webp',
                fullRes: 'images/stmnt-redesign-2-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/stmnt-redesign-3-thumb.webp',
                fullRes: 'images/stmnt-redesign-3-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/stmnt-redesign-mobile-thumb.webp',
                fullRes: 'images/stmnt-redesign-mobile-full.webp'
            },
        ]
    },
    skyaccess_redesign: {
        title: "SkyAccess Website",
        description: "This was done as a personal project. I took an MVP SaaS website and reimagined it as a high-end service with a modern feel.",
        demoUrl: null, // Coming soon
        items: [
            { 
                type: 'hero', 
                src: 'images/skyaccess-hero-thumb.webp',
                fullRes: 'images/skyaccess-hero-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/skyaccess-original-1-thumb.webp',
                fullRes: 'images/skyaccess-original-1-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/skyaccess-redesign-1-thumb.webp',
                fullRes: 'images/skyaccess-redesign-1-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/skyaccess-original-2-thumb.webp',
                fullRes: 'images/skyaccess-original-2-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/skyaccess-redesign-2-thumb.webp',
                fullRes: 'images/skyaccess-redesign-2-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/skyaccess-original-3-thumb.webp',
                fullRes: 'images/skyaccess-original-3-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/skyaccess-redesign-3-thumb.webp',
                fullRes: 'images/skyaccess-redesign-3-full.webp'
            },
        ]
    }
    /* restaurant: {
        title: "Restaurant website",
        description: "Designed a vibrant website and logo for a fictional restaurant in Procida, Italy, drawing inspiration from the island's iconic colorful houses that cascade down to the Mediterranean coastline.",
        demoUrl: "./projects/restaurant.html",
        items: [
            { 
                type: 'hero', 
                src: 'images/bella-vista-hero-thumb.webp',
                fullRes: 'images/bella-vista-hero-full.webp' 
            },
            { 
                type: 'desktop', 
                src: 'images/bella-vista-whole-page.webp',
                fullRes: 'images/bella-vista-whole-page-full.webp'
            },
            { 
                type: 'desktop', 
                src: 'images/bella-vista-mobile-screens-thumb.webp',
                fullRes: 'images/bella-vista-mobile-screens-full.webp'
            }
        ]
    } */
};

// Current active project - dynamically set to first project
let currentProject = Object.keys(projects)[0];

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
            // Use full-res image for gallery display on screens > 1024px
            const heroGallerySrc = window.innerWidth > 1024 ? (item.fullRes || item.src) : item.src;
            
            return `
                <div class="gallery-item hero">
                    <a href="${item.fullRes || item.src}" 
                       class="clickable-image"
                       data-pswp-width="2560" 
                       data-pswp-height="1440"
                       target="_blank">
                        <img src="${heroGallerySrc}" alt="Project hero image" loading="lazy">
                    </a>
                </div>
            `;
        
        case 'desktop':
            // Desktop always uses thumbnail in gallery, full-res in PhotoSwipe
            return `
                <div class="gallery-item desktop">
                    <a href="${item.fullRes || item.src}" 
                       class="clickable-image"
                       data-pswp-width="3000" 
                       data-pswp-height="2000"
                       target="_blank">
                        <img src="${item.src}" alt="Desktop screenshot" loading="lazy">
                    </a>
                </div>
            `;
        
        default:
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
            : '';
    
        // Handle both string and array descriptions
        let descriptionHTML;
        if (Array.isArray(project.description)) {
            // Join array elements as separate paragraphs
            descriptionHTML = project.description
                .map(paragraph => `<p>${paragraph}</p>`)
                .join('');
        } else {
            // Fallback for old string format
            descriptionHTML = `<p>${project.description}</p>`;
        }
    
        descriptionEl.innerHTML = `${descriptionHTML} ${demoLink}`;
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
                    data-project="${key}"
                    data-project-title="${project.title}">
                ${project.title}
            </button>
        `).join('');
    
    tabsContainer.innerHTML = tabsHTML;
    
    // Initialize arrow navigation after tabs are generated
    initArrowNavigation();
}

// Arrow navigation functionality
function initArrowNavigation() {
    const tabsContainer = document.querySelector('.nav-tabs');
    const leftArrow = document.getElementById('tabArrowLeft');
    const rightArrow = document.getElementById('tabArrowRight');
    
    if (!tabsContainer || !leftArrow || !rightArrow) return;
    
    const scrollAmount = 200; // How much to scroll per click
    
    function updateArrowVisibility() {
        const { scrollLeft, scrollWidth, clientWidth } = tabsContainer;
        
        // Show left arrow when scrolled to the right
        if (scrollLeft > 0) {
            leftArrow.classList.add('visible');
        } else {
            leftArrow.classList.remove('visible');
        }
        
        // Show right arrow when there's more content to scroll
        if (scrollLeft < scrollWidth - clientWidth - 5) { // -5px buffer
            rightArrow.classList.add('visible');
        } else {
            rightArrow.classList.remove('visible');
        }
    }
    
    // Arrow click handlers
    leftArrow.addEventListener('click', () => {
        tabsContainer.scrollLeft -= scrollAmount;
        setTimeout(updateArrowVisibility, 100); // Update after scroll animation
    });
    
    rightArrow.addEventListener('click', () => {
        tabsContainer.scrollLeft += scrollAmount;
        setTimeout(updateArrowVisibility, 100); // Update after scroll animation
    });
    
    // Update arrows on manual scroll (mouse wheel, trackpad)
    tabsContainer.addEventListener('scroll', updateArrowVisibility);
    
    // Update arrows on window resize
    window.addEventListener('resize', updateArrowVisibility);
    
    // Initial arrow state
    setTimeout(updateArrowVisibility, 100); // Small delay to ensure layout is complete
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

function addMobileTouchFeedback() {
    // Only apply on touch devices
    if ('ontouchstart' in window) {
        
        // Arrow buttons feedback
        document.querySelectorAll('.nav-arrow').forEach(arrow => {
            arrow.addEventListener('touchend', function() {
                this.style.background = 'var(--blue-primary)';
                this.style.borderColor = 'var(--bg-secondary)';
                
                setTimeout(() => {
                    this.style.background = '';
                    this.style.borderColor = '';
                }, 300);
            });
        });
        
        // Theme toggle feedback
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('touchend', function() {
                const slider = this.querySelector('.toggle-slider');
                slider.style.background = 'var(--blue-primary)';
                
                setTimeout(() => {
                    slider.style.background = '';
                }, 300);
            });
        }
    }
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

    window.addEventListener('resize', function() {
        // Re-render gallery if screen crosses the 1024px threshold
        renderProject(currentProject);
    });

    addMobileTouchFeedback();
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