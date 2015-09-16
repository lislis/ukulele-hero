
var Offline = function() {
  this.init();
}

Offline.prototype = {

  offlineCtx: new OfflineAudioContext(1, 44100 * game.songDuration, 44100),
  offlineAnalyser: null,
  offlineProcessor: null,
  offlineSource: null,
  offlineFFTArray: [],
  offlineNotesArray: [],

  // songToPlay: 'big-jet-plane.mp3',
  // songToPlay: 'guitar-loop.wav',
  // songToPlay: game.songToPlay,
  
  playCtx: new AudioContext(),
  playSource: null,
  playGain: null,
  

  init: function() {
    this.offlineAnalyser = this.offlineCtx.createAnalyser();
    this.offlineProcessor = this.offlineCtx.createScriptProcessor(16384, 1, 1);
    this.offlineSource = this.offlineCtx.createBufferSource();
    this.offlineAnalyser.fftSize = 4096;
    this.offlineProcessor.connect(this.offlineCtx.destination);

    this.playSource = this.playCtx.createBufferSource();
    this.playGain = this.playCtx.createGain();
    this.playGain.gain.value = 1;
    this.playSource.connect(this.playGain);
    this.playGain.connect(this.playCtx.destination);
  },

  loadSong: function() {
    var self = this;
    var request = new XMLHttpRequest();
    request.open('GET', this.songToPlay, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
      var audioData = request.response;

      self.offlineCtx.decodeAudioData(audioData, function(buffer) {
        var decodedOfflineBuffer = buffer;
        self.offlineSource.buffer = decodedOfflineBuffer;
        self.offlineSource.connect(self.offlineAnalyser);
        self.offlineAnalyser.connect(self.offlineProcessor);

        self.offlineProcessor.onaudioprocess = self.onAudioProcess.bind(self);

        self.offlineSource.start();
        self.offlineCtx.startRendering()
          .then(self.playSong.bind(self))
          .catch(function(err) {
            console.log('Rendering failed: ' + err);
          });
      });
    }
    request.send();
  },

  onAudioProcess: function(e) {
    var data =  new Uint8Array(this.offlineAnalyser.frequencyBinCount);
    var biggestBin, note;

    this.offlineAnalyser.getByteFrequencyData(data);
    biggestBin = getBiggestBin(data);
    note = noteFromPitch(calcFreqFromBin(biggestBin, this.offlineCtx.sampleRate, this.offlineAnalyser.fftSize));
    this.offlineNotesArray.push(note);
    this.offlineFFTArray.push(data);
  },

  playSong: function(buff) {
    var self = this;

    toggleScreen('stage');
    visual = new Visual();
    this.playSource.buffer = this.offlineSource.buffer;

    document.querySelector('[data-screen="juststart"]').addEventListener('click', function() {
      document.querySelector('#startgame').classList.add('is-hidden');
      self.playSource.start();
    });
  }
}
var offline = new Offline();
