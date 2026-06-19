(function () {
  function init(options) {
    var root = document.querySelector('[data-player-root]');
    if (!root || !options || !options.source) {
      return;
    }
    var video = root.querySelector('video');
    var overlay = root.querySelector('.player-overlay');
    var started = false;
    var hls = null;

    function attachSource() {
      if (started || !video) {
        return;
      }
      started = true;
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = options.source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(options.source);
        hls.attachMedia(video);
      } else {
        video.src = options.source;
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          video.setAttribute('controls', 'controls');
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', attachSource);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!started) {
          attachSource();
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.MoviePlayer = {
    init: init
  };
}());
