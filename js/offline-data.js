
var Offline = function() {
  this.init();
}

Offline.prototype = {




  init: function() {

  }
}

var offline = new Offline();


game.songDuration = 60;
offlineCtx = new OfflineAudioContext(1, 44100 * game.songDuration, 44100);

offlineAnalyser = offlineCtx.createAnalyser();
offlineAnalyser.fftSize = 4096;

offlineProcessor = offlineCtx.createScriptProcessor(16384, 1, 1);
offlineProcessor.connect(offlineCtx.destination);

offlineSource = offlineCtx.createBufferSource();
offlineFFTArray = [];
offlineNotesArray = [];

// songToPlay = 'big-jet-plane.mp3';
songToPlay = 'guitar-loop.wav';
playCtx = new AudioContext();
playSource = playCtx.createBufferSource();
playGain = playCtx.createGain();
playGain.gain.value = 1;
playSource.connect(playGain);
playGain.connect(playCtx.destination);


function prepareOfflineData() {
  var request = new XMLHttpRequest();
  request.open('GET', songToPlay, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    var audioData = request.response;

    offlineCtx.decodeAudioData(audioData, function(buffer) {
      var decodedOfflineBuffer = buffer;
      offlineSource.buffer = decodedOfflineBuffer;
      offlineSource.connect(offlineAnalyser);
      offlineAnalyser.connect(offlineProcessor);

      offlineProcessor.onaudioprocess = function(e){
        var data =  new Uint8Array(offlineAnalyser.frequencyBinCount);
        offlineAnalyser.getByteFrequencyData(data);
        var biggestBin = getBiggestBin(data);
        var note = noteFromPitch(calcFreqFromBin(biggestBin, offlineCtx.sampleRate, offlineAnalyser.fftSize));
        offlineNotesArray.push(note);
        offlineFFTArray.push(data);
      }

      offlineSource.start();
      offlineCtx.startRendering().then(function(renderedBuffer) {

        console.log('done');
        toggleScreen('stage');
        prepareUserInput();

        playSource.buffer = offlineSource.buffer;
        // offlineSource.connect(offlineCtx.destination);
        // playSource.start();
      }).catch(function(err) {
        console.log('Rendering failed: ' + err);
      });;

    });
  }
  request.send();
}
prepareOfflineData();



