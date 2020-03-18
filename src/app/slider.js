export default class Slider {
    constructor(
        {
            id,
            width = '100%',
            isControlButtons = false,
            colorControls = '#fff',
            interval = 5000,
            isPagination = false,
            isSwipe = false,
            isAutoSlide = false,
        }
    ) {
        this.$sliderContainer = document.querySelector(`#${id}`);
        this.isControlButtons = isControlButtons;
        this.width = width;
        this.interval = interval;
        this.colorControls = colorControls;
        this.isPagination = isPagination;
        this.isSwipe = isSwipe;
        this.isAutoSlide = isAutoSlide;
        this.$slides = document.querySelectorAll(`#${id} ul > li`);
        this.delayNextSlide = null;
    }

    getCurrentSlide() {
        return this.$sliderContainer.querySelector(`.active`);
    }

    getNextSlide(currentSlide) {
        return currentSlide.nextElementSibling ? currentSlide.nextElementSibling : this.$slides[0];
    }

    getPrevSlide(currentSlide) {
        return currentSlide.previousElementSibling ? currentSlide.previousElementSibling : this.$slides[this.$slides.length - 1];
    }

    toggleActiveSlide(current, next) {
        current.classList.remove('active');
        next.classList.add('active');
    }

    nextSlide() {
        if(this.delayNextSlide !== null && this.delayNextSlide + 500 >= Date.now()) return;

        this.$slides.forEach((slide) => {
            slide.classList.remove('left');
            slide.classList.remove('right');
        });

        const currentSlide = this.getCurrentSlide();
        const nextSlide = this.getNextSlide(currentSlide);
        const rightSlide = this.getNextSlide(nextSlide);

        nextSlide.classList.add('right');

        this.delayNextSlide = Date.now();

        setTimeout(() => {

            currentSlide.classList.add('left');

            if(this.$slides.length !== 2) {
                rightSlide.classList.add('right');
            }

            this.toggleActiveSlide(currentSlide, nextSlide);

            this.getCurrentSlide().classList.remove('right')

            setTimeout(() => this.$slides.forEach((slide) => {
                slide.classList.remove('left');
            }), 500);

        }, 0);
    }

    previousSlide() {
        if(this.delayNextSlide !== null && this.delayNextSlide + 500 >= Date.now()) return;

        this.$slides.forEach((slide) => {
            slide.classList.remove('left');
            slide.classList.remove('right');
        });
        const currentSlide = this.getCurrentSlide();
        const prevSlide = this.getPrevSlide(currentSlide);
        const leftSlide = this.getPrevSlide(prevSlide);

        prevSlide.classList.add('left');

        this.delayNextSlide = Date.now();

        setTimeout(() => {

            currentSlide.classList.add('right');
            if(this.$slides.length !== 2) {
                leftSlide.classList.add('left');
            }

            this.toggleActiveSlide(currentSlide, prevSlide);

            this.getCurrentSlide().classList.remove('left')

            setTimeout(() => this.$slides.forEach((slide) => {
                slide.classList.remove('right');
            }), 500);

        }, 0);
    }

    handleSwipe() {
        let positionX = null;
        let positionY = null;

        const handleStart = (e) => {
            positionX = e.changedTouches[0].screenX;
            positionY = e.changedTouches[0].screenY;
        };

        const handleEnd = (e) => {
            if (e.changedTouches[0].screenX - positionX > 90 &&
                e.changedTouches[0].screenY - positionY < 200 &&
                e.changedTouches[0].screenY - positionY > -200) {
                this.previousSlide();
            }

            if (e.changedTouches[0].screenX - positionX < -90 &&
                e.changedTouches[0].screenY - positionY < 200 &&
                e.changedTouches[0].screenY - positionY > -200) {
                this.nextSlide();
            }

            positionX = null;
            positionY = null;
        };

        this.$sliderContainer.addEventListener("touchstart", handleStart);
        this.$sliderContainer.addEventListener("touchend", handleEnd);
    }

    autoSlide() {
        let idInterval = setInterval(this.nextSlide.bind(this), this.interval);
        this.$sliderContainer.addEventListener('mouseenter', () => {
            return clearInterval(idInterval);
        });
        this.$sliderContainer.addEventListener('mouseleave', () => {
            return idInterval = setInterval(this.nextSlide.bind(this), this.interval);
        });
    }

    handlerPaginationButton(nodeSlide) {
        if(this.delayNextSlide !== null && this.delayNextSlide + 200 >= Date.now()) return;

        this.$slides.forEach((slide) => {
            slide.classList.remove('left');
            slide.classList.remove('right');
        });
        const currentSlide = this.getCurrentSlide();
        currentSlide.classList.add('opacity_70');

        setTimeout(() => {
            currentSlide.classList.remove('opacity_70');
            this.toggleActiveSlide(currentSlide, nodeSlide);
            this.delayNextSlide = Date.now();
        }, 200);
    }

    createPagination() {
        const paginationList = document.createElement('ol');
        paginationList.classList.add('slider__pagination');
        const paginationItems = [...this.$slides].map((slide) => {
            const paginationButton = document.createElement('button');
            paginationButton.innerHTML = '&#11212;';
            paginationButton.style.color = this.colorControls;
            paginationButton.classList.add('slider__button');

            paginationButton.addEventListener('click', this.handlerPaginationButton.bind(this, slide));

            const paginationItem = document.createElement('li');
            paginationItem.append(paginationButton);

            return paginationItem;
        });

        paginationList.append(...paginationItems);
        this.$sliderContainer.append(paginationList);
    }

    createButtonsControl() {
        const creacteButton = (name, content) => {
            const button = document.createElement('button');
            button.classList.add('slider__button');
            button.dataset.button = name;
            button.innerHTML = content;
            button.style.color = this.colorControls;
            return button;
        };

        const btnNext = creacteButton('next', '&#11208;');
        const btnPrevious = creacteButton('previous', '&#11207;');

        this.$sliderContainer.append(btnPrevious, btnNext);

        btnPrevious.addEventListener('click', this.previousSlide.bind(this));
        btnNext.addEventListener('click', this.nextSlide.bind(this));
    }

    init() {
        if (!this.$slides.length) {
            this.$sliderContainer.classList.add('no_slides');
            this.$sliderContainer.innerHTML = 'Список слайдов пуст!';
            return;
        }

        this.$slides[0].classList.add('active');

        this.$sliderContainer.style.maxWidth = this.width;

        if(this.isAutoSlide && this.$slides.length > 1) {
            this.autoSlide();
        }

        if (this.isControlButtons && this.$slides.length > 1) {
            this.createButtonsControl();
        }

        if (this.isPagination && this.$slides.length > 1) {
            this.createPagination();
        }

        if (this.isSwipe && this.$slides.length > 1) {
            this.handleSwipe();
        }
    }
}