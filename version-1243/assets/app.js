(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('active', current === index);
      });
    }

    function startTimer() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, current) {
      dot.addEventListener('click', function () {
        showSlide(current);
        startTimer();
      });
    });

    startTimer();
  }

  var params = new URLSearchParams(window.location.search);
  var queryValue = params.get('q') || '';
  var listTools = document.querySelector('[data-list-tools]');
  var cardList = document.querySelector('[data-card-list]');
  var emptyState = document.querySelector('[data-empty-state]');

  if (listTools && cardList) {
    var searchInput = listTools.querySelector('[data-search-input]');
    var filters = Array.prototype.slice.call(listTools.querySelectorAll('[data-filter-field]'));
    var cards = Array.prototype.slice.call(cardList.querySelectorAll('[data-search]'));

    if (searchInput && queryValue) {
      searchInput.value = queryValue;
    }

    function matches(card) {
      var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var search = (card.getAttribute('data-search') || '').toLowerCase();
      if (q && search.indexOf(q) === -1) {
        return false;
      }
      for (var i = 0; i < filters.length; i += 1) {
        var field = filters[i].getAttribute('data-filter-field');
        var value = filters[i].value;
        if (value && (card.getAttribute('data-' + field) || '') !== value) {
          return false;
        }
      }
      return true;
    }

    function applyFilters() {
      var visible = 0;
      cards.forEach(function (card) {
        var ok = matches(card);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
    filters.forEach(function (filter) {
      filter.addEventListener('change', applyFilters);
    });
    applyFilters();
  }
})();
