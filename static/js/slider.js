document.addEventListener('DOMContentLoaded', function () {
    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide-item');
    let currentHeroSlide = 0;
    const heroSlideInterval = 5000; // 5 seconds

    function nextHeroSlide() {
        heroSlides[currentHeroSlide].classList.remove('active');
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        heroSlides[currentHeroSlide].classList.add('active');
    }

    if (heroSlides.length > 0) {
        heroSlides[0].classList.add('active');
        setInterval(nextHeroSlide, heroSlideInterval);
    }

    // About Slider
    const aboutSlides = document.querySelectorAll('.about-slide-item');
    let currentAboutSlide = 0;
    const aboutSlideInterval = 5000; // 5 seconds

    function nextAboutSlide() {
        aboutSlides[currentAboutSlide].classList.remove('active');
        currentAboutSlide = (currentAboutSlide + 1) % aboutSlides.length;
        aboutSlides[currentAboutSlide].classList.add('active');
    }

    if (aboutSlides.length > 0) {
        aboutSlides[0].classList.add('active');
        setInterval(nextAboutSlide, aboutSlideInterval);
    }
});

