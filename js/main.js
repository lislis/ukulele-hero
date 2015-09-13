// var context = new AudioContext();

// var gainNode = context.createGain();
// gainNode.gain.value = 1.2;

// var analyser = context.createAnalyser();
// analyser.fftSize = 64;
// var bufferLength = analyser.frequencyBinCount;
// var freqArray = new Uint8Array(bufferLength);
// var timeArray = new Uint8Array(bufferLength);
// analyser.getByteTimeDomainData(timeArray);
// analyser.getByteFrequencyData(freqArray);

// var processor = context.createScriptProcessor(1024);

// processor.onaudioprocess = function(data) {
//   analyser.getByteTimeDomainData(data);
//   // console.log(data);
// }

// var source = context.createBufferSource();
// request = new XMLHttpRequest();

// request.open('GET', 'guitar-loop.wav', true);
// request.responseType = 'arraybuffer';

// request.onload = function() {
//   var audioData = request.response;

//   context.decodeAudioData(audioData, function(buffer) {
//       source.buffer = buffer;

//       console.log(buffer.duration);
//       console.log(buffer.length);
//       console.log(buffer.sampleRate);

//       source.connect(analyser);
//       // source.loop = true;

//       analyser.connect(processor);
//       processor.connect(gainNode);

//       gainNode.connect(context.destination)

//       source.start();
//       // generateSomeOutput();
//     },

//     function(e){"Error with decoding audio data" + e.err});
// }

// request.send();


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
    // analyser.getByteFrequencyData(dataArray);

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

// visualizeSine();
// visualizeBar();

var audioCtx = new AudioContext();
var seconds = 60;
var offlineCtx = new OfflineAudioContext(1, 44100 * seconds, 44100);
console.log("Ctx sampleRate: " + offlineCtx.sampleRate);
console.log("Ctx buffer length: " + 44100 * seconds);
var analyser = offlineCtx.createAnalyser();
analyser.fftSize = 4096;

var processor = offlineCtx.createScriptProcessor(16384, 1, 1);
processor.connect(offlineCtx.destination);
console.log("Processor length: " + processor.bufferSize);

var source = offlineCtx.createBufferSource();
var i = 0;
var array = [];
var noteArray = [];
// offlineCtx.on

var startTime, stopTime, resultTime;

function getData() {
  request = new XMLHttpRequest();
  request.open('GET', 'big-jet-plane.mp3', true);
  request.responseType = 'arraybuffer';

  function getBiggestBin(data) {
    var maxVal = Math.max.apply(Math, data);
    return data.indexOf(maxVal);
  }

  function calcFreqFromBin(binNum, sampleRate, fftSize) {
    return (sampleRate/fftSize) * binNum;
  }

  function noteFromPitch( frequency ) {
    var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
    var noteString = Math.round( noteNum ) + 69;
    return noteStrings[noteString%12];
  }


  request.onload = function() {
    var audioData = request.response;

    offlineCtx.decodeAudioData(audioData, function(buffer) {
      myBuffer = buffer;
      source.buffer = myBuffer;
      source.connect(analyser);
      analyser.connect(processor);
      console.log("Analyzer FFT Size: " + analyser.fftSize);
      processor.onaudioprocess = function(e){
          var data =  new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          // analyser.getFloatTimeDomainData(data);
          // average = getAverageVolume(data);
          // max = Math.max.apply(Math, data);
          // coord = Math.min(average*2,255);
          // coord = Math.round((max+coord)/2);
          // ctx.fillStyle=gradient;
          // ctx.fillRect(i,255-coord,1,255);
          // console.log(i+' -> '+ data);
          noteArray.push(noteFromPitch(calcFreqFromBin(getBiggestBin(data), myBuffer.sampleRate, analyser.fftSize)));
          array.push(data);
          i++;
      }
      source.start();
      startTime = new Date().getTime();
      offlineCtx.startRendering().then(function(renderedBuffer) {
        stopTime = new Date().getTime();
        resultTime = stopTime - startTime;
        console.log("Processing took " + resultTime / 100 + " seconds");
        console.log(array);
        console.log(noteArray);

      });

      // console.log(analyser.);
      console.log("Song duration: " + myBuffer.duration);
      console.log("Buffer length: " + myBuffer.length);
      console.log("Buffer sampleRate: " + myBuffer.sampleRate);
      //source.loop = true;
      // offlineCtx.startRendering().then(function(renderedBuffer) {
      //   console.log('Rendering completed successfully');
      //   var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      //   var song = audioCtx.createBufferSource();
      //   song.buffer = renderedBuffer;

      //   song.connect(audioCtx.destination);

      //   // play.onclick = function() {
      //   //   song.start();
      //   // }
      // }).catch(function(err) {
      //     console.log('Rendering failed: ' + err);
      //     // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
      // });
    });
  }

  request.send();
}

// Run getData to start the process off

getData();

function generateSomeOutput(  ) {

  analyser.fftSize = 32;
  var bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);
  var dataArray = new Uint8Array(bufferLength);

  // for (var i = 1; i <= source.buffer.length; i++) {
  //   analyser.getByteFrequencyData(somearray);
  //   console.log(somearray);
  // };


  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    console.log(dataArray);
    console.log('getByteFrequencyData: ' + dataArray.length);
  }
  draw();
}

// generateSomeOutput();
var MIN_SAMPLES = 0;
function autoCorrelate( buf, sampleRate ) {
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
  if (rms<0.01) // not enough signal
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
      // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
      // Now we need to tweak the offset - by interpolating between the values to the left and right of the
      // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
      // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
      // (anti-aliased) offset.

      // we know best_offset >=1, 
      // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
      // we can't drop into this clause until the following pass (else if).
      var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
      return sampleRate/(best_offset+(8*shift));
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
    return sampleRate/best_offset;
  }
  return -1;
//  var best_frequency = sampleRate/best_offset;
}