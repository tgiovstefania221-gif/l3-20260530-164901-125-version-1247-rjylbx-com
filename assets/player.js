(function () {
  function prepare(video, source) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      if (video._hlsInstance) {
        video._hlsInstance.destroy();
      }
      var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      video._hlsInstance = hls;
      return;
    }
    video.src = source;
  }

  window.SitePlayer = {
    bind: function (videoId, buttonId, source) {
      var video = document.getElementById(videoId);
      var button = document.getElementById(buttonId);
      var started = false;
      if (!video || !button || !source) return;

      function start() {
        if (!started) {
          prepare(video, source);
          started = true;
        }
        button.classList.add('hide');
        var play = video.play();
        if (play && typeof play.catch === 'function') {
          play.catch(function () {});
        }
      }

      button.addEventListener('click', start);
      video.addEventListener('click', function () {
        if (!started) start();
      });
      video.addEventListener('play', function () {
        button.classList.add('hide');
      });
    }
  };
})();
