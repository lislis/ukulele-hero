

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
  var graphBase = height - (graphStroke * 10);

  var barMargin = 5;
  var numOfBars = (offlineFFTArray.length * (songSeconds * 2 / offlineFFTArray.length));
  var barWidth = Math.floor(width / numOfBars);
  var actualUsedWidth = numOfBars * barWidth;

  var raf;

  ctx.clearRect(0, 0, width, height);

  var draw = function() {

    // raf = window.requestAnimationFrame(draw);
    ctx.fillRect(0, graphBase, width, graphStroke);
    ctx.fillRect(0, height - (graphStroke * 5), width, graphStroke);
  
    for (var i = 0; i < numOfBars; i++) {
      var barHeight = (Math.max.apply(Math, offlineFFTArray[i]) * 0.8);
      ctx.fillRect((i * barWidth) + ((width - actualUsedWidth) / 2), graphBase - barHeight, barWidth, barHeight);
    };

    ctx.font = "20px sans-serif";
    var prevNote = '';
    var sampleWidths = actualUsedWidth / offlineFFTArray.length;

    for (var j = 0; j < offlineNotesArray.length; j++) {
      if (offlineNotesArray[j] !== undefined) {
        if (prevNote !== offlineNotesArray[j]) {
          prevNote = offlineNotesArray[j];

          if (offlineNotesArray[j + 1] !== offlineNotesArray[j - 1]) {
            ctx.fillText(offlineNotesArray[j], (j * sampleWidths) + ((width - actualUsedWidth) / 2), 20);
            console.log('Drawing: ' + offlineNotesArray[j]);
          }
          
        } else if (prevNote === '') {
          prevNote = offlineNotesArray[j];
        }
      }
    };

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
