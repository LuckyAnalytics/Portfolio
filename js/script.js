document.addEventListener("DOMContentLoaded", () => {

    /* ---------- FOOTER YEAR ---------- */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- NAVBAR SCROLLED STATE ---------- */
    const navbar = document.getElementById("navbar");
    const scrollTopBtn = document.getElementById("scrollTop");

    function handleScrollUI() {
        const scrolled = window.scrollY > 40;
        navbar.classList.toggle("scrolled", scrolled);
        scrollTopBtn.classList.toggle("show", window.scrollY > 500);
    }
    window.addEventListener("scroll", handleScrollUI, { passive: true });
    handleScrollUI();

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ---------- MOBILE MENU ---------- */
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    function closeMobileMenu() {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
    }

    hamburger.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("open");
        hamburger.classList.toggle("open", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileMenu.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    /* ---------- THEME / SETTINGS TOGGLE (accent color cycle) ---------- */
    const themeToggle = document.getElementById("themeToggle");
    const accentThemes = [
        { cyan: "#4fe3d4", bright: "#7bf5e6", blue: "#4a7dff" }, // default cyan
        { cyan: "#a78bfa", bright: "#c4b5fd", blue: "#7c6cff" }, // violet
        { cyan: "#5eead4", bright: "#99f6e4", blue: "#22d3ee" }, // teal
    ];
    let themeIndex = 0;
    themeToggle.addEventListener("click", () => {
        themeIndex = (themeIndex + 1) % accentThemes.length;
        const t = accentThemes[themeIndex];
        document.documentElement.style.setProperty("--cyan", t.cyan);
        document.documentElement.style.setProperty("--cyan-bright", t.bright);
        document.documentElement.style.setProperty("--blue", t.blue);
    });

    /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
    const sections = document.querySelectorAll("main section[id], .hero[id]");
    const navLinks = document.querySelectorAll(".nav-link[data-section]");

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((link) => {
                        link.classList.toggle("active", link.dataset.section === id);
                    });
                }
            });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((sec) => sectionObserver.observe(sec));

    /* ---------- SCROLL REVEAL ANIMATION ---------- */
    const animatedEls = document.querySelectorAll("[data-animate]");
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => entry.target.classList.add("in-view"), delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );
    animatedEls.forEach((el) => revealObserver.observe(el));

    /* ---------- ANIMATED SKILL BARS ---------- */
    const skillRows = document.querySelectorAll(".skill-row");
    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const fill = entry.target.querySelector(".skill-fill");
                    const percent = entry.target.dataset.percent;
                    requestAnimationFrame(() => {
                        fill.style.width = percent + "%";
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );
    skillRows.forEach((row) => skillObserver.observe(row));

    /* ---------- NUMBER COUNTER ANIMATION ---------- */
    function animateCount(el, target, duration = 1400) {
        const start = 0;
        const startTime = performance.now();
        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(start + (target - start) * eased);
            el.textContent = value;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }
        requestAnimationFrame(tick);
    }

    const counters = document.querySelectorAll("[data-count]");
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count, 10);
                    animateCount(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));

    /* ---------- TESTIMONIAL SLIDER ---------- */
    const slides = document.querySelectorAll(".testimonial-slide");
    const dots = document.querySelectorAll(".dot");
    let currentSlide = 0;
    let sliderInterval;

    function showSlide(index) {
        slides.forEach((s, i) => s.classList.toggle("active", i === index));
        dots.forEach((d, i) => d.classList.toggle("active", i === index));
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function startSliderAutoplay() {
        sliderInterval = setInterval(nextSlide, 5000);
    }
    function resetSliderAutoplay() {
        clearInterval(sliderInterval);
        startSliderAutoplay();
    }

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            showSlide(parseInt(dot.dataset.index, 10));
            resetSliderAutoplay();
        });
    });

    if (slides.length) startSliderAutoplay();

    /* ---------- CURSOR GLOW (desktop only) ---------- */
    const cursorGlow = document.getElementById("cursorGlow");
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", (e) => {
            cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        });
    } else {
        cursorGlow.style.display = "none";
    }

    /* ---------- CONTACT FORM VALIDATION ---------- */
    const form = document.getElementById("contactForm");
    const formSuccess = document.getElementById("formSuccess");

    const fields = {
        name: { el: document.getElementById("name"), error: document.getElementById("nameError") },
        email: { el: document.getElementById("email"), error: document.getElementById("emailError") },
        subject: { el: document.getElementById("subject"), error: document.getElementById("subjectError") },
        message: { el: document.getElementById("message"), error: document.getElementById("messageError") },
    };

    function setError(field, msg) {
        field.el.closest(".form-group").classList.toggle("invalid", !!msg);
        field.error.textContent = msg || "";
    }

    function validateForm() {
        let valid = true;

        if (!fields.name.el.value.trim()) {
            setError(fields.name, "Please enter your name.");
            valid = false;
        } else {
            setError(fields.name, "");
        }

        const emailVal = fields.email.el.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal) {
            setError(fields.email, "Please enter your email.");
            valid = false;
        } else if (!emailPattern.test(emailVal)) {
            setError(fields.email, "Please enter a valid email address.");
            valid = false;
        } else {
            setError(fields.email, "");
        }

        if (!fields.subject.el.value.trim()) {
            setError(fields.subject, "Please enter a subject.");
            valid = false;
        } else {
            setError(fields.subject, "");
        }

        if (!fields.message.el.value.trim() || fields.message.el.value.trim().length < 10) {
            setError(fields.message, "Message should be at least 10 characters.");
            valid = false;
        } else {
            setError(fields.message, "");
        }

        return valid;
    }

    if (form) {
        Object.values(fields).forEach(({ el }) => {
            el.addEventListener("input", () => {
                if (el.closest(".form-group").classList.contains("invalid")) validateForm();
            });
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            formSuccess.classList.remove("show");

            if (validateForm()) {
                // Send the mapped contact fields to Google Forms without leaving the portfolio.
                // The hidden iframe is the form target, so this works on static hosting too.
                form.submit();
                formSuccess.classList.add("show");
                form.reset();
                setTimeout(() => formSuccess.classList.remove("show"), 5000);
            }
        });
    }

    /* ---------- DOWNLOAD CV (placeholder — replace href with real PDF) ---------- */
    const downloadCv = document.getElementById("downloadCv");
    downloadCv.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Add your resume PDF to the project and update the Download CV link in index.html.");
    });

});


