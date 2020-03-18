# Adaptive slider
## Commands
    npm run dev
    npm run start
    npm run build

## Slider initialization
    import Slider from './slider';

    const slider = new Slider({
            id = 'slider', // is required
            width = '100%', // Default value
            isControlButtons = false, // Default value
            colorControls = '#fff', // Default value
            interval = 5000, // Default value
            isPagination = false, // Default value
            isSwipe = false, // Default value
            isAutoSlide = false, // Default value
        });

    slider.init();

## HTML structure
    <div class="slider" id="slider">
        <ul class="slider__list-slides">
            ...
            <li class="slider__slide">
                <a class="slider__link" ...>
                    <figure class="slider__wrap-img">
                        <img class="slider__img" ...>
                        <figcaption class="slider__caption">
                            Caption slide
                        </figcaption>
                    </figure>
                </a>
            </li>
            ...
        </ul>
    </div>

\* *Tags \<a>, \<figure> and \<figcaption> no required.*
