(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-slide-dot]'));
    var previous = slider.querySelector('[data-slide-prev]');
    var next = slider.querySelector('[data-slide-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function restartTimer() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (previous) {
      previous.addEventListener('click', function () {
        showSlide(current - 1);
        restartTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        restartTimer();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        restartTimer();
      });
    });

    showSlide(0);
    restartTimer();
  }

  var filterForm = document.querySelector('[data-filter-form]');

  if (filterForm) {
    var keyword = filterForm.querySelector('[data-filter-keyword]');
    var year = filterForm.querySelector('[data-filter-year]');
    var type = filterForm.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
    var empty = document.querySelector('[data-filter-empty]');
    var query = new URLSearchParams(window.location.search).get('q');

    if (query && keyword) {
      keyword.value = query;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
      var text = normalize(keyword && keyword.value);
      var selectedYear = normalize(year && year.value);
      var selectedType = normalize(type && type.value);
      var shown = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags')
        ].join(' '));
        var matchText = !text || haystack.indexOf(text) !== -1;
        var matchYear = !selectedYear || normalize(card.getAttribute('data-year')) === selectedYear;
        var matchType = !selectedType || normalize(card.getAttribute('data-type')) === selectedType;
        var visible = matchText && matchYear && matchType;

        card.style.display = visible ? '' : 'none';

        if (visible) {
          shown += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', shown === 0);
      }
    }

    ['input', 'change'].forEach(function (eventName) {
      filterForm.addEventListener(eventName, applyFilter);
    });

    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter();
    });

    applyFilter();
  }
})();
