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
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === current);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === current);
      });
    }

    function playHero() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        playHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        playHero();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        playHero();
      });
    });

    showSlide(0);
    playHero();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  document.querySelectorAll('.filter-scope').forEach(function (scope) {
    var input = scope.querySelector('[data-filter-input]');
    var selects = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-select]'));
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.filter-card'));
    var empty = scope.querySelector('[data-empty-filter]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');

    if (input && query) {
      input.value = query;
    }

    function applyFilter() {
      var term = normalize(input ? input.value : '');
      var shown = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var ok = !term || haystack.indexOf(term) !== -1;

        selects.forEach(function (select) {
          var key = select.getAttribute('data-filter-select');
          var value = normalize(select.value);
          var cardValue = normalize(card.getAttribute('data-' + key));

          if (value && cardValue.indexOf(value) === -1) {
            ok = false;
          }
        });

        card.hidden = !ok;
        if (ok) {
          shown += 1;
        }
      });

      if (empty) {
        empty.hidden = shown !== 0;
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    selects.forEach(function (select) {
      select.addEventListener('change', applyFilter);
    });

    applyFilter();
  });

  document.querySelectorAll('video[data-stream]').forEach(function (video) {
    var stream = video.getAttribute('data-stream');
    var stage = video.closest('.player-stage');
    var cover = stage ? stage.querySelector('.play-cover') : null;
    var hls = null;
    var attached = false;

    function attachStream() {
      if (attached || !stream) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        attached = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        attached = true;
        return;
      }

      video.src = stream;
      attached = true;
    }

    function startPlayback() {
      attachStream();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      video.controls = true;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (cover) {
            cover.classList.remove('is-hidden');
          }
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
