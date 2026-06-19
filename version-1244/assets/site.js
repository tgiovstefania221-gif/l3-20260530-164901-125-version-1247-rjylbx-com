(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var navLinks = document.querySelector('[data-nav-links]');

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-card-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var emptyState = document.querySelector('[data-empty-state]');

  if (searchInput && cards.length) {
    searchInput.addEventListener('input', function () {
      var keyword = searchInput.value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags')).toLowerCase();
        var matched = haystack.indexOf(keyword) !== -1;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.style.display = visible ? 'none' : 'block';
      }
    });
  }

  var player = document.querySelector('[data-video-player]');
  if (player) {
    var source = player.getAttribute('data-src');

    if (source && player.canPlayType('application/vnd.apple.mpegurl')) {
      player.src = source;
    } else if (source && window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(player);
    } else if (source) {
      player.src = source;
    }
  }
})();
