import Slider from './slider';

const slider = new Slider({
    id: 'slider',
    isControlButtons: true,
    isPagination: true,
    isSwipe: true,
    isAutoSlide: true
});

slider.init();