(function () {
  var navButton = document.querySelector(".nav-toggle");
  var navMenu = document.querySelector(".nav-menu");

  if (navButton && navMenu) {
    navButton.addEventListener("click", function () {
      var open = navMenu.classList.toggle("is-open");
      navButton.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-search-form]")).forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[type='search']");
      var value = input ? input.value.trim() : "";
      var target = "./all.html";
      if (value) {
        target += "?q=" + encodeURIComponent(value);
      }
      window.location.href = target;
    });
  });

  var filterInput = document.querySelector("[data-filter-input]");
  var filterCards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
  var emptyState = document.querySelector("[data-empty-state]");

  function applyFilter() {
    if (!filterInput || !filterCards.length) {
      return;
    }
    var value = filterInput.value.trim().toLowerCase();
    var visible = 0;
    filterCards.forEach(function (card) {
      var text = ((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-tags") || "")).toLowerCase();
      var matched = !value || text.indexOf(value) !== -1;
      card.hidden = !matched;
      if (matched) {
        visible += 1;
      }
    });
    if (emptyState) {
      emptyState.classList.toggle("is-visible", visible === 0);
    }
  }

  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var keyword = params.get("q") || "";
    filterInput.value = keyword;
    filterInput.addEventListener("input", applyFilter);
    applyFilter();
  }

  window.setupPlayer = function (streamUrl) {
    var container = document.querySelector("[data-player]");
    if (!container) {
      return;
    }

    var video = container.querySelector("video");
    var layer = container.querySelector(".play-layer");
    var button = container.querySelector(".player-button");
    var started = false;
    var hlsInstance = null;

    function begin() {
      if (!video) {
        return;
      }

      if (!started) {
        started = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
        video.setAttribute("controls", "controls");
        if (layer) {
          layer.classList.add("is-hidden");
        }
      }

      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", begin);
    }
    if (layer) {
      layer.addEventListener("click", begin);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (!started) {
          begin();
        }
      });
    }

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  };
})();
