'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')
const nav = document.querySelector('.nav')


///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(element => {
  element.addEventListener('click', openModal)
});

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});



btnScrollTo.addEventListener('click', (e) => {
  section1.scrollIntoView({ behavior: 'smooth' })
  // OLD WAY :
  // const s1Coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // })
})

// Page Navigation
// NOTE
// we 've used event delegation to enhance performance
// instead of attaching event to each link we attached it to the parent
// and then make use of bubbling phase to check which link is used

document.querySelector('.nav__links').addEventListener('click',
  function (e) {
    const element = e.target

    // matching links to ignore any other clicks
    if (element.classList.contains('nav__link')) {
      e.preventDefault()
      document.querySelector(element.getAttribute('href'))
        .scrollIntoView({ behavior: 'smooth' })
    }
  }
)


// Tabbed Component
tabsContainer.addEventListener('click', (e) => {
  const element = e.target.closest('.operations__tab');

  // Guard Clause
  if (!element) return;

  // Active tab
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  element.classList.add('operations__tab--active');

  // Active content
  document.querySelectorAll(`.operations__content`)
    .forEach(el => el.classList.remove('operations__content--active'))

  document.querySelector(`.operations__content--${element.dataset.tab
    }`).classList.add('operations__content--active')
})


// Menu Fade Animation
const handleHover = function (e) {
  const link = e.target
  if (link.classList.contains('nav__link')) {
    const siblings = link.closest('.nav__links').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')
    siblings.forEach(el => { if (el !== link) el.style.opacity = this })
    logo.style.opacity = this;
  }
}
nav.addEventListener('mouseover', handleHover.bind(0.7))
nav.addEventListener('mouseout', handleHover.bind(1))






// =======================

