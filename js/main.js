var context = new AudioContext();

var soundBuffer = null;

loadSound('/chocolates-and-cigarettes.mp3');

var source = context.createBufferSource();
source.buffer = soundBuffer;

// var oscillator = context.createOscillator();

var gainNode = context.createGain();
gainNode.gain.value = 0.8;

// oscillator.connect(gainNode);

source.connect(gainNode);

source.start(0);

gainNode.connect(context.destination);


function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';


  onError = function(error) {
    console.log('error');
  }
  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      soundBuffer = buffer;
    }, onError);
  }
  request.send();
}

// function playSound(buffer, time) {
//   var source = context.createBufferSource(); // creates a sound source
//   source.buffer = buffer;                    // tell the source which sound to play
//   source.connect(context.destination);       // connect the source to the context's destination (the speakers)
//   source.start(time);                        // play the source now
// }