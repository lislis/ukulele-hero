
var liveCtx = new AudioContext();
var liveSource, liveAnalyzer;
var buflen = 1024;
var buf = new Float32Array( buflen );
var MIN_SAMPLES = 0;

var prepareUserInput = function() {
  document.querySelector('#allowmic').classList.remove('is-hidden');
  getUserMedia(
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
  }, prepareStream);
};

var getUserMedia = function(dictionary, callback) {
  try {
    navigator.getUserMedia = 
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    navigator.getUserMedia(dictionary, callback, error);
  } catch (e) {
    alert('getUserMedia threw exception :' + e);
  }
};

var error = function(e)  {
  console.log(e);
};

var prepareStream = function(stream) {
  liveSource = liveCtx.createMediaStreamSource(stream);
  liveAnalyser = liveCtx.createAnalyser();
  liveAnalyser.fftSize = 2048;
  liveSource.connect( liveAnalyser );
  throttle(getInputPitch(), 1000);

  document.querySelector('#allowmic').classList.add('is-hidden');
  document.querySelector('#startgame').classList.remove('is-hidden');
};

var getInputPitch = function(time) {
  var cycles = new Array;
  liveAnalyser.getFloatTimeDomainData( buf );
  var ac = autoCorrelate( buf, liveCtx.sampleRate );
  var note;
  if (ac !== -1) {
    note = noteFromPitch(ac);
  } else {
    note = '-';
  }
  liveNote = note;
  document.querySelector('#userplayed').innerHTML = note;
  rafID = window.requestAnimationFrame( getInputPitch );
}


// from https://webaudiodemos.appspot.com/pitchdetect/
var autoCorrelate = function(buf, sampleRate) {
  var SIZE = buf.length;
  var MAX_SAMPLES = Math.floor(SIZE/2);
  var best_offset = -1;
  var best_correlation = 0;
  var rms = 0;
  var foundGoodCorrelation = false;
  var correlations = new Array(MAX_SAMPLES);

  for (var i=0;i<SIZE;i++) {
    var val = buf[i];
    rms += val*val;
  }
  rms = Math.sqrt(rms/SIZE);
  if (rms<0.01)
    return -1;

  var lastCorrelation=1;
  for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    var correlation = 0;

    for (var i=0; i<MAX_SAMPLES; i++) {
      correlation += Math.abs((buf[i])-(buf[i+offset]));
    }
    correlation = 1 - (correlation/MAX_SAMPLES);
    correlations[offset] = correlation; // store it, for the tweaking we need to do below.
    if ((correlation>0.9) && (correlation > lastCorrelation)) {
      foundGoodCorrelation = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (foundGoodCorrelation) {
      var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
      return sampleRate/(best_offset+(8*shift));
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    return sampleRate/best_offset;
  }
  return -1;
};
