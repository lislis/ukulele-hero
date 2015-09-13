

// songSeconds = 60;
// offlineCtx = new OfflineAudioContext(1, 44100 * songSeconds, 44100);

// offlineAnalyser = offlineCtx.createAnalyser();
// offlineAnalyser.fftSize = 4096;

// offlineProcessor = offlineCtx.createScriptProcessor(16384, 1, 1);
// offlineProcessor.connect(offlineCtx.destination);

// offlineSource = offlineCtx.createBufferSource();
// offlineFFTArray = [];
// offlineNotesArray = [];

timePlayed = 0;


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

  var lastCalledTime;
  var delta;
  var indicatorPosition = 0;

  var raf;

  var draw = function() {
    raf = window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, width, height);
    drawIndicator();
    drawGraph();
    drawNotes();
  };

  var drawIndicator = function() {
    // indicator
    ctx.fillStyle = "blue";
    var indicatorMaxLength = actualUsedWidth;
    var indicatorStart = (width - actualUsedWidth) / 2;
    var timeoffset = timePlayed / songSeconds;
    indicatorPosition = actualUsedWidth * timeoffset;
    if (indicatorPosition < indicatorMaxLength) {
      ctx.fillRect(indicatorStart, height - (graphStroke * 5), indicatorPosition, graphStroke);
    }


    if(!lastCalledTime) {
      lastCalledTime = Date.now();
      return;
    }
    delta = (new Date().getTime() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    timePlayed += delta;
    document.querySelector('#timeleft').innerHTML = parseInt(songSeconds) - Math.ceil(timePlayed);
  };

  var drawNotes = function() {
    ctx.font = "20px sans-serif";
    var prevNote = '';
    var sampleWidths = actualUsedWidth / offlineFFTArray.length;

    for (var j = 0; j < offlineNotesArray.length; j++) {
      if (offlineNotesArray[j] !== undefined) {
        if (prevNote !== offlineNotesArray[j]) {
          prevNote = offlineNotesArray[j];
          if (offlineNotesArray[j + 1] !== offlineNotesArray[j - 1]) { // if only one sample is different

            if (((j - 4) * sampleWidths) + ((width - actualUsedWidth) / 2) > indicatorPosition) {
              ctx.fillStyle = "white";
            } else {
              ctx.fillStyle = "black";
            }
            ctx.fillText(offlineNotesArray[j], (j * sampleWidths) + ((width - actualUsedWidth) / 2), 20);
          }
        } else if (prevNote === '') {
          prevNote = offlineNotesArray[j];
        }
      }
    };
  };

  var drawGraph = function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, graphBase, width, graphStroke);

    // bars
    for (var i = 0; i < numOfBars; i++) {
      var barHeight = (Math.max.apply(Math, offlineFFTArray[i]) * 0.8);

      if (((i - 4) * barWidth) + ((width - actualUsedWidth) / 2) > indicatorPosition) {
        ctx.fillStyle = "white";
      } else {
        ctx.fillStyle = "black";
      }

      ctx.fillRect((i * barWidth) + ((width - actualUsedWidth) / 2), graphBase - barHeight, barWidth, barHeight);
    };
  };

  draw();
};

// normalize notes first??
// also, but not here:
// calc score
// create gain node and make it work
// also 
// get new Ctx from input stream, auto correlate
