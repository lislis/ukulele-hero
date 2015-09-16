

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

  scoreTotal: null,
  score: null,
  liveNote: null,
  raf: null,
  samplesToTimeRatio: null,
  scoreSamples: null,


  init: function() {
    this.actions();
  },

  start: function() {
    document.querySelector('#startgame').classList.add('is-hidden');
    this.isCountingDown = true;
    this.samplesToTimeRatio =  offline.offlineNotesArray.length / this.songDuration;
    this.scoreSamples = this.getScoreSamples();
    this.score = this.scoreSamples.length;
    this.scoreTotal = this.scoreSamples.length;
    document.querySelector('#score').innerHTML = 100 - (Math.floor(this.score / this.scoreTotal * 100)) + '%';
    this.loop();
  },

  loop: function() {
    var self = this;
    self.raf = window.requestAnimationFrame(self.loop.bind(self));
    this.drawTime();
    live.getInputPitch();
    visual.draw();
    this.checkNotesPlayed();
  },

  getScoreSamples: function() {
    var array = [];
    for (var j = 0; j < offline.offlineNotesArray.length; j++) {
      if (offline.offlineNotesArray[j] !== undefined) {
        if (offline.offlineNotesArray[j - 1] !== offline.offlineNotesArray[j]) {
          if (offline.offlineNotesArray[j + 1] !== offline.offlineNotesArray[j - 1]) {
            array.push(j);
          }
        }
      }
    };
    return array;
  },

  checkNotesPlayed: function() {
    if (this.liveNote === offline.offlineNotesArray[Math.floor(this.timeIn * this.samplesToTimeRatio)]) {
      if (this.scoreSamples.indexOf(Math.floor(this.timeIn * this.samplesToTimeRatio)) != -1) {
        this.scoreSamples.splice(this.scoreSamples.indexOf(Math.floor(this.timeIn * this.samplesToTimeRatio)), 1);
        this.score = this.scoreSamples.length;
        document.querySelector('#score').innerHTML = 100 - (Math.floor(this.score / this.scoreTotal * 100)) + '%';
      }
    }
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
    var self = this;
    window.addEventListener('gameEnd', function (e) {
      document.querySelector('#songtitle').innerHTML = document.querySelector('.songlist li.is-active').innerHTML;
      document.querySelector('#totalscore').innerHTML = 100 - (Math.floor(self.score / self.scoreTotal * 100)) + '%';
      toggleScreen('gameend');
      offline.playSource.stop();
      window.cancelAnimationFrame(self.raf);
    }, false);
  }
}

var game = new Game();
