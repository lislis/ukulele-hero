
var songToPlay, songLength, songSeconds;
var offlineCtx, offlineAnalyser, offlineProcessor, offlineSource, offlineFFTArray, offlineNotesArray;


var getBiggestBin = function(data) {
  var maxVal = Math.max.apply(Math, data);
  return data.indexOf(maxVal);
};

var calcFreqFromBin = function(binNum, sampleRate, fftSize) {
  return (sampleRate/fftSize) * binNum;
};

var noteFromPitch = function( frequency ) {
  var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
  var noteStringIndex = Math.round( noteNum ) + 69;
  return noteStrings[noteStringIndex%12];
};

var toggleScreen = function(newState) {
  removeClasses('.screen', 'is-active');
  document.querySelector('#' + newState).classList.add('is-active');
};




