'use strict';

// Видео
const video = {};
video.wrapper = document.querySelector('.process__video');
video.poster = video.wrapper.querySelector('picture');
video.video = document.querySelector('#video');
video.button = document.querySelector('#video-button');


// Карта
const map = document.querySelector('.map__wrapper');

// Верхнее меню
const ESC_KEYCODE = 27;
const body = document.querySelector('body');
const headerOpen = document.querySelector('#button-open');
const headerClose = document.querySelector('#button-close');

// Слайдер
const MAX_PERCENT = 100;
const TOUCH_TRACK = 70;
const TABLE_MAX_WIDTH = 1199;
const MOBILE_MAX_WIDTH = 767;

const slidersList = [];
const sliders = document.querySelectorAll('.slider');

// ПОЛИФИЛ ДЛЯ object-fit
window.objectFitImages();

// Меню
// добавляет классы для корректного отображения закрытого меню
function closeHeaderMenu() {
  headerOpen.addEventListener('click', openHeaderMenu);
  headerClose.removeEventListener('click', closeHeaderMenu);
  document.removeEventListener('keydown', onEscPress);
  body.classList.add('closed-menu-js');
  body.classList.remove('opened-menu-js');
}

// добавляет классы для корректного отображения открытого меню
function openHeaderMenu() {
  headerOpen.removeEventListener('click', openHeaderMenu);
  headerClose.addEventListener('click', closeHeaderMenu);
  document.addEventListener('keydown', onEscPress);
  body.classList.remove('closed-menu-js');
  body.classList.add('opened-menu-js');
}

function onEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeHeaderMenu();
  }
}

closeHeaderMenu();

// Слайдер
// Сборка объекта слайдера
for (let i = 0; i < sliders.length; i++) {
  let slider = {};
  slider.slider = sliders[i];
  slider.sliderList = sliders[i].querySelector('.slider__list');
  slider.slides = sliders[i].querySelectorAll('.slider__item');
  slider.sliderPrev = sliders[i].querySelector('.slider__prev');
  slider.sliderNext = sliders[i].querySelector('.slider__next');
  slider.dots = sliders[i].querySelector('.slider__dot-list');
  slider.dotsList = sliders[i].querySelectorAll('.slider__dot');
  slider.step = slider.slides.length - sliders[i].querySelectorAll('.slider__item--hide').length;
  if (window.matchMedia('(max-width: ' + TABLE_MAX_WIDTH + 'px)').matches) {
    --slider.step;
  }
  if (window.matchMedia('(max-width: ' + MOBILE_MAX_WIDTH + 'px)').matches) {
    slider.step = 1;
  }
  slidersList[i] = slider;
}

// Инициализация и логика слайдера
slidersList.forEach(function (el) {
  function initSlider() {
    let sliderWidth = 0;
    for (let i = 0; i < el.slides.length; i++) {
      sliderWidth += el.slides[i].offsetWidth;
    }
    el.sliderList.style.width = '' + sliderWidth + 'px';
  }

  function nextSlide() {
    openSlides(slideIndex += el.step);
  }

  function prevSlide() {
    openSlides(slideIndex -= el.step);
  }

  function touchSlide() {
    el.sliderList.addEventListener('touchstart', function (evt) {
      let startCoords = evt.changedTouches[0].clientX;
      let endCoords = evt.changedTouches[0].clientX;

      let onMouseMove = function (moveEvt) {
        endCoords = moveEvt.changedTouches[0].clientX;
      };

      let onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        el.slider.removeEventListener('touchmove', onMouseMove);
        el.slider.removeEventListener('touchend', onMouseUp);
        let shift = startCoords - endCoords;
        if (Math.abs(shift) > TOUCH_TRACK) {
          if (shift > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      };

      el.slider.addEventListener('touchmove', onMouseMove);
      el.slider.addEventListener('touchend', onMouseUp);
      el.sliderPrev.addEventListener('touchstart', prevSlide);
      el.sliderNext.addEventListener('touchstart', nextSlide);
    });
  }

  function openSlides(n) {
    if (n > el.slides.length) {
      slideIndex = el.step;
    }
    if (n < 1) {
      slideIndex = el.slides.length;
    }

    slideIndex -= el.step;
    el.slides[0].style.marginLeft = '-' + MAX_PERCENT / el.slides.length * slideIndex + '%';
    slideIndex += el.step;
  }

  initSlider();
  let slideIndex = el.step;
  openSlides(slideIndex);

  el.sliderPrev.addEventListener('click', prevSlide);
  el.sliderNext.addEventListener('click', nextSlide);

  if (window.matchMedia('(max-width: ' + MOBILE_MAX_WIDTH + 'px)').matches) {
    touchSlide();
  }

});

// Карта
const mapCoord = [59.938635, 30.323118];
const mapCoordCenter = [59.938695, 30.323255];
const mapZoom = 17;
const mapIconImageOffset = [8, -152];

if (window.matchMedia('(max-width: ' + TABLE_MAX_WIDTH + 'px)').matches) {
  mapCoordCenter = [59.938595, 30.323355];
  mapZoom = 16;
  mapIconImageOffset = [-20, -59];

  if (window.matchMedia('(max-width: ' + MOBILE_MAX_WIDTH + 'px)').matches) {
    mapCoordCenter = [59.938855, 30.323955];
    mapZoom = 15;
    mapIconImageOffset = [-20, -59];
  }
}

if (map) {
  map.classList.add('map__wrapper--js');

  let init = function () {
    let myMap = new window.ymaps.Map('map', {
      center: mapCoordCenter,
      zoom: mapZoom,
      controls: ['smallMapDefaultSet']
    });

    let myPlacemark = new window.ymaps.Placemark(mapCoord, {
      hintContent: 'Эй, мы здесь!',
      balloonContent: 'Образовательный центр Clever Baby'
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'img/map-pin.svg',
      iconImageSize: [32, 39],
      iconImageOffset: mapIconImageOffset
    });

    myMap.geoObjects.add(myPlacemark);

  };

  window.ymaps.ready(init);

}

// Видео
function initVideo(el) {
  function startVideo(evt) {
    el.wrapper.classList.add('process__video--start-js');
    if (el.poster.parentNode) {
      el.poster.parentNode.removeChild(el.poster);
    }
    el.video.play();
  }

  function pauseVideo() {
    el.wrapper.classList.remove('process__video--start-js');
  }

  el.video.addEventListener('pause', pauseVideo);

  el.video.addEventListener('play', startVideo);

  el.button.addEventListener('click', startVideo);
}

initVideo(video);

