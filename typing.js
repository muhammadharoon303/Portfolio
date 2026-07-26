/* ==========================================================
   TYPING ANIMATION
   Muhammad Haroon Khan Portfolio
========================================================== */

const typingElement = document.getElementById("typing");

if (typingElement) {

    const words = [

        "Flutter Applications",
        "Modern Websites",
        "Python Backends",
        "AI Solutions",
        "IoT Systems",
        "ESP32 Projects",
        "Robotics Projects",
        "REST APIs",
        "FastAPI Applications",
        "Mobile Applications",
        "Responsive UI/UX",
        "Full Stack Solutions"

    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {

        const currentWord = words[wordIndex];

        if (!deleting) {

            typingElement.textContent =
                currentWord.substring(0, charIndex + 1);

            charIndex++;

            if (charIndex === currentWord.length) {

                deleting = true;

                setTimeout(typeEffect, 1800);

                return;

            }

        } else {

            typingElement.textContent =
                currentWord.substring(0, charIndex - 1);

            charIndex--;

            if (charIndex === 0) {

                deleting = false;

                wordIndex++;

                if (wordIndex >= words.length) {

                    wordIndex = 0;

                }

            }

        }

        setTimeout(typeEffect, deleting ? 50 : 100);

    }

    typeEffect();

}