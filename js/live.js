
var Live = function() {
  this.init();
}

Live.prototype = {

  liveCtx: new AudioContext(),
  liveSource: null,
  liveAnalyzer: null,
  buf: new Float32Array(1024),

  raf: null,

  init: function() {
    this.liveAnalyser = this.liveCtx.createAnalyser();
    this.liveAnalyser.fftSize = 2048;

    // this.prepareUserInput(); 
  },

  getUserMedia: function(dictionary, callback) {
    try {
      navigator.getUserMedia = 
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      // navigator.getUserMedia(dictionary, callback, this.onError);
    } catch (e) {
      alert('getUserMedia threw exception :' + e);
    }
  },

  prepareUserInput: function() {
    var self = this;
    this.getUserMedia();
    document.querySelector('#allowmic').classList.remove('is-hidden');
    navigator.getUserMedia(
    {
      "audio": {
        "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
        },
        "optional": []
      },
    }, self.prepareStream.bind(self), this.onError);
  },

  prepareStream: function(stream) {
    var self = this;
    this.liveSource = this.liveCtx.createMediaStreamSource(stream);
    this.liveSource.connect(this.liveAnalyser);
    this.getInputPitch();

    document.querySelector('#allowmic').classList.add('is-hidden');
    document.querySelector('#startgame').classList.remove('is-hidden');
  },

  getInputPitch: function(time) {
    var self = this;
    throttle(function() {
      var cycles = new Array;
      this.liveAnalyser.getFloatTimeDomainData( this.buf );
      var ac = autoCorrelate( this.buf, this.liveCtx.sampleRate );
      var note;
      if (ac !== -1) {
        note = noteFromPitch(ac);
      } else {
        note = '-';
      }
      liveNote = note;
      document.querySelector('#userplayed').innerHTML = note;
    });
    window.requestAnimationFrame(self.getInputPitch.bind(self));
  },

  onError: function(e)  {
    console.log(e);
  }
}

var live = new Live();

