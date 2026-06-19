(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let heroIndex = 0;
  let heroTimer = null;

  function showHero(index) {
    if (!slides.length) {
      return;
    }
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === heroIndex);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === heroIndex);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }
    heroTimer = window.setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      if (heroTimer) {
        window.clearInterval(heroTimer);
      }
      showHero(i);
      startHero();
    });
  });

  showHero(0);
  startHero();

  const filterInput = document.querySelector('[data-filter-input]');
  const filterSelect = document.querySelector('[data-filter-select]');
  const cards = Array.from(document.querySelectorAll('[data-card]'));
  const noResults = document.querySelector('[data-no-results]');

  function applyFilter() {
    if (!cards.length) {
      return;
    }
    const keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    const year = filterSelect ? filterSelect.value : '';
    let visible = 0;

    cards.forEach(function (card) {
      const haystack = [
        card.dataset.title || '',
        card.dataset.genre || '',
        card.dataset.tags || '',
        card.textContent || ''
      ].join(' ').toLowerCase();
      const matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      const matchYear = !year || (card.dataset.year || '') === year;
      const ok = matchKeyword && matchYear;
      card.style.display = ok ? '' : 'none';
      if (ok) {
        visible += 1;
      }
    });

    if (noResults) {
      noResults.classList.toggle('show', visible === 0);
    }
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilter);
  }
  if (filterSelect) {
    filterSelect.addEventListener('change', applyFilter);
  }

  const heroSearch = document.querySelector('[data-hero-search]');
  if (heroSearch) {
    heroSearch.addEventListener('submit', function (event) {
      const input = heroSearch.querySelector('input');
      if (input && input.value.trim()) {
        event.preventDefault();
        window.location.href = 'search.html?q=' + encodeURIComponent(input.value.trim());
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  if (query && filterInput) {
    filterInput.value = query;
    applyFilter();
  }

  function initPlayer(box) {
    if (!box || box.dataset.ready === '1') {
      const video = box ? box.querySelector('video') : null;
      if (video) {
        video.play().catch(function () {});
      }
      return;
    }

    const video = box.querySelector('video');
    const source = box.dataset.src || (video ? video.dataset.src : '');
    if (!video || !source) {
      return;
    }

    box.dataset.ready = '1';
    video.controls = true;

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        box.classList.add('playing');
        video.play().catch(function () {});
      });
      hls.on(window.Hls.Events.ERROR, function () {
        video.src = source;
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      box.classList.add('playing');
      video.play().catch(function () {});
    } else {
      video.src = source;
      box.classList.add('playing');
      video.play().catch(function () {});
    }
  }

  document.querySelectorAll('[data-player]').forEach(function (box) {
    const button = box.querySelector('[data-play-button]');
    box.addEventListener('click', function () {
      initPlayer(box);
    });
    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        initPlayer(box);
      });
    }
  });
})();
