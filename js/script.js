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
        }, 400);
    }

    const header      = document.querySelector("header");
    const progressBar = document.getElementById("scroll-progress");

    // Unified 60fps Scroll State Handler
    function handleScrollUpdate(scrollY) {
        const sY = scrollY !== undefined ? scrollY : window.scrollY;
        if (header) {
            if (sY > 30) header.classList.add("scrolled");
            else header.classList.remove("scrolled");
        }
        if (progressBar) {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docH > 0 ? (sY / docH) * 100 : 0;
            progressBar.style.width = pct.toFixed(1) + "%";
        }
    }

    /* =========================================
       2. LIGHT / DARK THEME TOGGLE
    ========================================= */
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon   = document.getElementById("themeIcon");
    const htmlEl      = document.documentElement;

    let isLightTheme = localStorage.getItem("theme") === "light";
    htmlEl.setAttribute("data-theme", isLightTheme ? "light" : "dark");
    applyThemeIcon(isLightTheme ? "light" : "dark");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            isLightTheme = !isLightTheme;
            const next = isLightTheme ? "light" : "dark";
            htmlEl.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            applyThemeIcon(next);
        });
    }

    function applyThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.className = theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
        if (themeToggle) {
            themeToggle.title = theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme";
        }
    }

    /* =========================================
       3. LENIS SMOOTH SCROLL FRAMEWORK & NAV JUMP
    ========================================= */
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.0,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 1.5
        });

        // Sync Lenis with GSAP Ticker or RAF loop for 60fps locked scroll
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', (e) => {
                ScrollTrigger.update();
                handleScrollUpdate(e.scroll);
            });
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            lenis.on('scroll', (e) => handleScrollUpdate(e.scroll));
        }
    } else {
        // Native fallback scroll listener
        window.addEventListener("scroll", () => handleScrollUpdate(), { passive: true });
    }

    const sections = document.querySelectorAll('.page-view');
    const navTabs  = document.querySelectorAll('.nav-tab');

    /** Jump directly to section target immediately without intermediate scrolling */
    function scrollToSection(viewName) {
        const clean  = viewName.replace('#', '').replace('-view', '');
        const target = document.getElementById(clean + '-view');
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + (window.pageYOffset || document.documentElement.scrollTop) - headerOffset;

            if (lenis) {
                lenis.scrollTo(offsetPosition, { immediate: true });
            } else {
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'instant'
                });
            }
            setActiveNav(clean);
        }
    }

    /** Toggle the active class on all nav tabs */
    function setActiveNav(viewName) {
        navTabs.forEach(function(tab) {
            var tabView = tab.getAttribute('data-view') || '';
            tab.classList.toggle('active', tabView === viewName);
        });
        if (history.replaceState) {
            history.replaceState(null, '', '#' + viewName);
        }
    }

    /* Attach click listeners to nav tabs and anchor links */
    document.querySelectorAll('a[href^="#"], .nav-tab').forEach(function(link) {
        link.addEventListener('click', function(e) {
            var href = link.getAttribute('href') || ('#' + link.getAttribute('data-view'));
            if (!href || href.charAt(0) !== '#') return;
            var viewName = href.replace('#', '');
            var hasSection = document.getElementById(viewName + '-view');
            if (hasSection || viewName === 'home') {
                e.preventDefault();
                scrollToSection(viewName);
                /* Close mobile menu if open */
                var mobileNav = document.querySelector('.nav-links');
                if (mobileNav) mobileNav.classList.remove('active');
            }
        });
    });

    /* IntersectionObserver: highlights the nav tab whose section is in viewport */
    if ('IntersectionObserver' in window) {
        var sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var viewId = entry.target.id.replace('-view', '');
                    setActiveNav(viewId);
                }
            });
        }, {
            threshold: 0.25,
            rootMargin: '-80px 0px -20% 0px'
        });

        sections.forEach(function(section) {
            sectionObserver.observe(section);
        });
    }

    /* On load: handle hash deep-link or default to home */
    var initHash = window.location.hash.replace('#', '') || 'home';
    if (initHash !== 'home') {
        setTimeout(function() { scrollToSection(initHash); }, 150);
    }
    setActiveNav(initHash);

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

            // Filter project cards — fade out then back in for a premium feel
            projectCards.forEach(card => {
                const matches = filter === "all" || card.classList.contains(filter);
                if (matches) {
                    card.style.display = "flex";
                    // Micro-delay lets display:flex compute before opacity kicks in
                    requestAnimationFrame(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    });
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(8px)";
                    // Hide after transition completes
                    setTimeout(() => { card.style.display = "none"; }, 250);
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

    /* =========================================
       9. SCROLL-REVEAL
       Adds .visible to elements with class .reveal
       when they enter the viewport. CSS in style.css
       handles the actual opacity/transform animation.
       Stagger delay set via --reveal-delay custom property.
    ========================================= */
    const revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target); // animate once
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        revealEls.forEach(el => revealObserver.observe(el));
    }

    /* =========================================
       10. SKILL BAR ANIMATION
       Bars start at 0 in HTML. When the skills
       section enters view, they animate to their
       data-width value. Runs once per page load.
    ========================================= */
    const progressFills = document.querySelectorAll(".progress-fill");
    if (progressFills.length) {
        // Store target widths and reset to 0
        progressFills.forEach(bar => {
            const target = bar.style.width || "0%";
            bar.setAttribute("data-target-width", target);
            bar.style.width = "0%";
        });

        const skillsSection = document.querySelector(".skills-progress");
        if (skillsSection) {
            const skillObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        progressFills.forEach((bar, i) => {
                            const target = bar.getAttribute("data-target-width") || "0%";
                            // Stagger each bar by 100ms
                            setTimeout(() => {
                                bar.style.width = target;
                            }, i * 100);
                        });
                        skillObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });

            skillObserver.observe(skillsSection);
        }
    }

    /* =========================================
       CANVAS PARTICLE PHYSICS SYSTEM
    ========================================= */
    const canvas = document.getElementById("hero-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let mouse = { x: null, y: null, radius: 160 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.density = (Math.random() * 15) + 1;
            }

            draw() {
                ctx.fillStyle = isLightTheme ? "rgba(37, 99, 235, 0.45)" : "rgba(59, 130, 246, 0.6)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = (dx / distance) * force * this.density * 0.35;
                        let directionY = (dy / distance) * force * this.density * 0.35;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 14000), 80);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function connectParticles() {
            if (window.innerWidth <= 768) return; // Skip line connections on mobile for ultra performance
            const strokeStyle = isLightTheme ? "rgba(37, 99, 235," : "rgba(59, 130, 246,";

            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 130) {
                        let opacity = (1 - distance / 130) * 0.25;
                        ctx.strokeStyle = strokeStyle + opacity + ")";
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* =========================================
       CUSTOM CURSOR & MAGNETIC HOVER PHYSICS
    ========================================= */
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    if (cursorDot && cursorOutline && window.innerWidth > 900) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Magnetic Target Hover & GSAP Pull Physics
        const magneticTargets = document.querySelectorAll(".magnetic-target");
        magneticTargets.forEach((target) => {
            target.addEventListener("mouseenter", () => {
                document.body.classList.add("cursor-hover");
            });

            target.addEventListener("mouseleave", () => {
                document.body.classList.remove("cursor-hover");
                if (typeof gsap !== "undefined") {
                    gsap.to(target, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
                }
            });

            target.addEventListener("mousemove", (e) => {
                if (typeof gsap !== "undefined") {
                    const rect = target.getBoundingClientRect();
                    const relX = e.clientX - rect.left - rect.width / 2;
                    const relY = e.clientY - rect.top - rect.height / 2;
                    gsap.to(target, { x: relX * 0.25, y: relY * 0.25, duration: 0.2, ease: "power1.out" });
                }
            });
        });
    }

    // Initialize Lucide icons if loaded
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

});
