export default class Slider {
    constructor(
        {
            id,
            width = '100%',
            isControlButtons = false,
            colorControls = '#fff',
            interval = 5000,
            isPagination = false,
        }
    ) {
        this.$sliderContainer = document.querySelector(`#${id}`);
        this.isControlButtons = isControlButtons;
        this.width = width;
        this.interval = interval;
        this.colorControls = colorControls;
        this.isPagination = isPagination;
        this.$slides = document.querySelectorAll(`#${id} ul > li`);
    }

    getCurrentSlide() {
        return this.$sliderContainer.querySelector(`.active`);
    }

    toggleActiveSlide(current, next) {
        current.classList.remove('active');
        next.classList.add('active');
    }
    
    nextSlide() {
        const currentSlide = this.getCurrentSlide();
        const nextSlide = currentSlide.nextElementSibling ? currentSlide.nextElementSibling : currentSlide.closest('ul').querySelector('li:first-child');
        this.toggleActiveSlide(currentSlide, nextSlide);
    }

    previousSlide() {
        const currentSlide = this.getCurrentSlide();
        const previousSlide = currentSlide.previousElementSibling ? currentSlide.previousElementSibling : currentSlide.closest('ul').querySelector('li:last-child');
        this.toggleActiveSlide(currentSlide, previousSlide);
    }

    autoSlide() {
        let idInterval = setInterval(this.nextSlide.bind(this), this.interval);
        this.$sliderContainer.addEventListener('mouseover', () => {
            return clearInterval(idInterval);
        });
        this.$sliderContainer.addEventListener('mouseout', () => {
            return idInterval = setInterval(this.nextSlide.bind(this), this.interval);
        });
    }

    handlerPaginationButton(nodeSlide) {
        const currentSlide = this.getCurrentSlide();
        this.toggleActiveSlide(currentSlide, nodeSlide);
    }

    createPagination() {
        if(!this.$slides.length) {
            throw new Error('Список слайдов пуст!');
        }

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
        const btnNext = document.createElement('button');
        const btnPrevious = document.createElement('button');
        btnNext.classList.add('slider__button');
        btnPrevious.classList.add('slider__button');

        btnNext.innerHTML = '&#11208;';
        btnPrevious.innerHTML = '&#11207;';
        btnNext.dataset.button = 'next';
        btnPrevious.dataset.button = 'previous';
        btnNext.style.color = this.colorControls;
        btnPrevious.style.color = this.colorControls;
        this.$sliderContainer.append(btnNext, btnPrevious);
    
        btnPrevious.addEventListener('click', this.previousSlide.bind(this));
        btnNext.addEventListener('click', this.nextSlide.bind(this));
    }

    init() {
        this.$sliderContainer.querySelector(`li:first-child`).classList.add('active');

        this.$sliderContainer.style.maxWidth = this.width;

        this.autoSlide();

        if(this.isControlButtons) {
            this.createButtonsControl();
        }

        if(this.isPagination) {
            this.createPagination();
        }
    }
}