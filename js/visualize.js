

// songSeconds = 60;
// offlineCtx = new OfflineAudioContext(1, 44100 * songSeconds, 44100);

// offlineAnalyser = offlineCtx.createAnalyser();
// offlineAnalyser.fftSize = 4096;

// offlineProcessor = offlineCtx.createScriptProcessor(16384, 1, 1);
// offlineProcessor.connect(offlineCtx.destination);

// offlineSource = offlineCtx.createBufferSource();
// offlineFFTArray = [];
// offlineNotesArray = [];

var visualizePlayalong = function() {
  var canvas = document.querySelector('#playalong');
  var ctx = canvas.getContext('2d');
  var width = Math.floor(window.innerWidth / 100 * 90);
  var height = 300;
  canvas.width = width;
  canvas.height = height;


  var graphStroke = 5;
  var graphBase = height - (graphStroke * 10)

  var raf;

  ctx.clearRect(0, 0, width, height);

  var draw = function() {

    // raf = window.requestAnimationFrame(draw);
    console.log('drawig');
    ctx.fillRect(0, graphBase, width, graphStroke);
    ctx.fillRect(0, height - (graphStroke * 5), width, graphStroke);

  };
  draw();

  // get canvas 
  // calc bars
  // calc new notes
  // normalize notes first??
  // indicate time 
};


// also, but not here:
// calc remainign time
// calc score
// create gain node and make it work
// also 
// get new Ctx from input stream, auto correlate


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