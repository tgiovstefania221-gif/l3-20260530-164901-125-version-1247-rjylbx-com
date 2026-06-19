(function () {
  function setupPlayer(player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('[data-player-cover]');
    var toggle = player.querySelector('[data-player-toggle]');
    var status = player.querySelector('[data-player-status]');
    var stream = player.getAttribute('data-stream');
    var hls = null;
    var ready = false;

    function setStatus(text) {
      if (status) {
        status.textContent = text;
      }
    }

    function prepare() {
      if (ready || !video || !stream) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          ready = true;
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus('播放遇到问题，请刷新后重试');
          }
        });
        ready = true;
        return;
      }

      video.src = stream;
      ready = true;
    }

    function start() {
      prepare();

      if (!video) {
        return;
      }

      var request = video.play();

      if (request && request.catch) {
        request.catch(function () {
          setStatus('点击播放器开始观看');
        });
      }
    }

    function pause() {
      if (video) {
        video.pause();
      }
    }

    function togglePlay() {
      if (!video || video.paused) {
        start();
      } else {
        pause();
      }
    }

    if (cover) {
      cover.addEventListener('click', function () {
        cover.classList.add('is-hidden');
        player.classList.add('is-playing');
        start();
      });
    }

    if (toggle) {
      toggle.addEventListener('click', togglePlay);
    }

    if (video) {
      video.addEventListener('click', togglePlay);
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
        if (cover) {
          cover.classList.add('is-hidden');
        }
        if (toggle) {
          toggle.textContent = '暂停';
        }
        setStatus('正在播放');
      });
      video.addEventListener('pause', function () {
        player.classList.remove('is-playing');
        if (toggle) {
          toggle.textContent = '播放';
        }
        setStatus('点击继续观看');
      });
      video.addEventListener('ended', function () {
        player.classList.remove('is-playing');
        if (toggle) {
          toggle.textContent = '重播';
        }
        setStatus('播放结束');
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.movie-player')).forEach(setupPlayer);
})();
