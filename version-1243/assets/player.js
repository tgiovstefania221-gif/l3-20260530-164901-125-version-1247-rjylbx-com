(function () {
  window.startMoviePlayer = function (streamUrl) {
    var shell = document.querySelector('[data-player]');
    if (!shell) {
      return;
    }

    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var message = shell.querySelector('[data-player-message]');
    var loaded = false;
    var requested = false;
    var hls = null;

    function showMessage(text) {
      if (message) {
        message.textContent = text;
        message.classList.add('is-visible');
      }
    }

    function playVideo() {
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          showMessage('轻触播放区域即可继续播放');
        });
      }
    }

    function attachStream() {
      if (loaded || !video || !streamUrl) {
        return;
      }
      loaded = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (requested) {
            playVideo();
          }
        });
        hls.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (data && data.fatal) {
            showMessage('播放暂时不可用，请稍后重试');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', function () {
          if (requested) {
            playVideo();
          }
        }, { once: true });
      } else {
        showMessage('播放暂时不可用，请稍后重试');
      }
    }

    function begin() {
      requested = true;
      if (button) {
        button.classList.add('is-hidden');
      }
      attachStream();
      setTimeout(playVideo, 180);
    }

    if (button) {
      button.addEventListener('click', begin);
    }

    video.addEventListener('click', function () {
      if (!requested) {
        begin();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
