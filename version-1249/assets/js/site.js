(function () {
  var navButton = document.querySelector('.mobile-nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (navButton && mobileNav) {
    navButton.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      navButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function setupHero() {
    var hero = document.querySelector('.hero-carousel');

    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var previous = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-target-slide')) || 0);
        schedule();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        showSlide(activeIndex - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(activeIndex + 1);
        schedule();
      });
    }

    showSlide(0);
    schedule();
  }

  function setupFilters() {
    var filterInput = document.querySelector('.filter-input');
    var filterSelects = Array.prototype.slice.call(document.querySelectorAll('.filter-select'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));
    var count = document.querySelector('[data-result-count]');
    var emptyState = document.querySelector('[data-empty-state]');

    if (!cards.length) {
      return;
    }

    function getInitialQuery() {
      var params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    }

    function cardText(card) {
      return [
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-type'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-category'),
        card.textContent
      ].join(' ').toLowerCase();
    }

    function applyFilters() {
      var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
      var selected = {};

      filterSelects.forEach(function (select) {
        var field = select.getAttribute('data-filter-field');
        selected[field] = select.value;
      });

      var visible = 0;

      cards.forEach(function (card) {
        var matchesQuery = !query || cardText(card).indexOf(query) !== -1;
        var matchesSelects = Object.keys(selected).every(function (field) {
          return !selected[field] || card.getAttribute('data-' + field) === selected[field];
        });
        var shouldShow = matchesQuery && matchesSelects;

        card.hidden = !shouldShow;

        if (shouldShow) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = '共 ' + visible + ' 部影片';
      }

      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    if (filterInput) {
      filterInput.value = getInitialQuery();
      filterInput.addEventListener('input', applyFilters);
    }

    filterSelects.forEach(function (select) {
      select.addEventListener('change', applyFilters);
    });

    applyFilters();
  }

  function setupImageFallbacks() {
    var images = Array.prototype.slice.call(document.querySelectorAll('img[data-fallback-title]'));

    images.forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('image-error');

        if (image.parentElement) {
          image.parentElement.classList.add('poster-missing');
        }
      }, { once: true });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupHero();
    setupFilters();
    setupImageFallbacks();
  });
}());
