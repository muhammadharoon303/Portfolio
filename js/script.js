/* =========================================================
   MUHAMMAD HAROON PORTFOLIO
   JAVASCRIPT: ROUTER, ROW SLIDERS & INTERACTIVE UI
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. PRELOADER & STICKY HEADER
    ========================================= */
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
        }, 500);
    }

    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header?.classList.add("scrolled");
        } else {
            header?.classList.remove("scrolled");
        }
    });

    /* =========================================
       2. MOBILE NAVBAR TOGGLE
    ========================================= */
    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            menuBtn.classList.toggle("active");
        });
    }

    /* =========================================
       3. SINGLE PAGE APPLICATION (SPA) ROUTER
    ========================================= */
    const pageViews = document.querySelectorAll(".page-view");
    const navTabs = document.querySelectorAll(".nav-tab");

    function switchView(targetViewId) {
        // Sanitize target ID
        let cleanId = targetViewId.replace("#", "").replace("-view", "");
        
        // Default fallback to home
        let targetView = document.getElementById(`${cleanId}-view`);
        if (!targetView) {
            cleanId = "home";
            targetView = document.getElementById("home-view");
        }

        // Hide all views & show active
        pageViews.forEach(view => {
            view.classList.remove("active");
        });
        targetView?.classList.add("active");

        // Update Nav Tabs Active State
        navTabs.forEach(tab => {
            tab.classList.remove("active");
            const tabView = tab.getAttribute("data-view") || tab.getAttribute("href")?.replace("#", "");
            if (tabView === cleanId) {
                tab.classList.add("active");
            }
        });

        // Close Mobile Menu if open
        navLinks?.classList.remove("active");

        // Scroll to top cleanly
        window.scrollTo({ top: 0, behavior: "instant" });

        // Update URL Hash without triggering jump
        if (history.pushState) {
            history.pushState(null, "", `#${cleanId}`);
        } else {
            location.hash = `#${cleanId}`;
        }
    }

    // Attach click listeners to all router links
    document.querySelectorAll('a[href^="#"], .nav-tab').forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href") || `#${link.getAttribute("data-view")}`;
            if (href && href.startsWith("#")) {
                const targetViewId = href.replace("#", "");
                // Only prevent default if target corresponds to a page-view
                if (document.getElementById(`${targetViewId}-view`) || targetViewId === "home") {
                    e.preventDefault();
                    switchView(targetViewId);
                }
            }
        });
    });

    // Handle Browser Back/Forward buttons
    window.addEventListener("hashchange", () => {
        const hash = window.location.hash.replace("#", "") || "home";
        switchView(hash);
    });

    // Initial Load Router Check
    const initialHash = window.location.hash.replace("#", "") || "home";
    switchView(initialHash);

    /* =========================================
       4. ROW SLIDERS LOGIC (PREV / NEXT SCROLL)
    ========================================= */
    function initSliderControls(trackId, prevBtnId, nextBtnId) {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (!track || !prevBtn || !nextBtn) return;

        const getScrollAmount = () => {
            const card = track.querySelector(".slider-card");
            return card ? card.offsetWidth + 24 : 380;
        };

        nextBtn.addEventListener("click", () => {
            track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
        });

        prevBtn.addEventListener("click", () => {
            track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
        });
    }

    // Initialize Academic and Projects Sliders
    initSliderControls("academic-track", "academic-prev", "academic-next");
    initSliderControls("projects-track", "projects-prev", "projects-next");

    /* =========================================
       5. PROJECTS CATEGORY FILTER & VIEW ALL TOGGLE
    ========================================= */
    const filterButtons = document.querySelectorAll(".project-filter .filter-btn");
    const projectCards = document.querySelectorAll("#projects-track .project-card");
    const viewAllContainer = document.getElementById("viewAllProjectsContainer");
    const viewAllBtn = document.getElementById("viewAllProjectsBtn");
    const projectsTrack = document.getElementById("projects-track");
    const projectsPrevBtn = document.getElementById("projects-prev");
    const projectsNextBtn = document.getElementById("projects-next");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.getAttribute("data-filter");

            // Filter project cards
            projectCards.forEach(card => {
                if (filter === "all" || card.classList.contains(filter)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });

            // Show 'View All' button ONLY when 'All' category is selected
            if (viewAllContainer) {
                if (filter === "all") {
                    viewAllContainer.style.display = "flex";
                } else {
                    viewAllContainer.style.display = "none";
                    // Reset grid mode when switching to specific categories
                    projectsTrack?.classList.remove("grid-mode");
                    if (projectsPrevBtn) projectsPrevBtn.style.display = "flex";
                    if (projectsNextBtn) projectsNextBtn.style.display = "flex";
                    if (viewAllBtn) {
                        viewAllBtn.innerHTML = `<i class="fa-solid fa-grid-2"></i> View All Projects`;
                    }
                }
            }

            // Scroll track back to start after filtering
            if (projectsTrack) projectsTrack.scrollLeft = 0;
        });
    });

    // Toggle Grid Mode vs Slider Mode when clicking View All Projects
    if (viewAllBtn && projectsTrack) {
        viewAllBtn.addEventListener("click", () => {
            const isGridMode = projectsTrack.classList.toggle("grid-mode");

            if (isGridMode) {
                viewAllBtn.innerHTML = `<i class="fa-solid fa-layer-group"></i> Slider View`;
                if (projectsPrevBtn) projectsPrevBtn.style.display = "none";
                if (projectsNextBtn) projectsNextBtn.style.display = "none";
            } else {
                viewAllBtn.innerHTML = `<i class="fa-solid fa-grid-2"></i> View All Projects`;
                if (projectsPrevBtn) projectsPrevBtn.style.display = "flex";
                if (projectsNextBtn) projectsNextBtn.style.display = "flex";
                projectsTrack.scrollLeft = 0;
            }
        });
    }

    /* =========================================
       6. TYPING EFFECT
    ========================================= */
    const typingElement = document.getElementById("typing");
    if (typingElement) {
        const words = [
            "Software Engineer",
            "Flutter Mobile Developer",
            "FastAPI Backend Developer",
            "Agentic AI Engineer",
            "IoT & Hardware Systems",
            "UI/UX Product Designer"
        ];

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 40 : 90;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    /* =========================================
       7. CONTACT FORM SUBMISSION HANDLER
    ========================================= */
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector("button[type='submit']");
            if (submitBtn) {
                submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Message Sent Successfully!`;
                submitBtn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = `Send Message <i class="fa-solid fa-paper-plane"></i>`;
                    submitBtn.style.background = "";
                }, 3500);
            }
        });
    }

    /* =========================================
       8. CURRENT YEAR
    ========================================= */
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

});