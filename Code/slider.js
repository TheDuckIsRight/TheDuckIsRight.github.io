document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    // const videos = document.querySelectorAll('.slide video'); // Select all videos
    const videos = document.querySelectorAll('video');
    const indicators = document.querySelectorAll('.scroll-indicator');
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndex = 0;

    // Pull-to-Slide Functionality
    slider.addEventListener('mousedown', startDrag);
    slider.addEventListener('touchstart', startDrag);
    slider.addEventListener('mousemove', drag);
    slider.addEventListener('touchmove', drag);
    slider.addEventListener('mouseup', endDrag);
    slider.addEventListener('touchend', endDrag);
    slider.addEventListener('mouseleave', endDrag);

    // Custom Scrollbar Click
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
            updateIndicators();
            playCurrentVideo(); // Play video in the new slide
        });
    });

    function startDrag(e) {
        if (e.type === 'touchstart') {
            startPos = e.touches[0].clientX;
        } else {
            startPos = e.clientX;
        }
        isDragging = true;
        animationID = requestAnimationFrame(animation);
    }

    function drag(e) {
        if (isDragging) {
            let currentPosition;
            if (e.type === 'touchmove') {
                currentPosition = e.touches[0].clientX;
            } else {
                currentPosition = e.clientX;
            }
            const diff = currentPosition - startPos;
            currentTranslate = prevTranslate + diff;
            setSliderPosition();
        }
    }

    function endDrag() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        const movedBy = currentTranslate - prevTranslate;

        // Determine which section to snap to based on pull force
        if (movedBy < -100 && currentIndex < slides.length - 1) {
            currentIndex += 1;
        } else if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }

        updateSlider();
        playCurrentVideo(); // Play video in the new slide
    }

    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    function updateSlider() {
        prevTranslate = -currentIndex * window.innerWidth;
        currentTranslate = prevTranslate;
        setSliderPosition();
        updateIndicators();
    }

    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function playCurrentVideo() {
        // Pause all videos
        videos.forEach(video => video.pause());
        // Play the video in the current slide
        if (videos[currentIndex]) {
            videos[currentIndex].currentTime = 0; // Reset to start
            videos[currentIndex].play(); // Play the video
        }
    }

    function animation() {
        if (isDragging) requestAnimationFrame(animation);
    }

    // Handle window resize for responsiveness
    window.addEventListener('resize', () => {
        updateSlider();
        playCurrentVideo(); // Ensure the correct video plays after resize
    });

    // Initialize with the first video playing
    videos.forEach(video => {
        video.load();
    });
    videos[currentIndex].play();

    // document.addEventListener('click', () => {
    //     videos.forEach(video => {
    //         if (video.paused) {
    //             video.play().catch(error => console.error('Video playback failed on click:', error));
    //         }
    //     });
    // });
});