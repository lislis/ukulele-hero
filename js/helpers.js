
var getBiggestBin = function(data) {
  var maxVal = Math.max.apply(Math, data);
  return data.indexOf(maxVal);
};

var calcFreqFromBin = function(binNum, sampleRate, fftSize) {
  return (sampleRate/fftSize) * binNum;
};

var toggleScreen = function(newState) {
  removeClasses('.screen', 'is-active');
  document.querySelector('#' + newState).classList.add('is-active');
};

//
// from https://webaudiodemos.appspot.com/pitchdetect/
//
var noteFromPitch = function( frequency ) {
  var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
  var noteStringIndex = Math.round( noteNum ) + 69;
  return noteStrings[noteStringIndex%12];
};


var autoCorrelate = function(buf, sampleRate) {
  var MIN_SAMPLES = 0; // look here in case of weird things
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

