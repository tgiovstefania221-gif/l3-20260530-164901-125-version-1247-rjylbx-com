(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function initMobileNav() {
    var button = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function initHeroSlider() {
    var root = document.querySelector('[data-hero-slider]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function initHeroSearch() {
    var form = document.querySelector('[data-hero-search]');
    if (!form) {
      return;
    }
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      if (!value) {
        event.preventDefault();
        window.location.href = './search.html';
      }
    });
  }

  function initCardFilter() {
    var input = document.querySelector('.js-card-filter');
    if (!input) {
      return;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        card.classList.toggle('is-hidden-by-filter', keyword && text.indexOf(keyword) === -1);
      });
    });
  }

  function getSearchQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || '').trim();
  }

  function createSearchCard(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card" data-title="' + escapeHtml(movie.title) + '" data-genre="' + escapeHtml(movie.genre) + '" data-year="' + escapeHtml(movie.year) + '" data-region="' + escapeHtml(movie.region) + '">',
      '  <a class="movie-poster-link" href="' + movie.file + '" aria-label="观看' + escapeHtml(movie.title) + '">',
      '    <span class="movie-poster" style="background-image: linear-gradient(180deg, rgba(15, 23, 42, 0.06), rgba(15, 23, 42, 0.74)), url(\'' + movie.image + '\');"></span>',
      '    <span class="movie-score">热度 ' + movie.hot + '</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="movie-card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '    <h2><a href="' + movie.file + '">' + escapeHtml(movie.title) + '</a></h2>',
      '    <p>' + escapeHtml(movie.description) + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function initSearchPage() {
    var data = window.MovieSearchData;
    var input = document.getElementById('globalSearchInput');
    var button = document.getElementById('globalSearchButton');
    var results = document.getElementById('searchResults');
    if (!data || !input || !button || !results) {
      return;
    }

    function render(value) {
      var keyword = value.trim().toLowerCase();
      var list = data.filter(function (movie) {
        if (!keyword) {
          return movie.hot >= 8.7;
        }
        return [movie.title, movie.description, movie.genre, movie.region, movie.year, movie.category, movie.tags.join(' ')].join(' ').toLowerCase().indexOf(keyword) !== -1;
      }).slice(0, 96);

      if (!list.length) {
        results.innerHTML = '<div class="empty-result">没有找到匹配内容</div>';
        return;
      }
      results.innerHTML = list.map(createSearchCard).join('');
    }

    function runSearch() {
      render(input.value);
      var url = new URL(window.location.href);
      if (input.value.trim()) {
        url.searchParams.set('q', input.value.trim());
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState({}, '', url.toString());
    }

    input.value = getSearchQuery();
    button.addEventListener('click', runSearch);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        runSearch();
      }
    });
    document.querySelectorAll('[data-search-chip]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        input.value = chip.getAttribute('data-search-chip') || '';
        runSearch();
      });
    });
    render(input.value);
  }

  ready(function () {
    initMobileNav();
    initHeroSlider();
    initHeroSearch();
    initCardFilter();
    initSearchPage();
  });
}());
