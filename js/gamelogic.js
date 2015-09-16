

var noteChangeEv = new Event('noteChange');
var gameEndEv = new Event('gameEnd');

var visual;

var Game = function() {
  this.init();
}

Game.prototype = {

  isCountingDown: false,
  timeleftElem: document.querySelector('#timeleft'),
  songDuration: 60,
  timeIn: 0,
  lastCalledTime: null,
  delta: null,

  score: 0,
  liveNote: null,

  init: function() {
    this.actions();
  },

  start: function() {
    document.querySelector('#startgame').classList.add('is-hidden');
    this.isCountingDown = true;
    this.loop();
  },

  loop: function() {
    var self = this;
    window.requestAnimationFrame(function() {self.loop();});
    this.drawTime();
    visual.draw();
  },

  drawTime: function() {
    this.timeleftElem.innerHTML = this.countdownTime();
  },

  countdownTime: function() {
    if (this.isCountingDown) {
      if(!this.lastCalledTime) {
        this.lastCalledTime = Date.now();
      }
      this.delta = (new Date().getTime() - this.lastCalledTime)/1000;
      this.lastCalledTime = Date.now();
      this.timeIn += this.delta;

      if (this.timeIn < this.songDuration) {
        return parseInt(this.songDuration) - Math.ceil(this.timeIn);
      } else {
        window.dispatchEvent(gameEndEv);
        return 0;
      }
      
    } else {
      return this.timeIn;
    }
  },

  actions: function() {

    window.addEventListener('noteChange', function (e) {
      // console.log(e);
      // console.log('New note: ' + e.detail);
      // console.log('Note played: ' + this.liveNote);
      if (e.detail != undefined) {
        if (e.detail === this.liveNote) {
          this.score += 100;
          document.querySelector('#score').innerHTML = this.score;
        }
      }
    }, false);

    window.addEventListener('gameEnd', function (e) {
      toggleScreen('gameend');
    }, false);
  }
}

var game = new Game();

// normalize notes first??
// calc score
// rewrite timing functions to work with time calc from this context

