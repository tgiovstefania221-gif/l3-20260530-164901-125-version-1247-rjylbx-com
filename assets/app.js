(function () {
  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function cardMatches(card, keyword, filter) {
    var text = [
      card.getAttribute('data-title'),
      card.getAttribute('data-region'),
      card.getAttribute('data-type'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-tags'),
      card.getAttribute('data-category')
    ].join(' ').toLowerCase();
    var keywordOk = !keyword || text.indexOf(keyword) !== -1;
    var filterOk = filter === 'all' || text.indexOf(filter) !== -1 || card.getAttribute('data-category') === filter;
    return keywordOk && filterOk;
  }

  function applyFilters(scope) {
    var input = scope.querySelector('[data-search-input]');
    var active = scope.querySelector('[data-filter-group] .active');
    var keyword = normalize(input ? input.value : '');
    var filter = normalize(active ? active.getAttribute('data-filter-value') : 'all');
    var cards = scope.querySelectorAll('[data-card]');
    var shown = 0;
    cards.forEach(function (card) {
      var visible = cardMatches(card, keyword, filter);
      card.style.display = visible ? '' : 'none';
      if (visible) shown += 1;
    });
    var empty = scope.querySelector('[data-empty-state]');
    if (empty) {
      empty.classList.toggle('show', shown === 0);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    document.querySelectorAll('.content-section').forEach(function (section) {
      var input = section.querySelector('[data-search-input]');
      var group = section.querySelector('[data-filter-group]');
      if (input) {
        input.addEventListener('input', function () {
          applyFilters(section);
        });
      }
      if (group) {
        group.querySelectorAll('button').forEach(function (button) {
          button.addEventListener('click', function () {
            group.querySelectorAll('button').forEach(function (item) {
              item.classList.remove('active');
            });
            button.classList.add('active');
            applyFilters(section);
          });
        });
      }
    });
  });
})();
