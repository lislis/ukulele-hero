var removeClasses = function(elems, className) {
  [].forEach.call(document.querySelectorAll(elems), function(item) {
    item.classList.remove(className);
  });
};

[].forEach.call(document.querySelectorAll('.js-toggle'), function(item) {
  item.addEventListener('click', function(ev) {
    toggleScreen(this.dataset.screen);
  });
});

[].forEach.call(document.querySelectorAll('.songlist li'), function(item) {
  item.addEventListener('click', function(ev) {
    removeClasses('.songlist li', 'is-active');
    this.classList.add('is-active');
    songToPlay = this.dataset.url;
    if (document.querySelector('.songlist li.is-active')) {
      document.querySelector('.js-toggle[data-screen="loading"]').classList.remove('is-hidden');
    }
  });
});

document.querySelector('.js-toggle[data-screen="loading"]').addEventListener('click', function(ev) {
  prepareOfflineData();
});

document.querySelector('[data-screen="allowmic"]').addEventListener('click', function(ev) {
  live.prepareUserInput();
});

document.querySelector('[data-screen="juststart"]').addEventListener('click', function(ev) {
  game.start();
});
