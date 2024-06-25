/*=============== SHOW MENU ===============*/
const navEl = document.querySelector('.nav');
const hamburgerEl = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.primary .nav__link');

hamburgerEl.addEventListener('click', () => {
    navEl.classList.toggle('nav--open');
    hamburgerEl.classList.toggle('hamburger--open');
});

navLinks.forEach(navLink => {
    navLink.addEventListener('click', () => {
        navEl.classList.remove('nav--open');
        hamburgerEl.classList.remove('hamburger--open');
    });
});

window.addEventListener('click', (e) => {
    const clicked = e.target;
    const headerContent = document.querySelector('.header__content');
    if(!navEl.contains(clicked) && !hamburgerEl.contains(clicked) && !headerContent.contains(clicked)) {
        navEl.classList.remove('nav--open');
        hamburgerEl.classList.remove('hamburger--open');
    } 
});

/*=============== HIGHLIGHT NAV ITEMS ===============*/
const highlightNav = () => {
    const sectionsEl = document.querySelectorAll('section');
    const top = window.scrollY;

    navLinks.forEach(link => {
        link.classList.remove('active--link');
    });

    sectionsEl.forEach(section => {
        const offset = section.offsetTop;
        const height = section.offsetHeight;
        
        if(top >= offset - 150 && top < offset + height - 150 ) {
            const id = '#' + section.getAttribute('id');
            document.querySelector(`a[href="${id}"]`).classList.add('active--link');
        };
});
};

window.addEventListener('scroll', highlightNav);

/*=============== FIXED HEADER ===============*/
const fixedHeader = () => {
    const header = document.querySelector('.header');
    const primaryNav = document.querySelector('.nav');
    const headerContent = document.querySelector('.header__content');
    // When the scroll is greater than 50 viewport height, add the fixed class to the header tag
    // this.scrollY >= 60 ? header.classList.add('fixed') : header.classList.remove('fixed');
    if(this.scrollY >= 60) {
        header.classList.add('fixed');
        primaryNav.classList.add('fixedNav');
        headerContent.classList.add('fixedPadding');
    } else {
        header.classList.remove('fixed');
        primaryNav.classList.remove('fixedNav');
        headerContent.classList.remove('fixedPadding');
    }
};
window.addEventListener('scroll', fixedHeader);

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						: scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)


/*=============== DRAGGABLE CARD SLIDER ===============*/ 
const carousel = document.querySelector('.carousel');
const container = document.querySelector('.agents .container');
const sliderButtons = document.querySelectorAll('.slider--btn');
const slideWidth = carousel.querySelector('.carousel .box').offsetWidth;
const carouselChildren = [...carousel.children];

let isDragging = false, startX, startScrollLeft, timeoutId;

// Get the number of boxes that can fit in the carousel at once
let boxPerView = Math.round(carousel.offsetWidth / slideWidth);

// Insert copies of the last few boxes to beginning of carousel for infinite scrolling
carouselChildren.slice(-boxPerView).reverse().forEach(child => {
    carousel.insertAdjacentHTML('afterbegin', child.outerHTML);
});

// Insert copies of the first few boxes to end of carousel for infinite scrolling
carouselChildren.slice(0, boxPerView).forEach(child => {
    carousel.insertAdjacentHTML('beforeend', child.outerHTML);
});

// Add event listeners for the slider buttons to scroll the carousel prev and next
sliderButtons.forEach(sliderButton => {
    sliderButton.addEventListener('click', (e) => {
        carousel.scrollLeft += sliderButton.id === 'prev' ? -slideWidth : slideWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add('dragging');
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
    if(!isDragging) return; // if isDraggin is false return frome here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove('dragging');
};

const autoPlay = () => {
    if(window.innerWidth < 769) return; // Return if window is smaller than 769
    // AutoPlay the carousel after every 2.5 seconds
    timeoutId = setTimeout(() => carousel.scrollLeft += slideWidth, 2500);
};

autoPlay();

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0) {
        carousel.classList.add('no-transition');
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove('no-transition');
    }
    // If the carousel is at the end, scroll to the beginning
    else if(carousel.scrollLeft === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add('no-transition');
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove('no-transition');
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!carousel.matches(':hover')) autoPlay();
};

carousel.addEventListener('mousedown', dragStart);
carousel.addEventListener('mousemove', dragging);
document.addEventListener('mouseup', dragStop);
carousel.addEventListener('scroll', infiniteScroll);
carousel.addEventListener('mouseenter', () => clearTimeout(timeoutId));
carousel.addEventListener('mouseleave', autoPlay);