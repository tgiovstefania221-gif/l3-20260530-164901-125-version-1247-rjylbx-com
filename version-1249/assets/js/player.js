(function () {
  function setMessage(player, text) {
    var message = player.querySelector('.player-message');

    if (message) {
      message.textContent = text || '';
    }
  }

  function initializePlayer(player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var src = player.getAttribute('data-src');
    var loaded = false;
    var hlsInstance = null;

    if (!video || !src) {
      setMessage(player, '播放源缺失');
      return;
    }

    function loadSource() {
      if (loaded) {
        return Promise.resolve();
      }

      loaded = true;
      setMessage(player, '正在加载播放源...');

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);

        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setMessage(player, '');
        });

        hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            setMessage(player, '网络错误，正在重试...');
            hlsInstance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            setMessage(player, '媒体错误，正在恢复...');
            hlsInstance.recoverMediaError();
          } else {
            setMessage(player, '当前播放源暂时无法播放');
            hlsInstance.destroy();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        setMessage(player, '');
      } else {
        setMessage(player, '当前浏览器不支持 HLS 播放');
      }

      return Promise.resolve();
    }

    function playVideo() {
      loadSource().then(function () {
        var result = video.play();

        if (result && typeof result.catch === 'function') {
          result.catch(function () {
            setMessage(player, '浏览器阻止了自动播放，请再次点击播放');
          });
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('play', function () {
      player.classList.add('is-playing');
      setMessage(player, '');
    });

    video.addEventListener('pause', function () {
      player.classList.remove('is-playing');
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.movie-player')).forEach(initializePlayer);
  });
}());
