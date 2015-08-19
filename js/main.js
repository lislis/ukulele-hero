var context = new AudioContext();

var gainNode = context.createGain();
gainNode.gain.value = 1.2;

var analyser = context.createAnalyser();
analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);
// analyser.getByteFrequencyData(dataArray);

var source = context.createBufferSource();
request = new XMLHttpRequest();

request.open('GET', 'guitar-loop.wav', true);
request.responseType = 'arraybuffer';

request.onload = function() {
  var audioData = request.response;

  context.decodeAudioData(audioData, function(buffer) {
      source.buffer = buffer;

      source.connect(analyser);
      // source.loop = true;

      analyser.connect(gainNode);

      gainNode.connect(context.destination)

      source.start();
    },

    function(e){"Error with decoding audio data" + e.err});
}

request.send();


// // var oscillator = context.createOscillator();

// // oscillator.connect(gainNode);


function visualizeSine() {

  var canvas = document.querySelector('#sine-wave');
  var canvasCtx = canvas.getContext("2d");
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  
  analyser.fftSize = 2048;
  var bufferLength = analyser.fftSize;
  console.log(bufferLength);
  var dataArray = new Uint8Array(bufferLength);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  function draw() {

    drawVisual = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
 
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();
  };

  draw();
}

function visualizeBar() {

  var canvas = document.querySelector('#bar-graph');
  var canvasCtx = canvas.getContext("2d");
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  analyser.fftSize = 256;
  var bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);
  var dataArray = new Uint8Array(bufferLength);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  function draw() {
    drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
      canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

      x += barWidth + 1;
    }
  };

  draw();
}

visualizeSine();
visualizeBar();
