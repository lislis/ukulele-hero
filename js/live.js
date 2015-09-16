
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
  },

  getUserMedia: function(dictionary, callback) {
    try {
      navigator.getUserMedia = 
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
    } catch (e) {
      alert('getUserMedia threw exception :' + e);
    }
  },

  prepareUserInput: function() {
    var self = this;
    this.getUserMedia();
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
    this.getInputPitch.bind(self);
    toggleScreen('choose');
  },

  getInputPitch: function(time) {
    var self = this;
    var cycles = new Array;
    this.liveAnalyser.getFloatTimeDomainData( this.buf );
    var ac = autoCorrelate( this.buf, this.liveCtx.sampleRate );
    var note;
    if (ac !== -1) {
      note = noteFromPitch(ac);
    } else {
      note = '-';
    }
    game.liveNote = note;
    document.querySelector('#userplayed').innerHTML = note;
  },

  onError: function(e)  {
    console.log(e);
  }
}

var live = new Live();

