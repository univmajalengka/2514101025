// ========================================
// WEBSITE WISATA GUNUNG BROMO
// JavaScript Interaktif
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // 1. TAHUN COPYRIGHT OTOMATIS
    // ========================================

    const copyright = document.querySelector(".copyright");

    if (copyright) {
        copyright.textContent =
            `© ${new Date().getFullYear()} Wisata Gunung Bromo. Dibuat untuk proyek pembelajaran web.`;
    }

    // ========================================
    // 2. PENANDA NAVIGASI AKTIF
    // ========================================

    const navLinks = Array.from(document.querySelectorAll('header nav a[href^="#"]'));
    const navSections = navLinks
        .map(function (link) {
            return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

    function setActiveNav(sectionId) {
        navLinks.forEach(function (link) {
            if (link.getAttribute("href") === `#${sectionId}`) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    if (navSections.length > 0 && "IntersectionObserver" in window) {
        const navObserver = new IntersectionObserver(
            function (entries) {
                const visibleSections = entries
                    .filter(function (entry) {
                        return entry.isIntersecting;
                    })
                    .sort(function (first, second) {
                        return second.intersectionRatio - first.intersectionRatio;
                    });

                if (visibleSections.length > 0) {
                    setActiveNav(visibleSections[0].target.id);
                }
            },
            {
                rootMargin: "-20% 0px -65% 0px",
                threshold: [0, 0.25, 0.5, 0.75, 1]
            }
        );

        navSections.forEach(function (section) {
            navObserver.observe(section);
        });
    }

    // ========================================
    // 3. SLIDESHOW BERANDA
    // ========================================

    const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
    const heroToggle = document.querySelector(".hero-toggle");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (heroSlides.length > 1 && heroToggle) {
        const slideInterval = 7500;
        let activeSlide = heroSlides.findIndex(function (slide) {
            return slide.classList.contains("is-active");
        });
        let timer = null;
        let isPaused = reducedMotion.matches;

        if (activeSlide < 0) {
            activeSlide = 0;
            heroSlides[activeSlide].classList.add("is-active");
        }

        function updateToggle() {
            heroToggle.textContent = isPaused ? "▶" : "Ⅱ";
            heroToggle.setAttribute(
                "aria-label",
                isPaused ? "Lanjutkan pergantian foto" : "Jeda pergantian foto"
            );
            heroToggle.title = isPaused
                ? "Lanjutkan pergantian foto"
                : "Jeda pergantian foto";
        }

        function showNextSlide() {
            heroSlides[activeSlide].classList.remove("is-active");
            activeSlide = (activeSlide + 1) % heroSlides.length;
            heroSlides[activeSlide].classList.add("is-active");
        }

        function startSlideshow() {
            if (!isPaused && document.visibilityState === "visible" && timer === null) {
                timer = window.setInterval(showNextSlide, slideInterval);
            }
        }

        function stopSlideshow() {
            window.clearInterval(timer);
            timer = null;
        }

        updateToggle();
        startSlideshow();

        heroToggle.addEventListener("click", function () {
            isPaused = !isPaused;
            updateToggle();

            if (isPaused) {
                stopSlideshow();
            } else {
                startSlideshow();
            }
        });

        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "hidden") {
                stopSlideshow();
            } else {
                startSlideshow();
            }
        });
    }


    // ========================================
    // 4. TOMBOL KEMBALI KE ATAS
    // ========================================

    const backToTop = document.createElement("button");

    backToTop.id = "back-to-top";
    backToTop.type = "button";
    backToTop.textContent = "↑";
    backToTop.setAttribute("aria-label", "Kembali ke atas");

    document.body.appendChild(backToTop);

    window.addEventListener("scroll", function () {
        backToTop.classList.toggle("visible", window.scrollY > 350);
    });

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    // ========================================
    // 5. ANIMASI SAAT SCROLL
    // ========================================

    const revealElements = document.querySelectorAll(
        "section h2, .about-container, .destination-card, " +
        ".info-card, .map-container, .package-card, .gallery img, " +
        ".video-container, .social-link"
    );

    revealElements.forEach(function (element) {
        element.classList.add("reveal-on-scroll");
    });

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }


    // ========================================
    // 6. GALERI FOTO UKURAN BESAR
    // ========================================

    const galleryImages = document.querySelectorAll(".gallery img");

    const lightbox = document.createElement("div");
    lightbox.id = "gallery-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Pratinjau foto galeri");

    const lightboxImage = document.createElement("img");
    lightboxImage.alt = "";

    const closeLightbox = document.createElement("button");
    closeLightbox.type = "button";
    closeLightbox.textContent = "×";
    closeLightbox.setAttribute("aria-label", "Tutup foto");

    lightbox.appendChild(lightboxImage);
    lightbox.appendChild(closeLightbox);
    document.body.appendChild(lightbox);

    let previousFocus = null;

    function openLightbox(image) {
        previousFocus = document.activeElement;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        lightbox.classList.add("open");
        closeLightbox.focus();
    }

    function closeLightboxDialog() {
        lightbox.classList.remove("open");
        lightboxImage.removeAttribute("src");

        if (previousFocus) {
            previousFocus.focus();
        }
    }

    galleryImages.forEach(function (image) {
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", "Perbesar foto: " + image.alt);

        image.addEventListener("click", function () {
            openLightbox(image);
        });

        image.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(image);
            }
        });
    });

    closeLightbox.addEventListener("click", closeLightboxDialog);

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightboxDialog();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && lightbox.classList.contains("open")) {
            closeLightboxDialog();
        }
    });


    // ========================================
    // 7. PESAN DI CONSOLE
    // ========================================

    console.log("Website Wisata Gunung Bromo berhasil dimuat!");
    console.log("Fitur interaktif berhasil diinisialisasi.");

});
