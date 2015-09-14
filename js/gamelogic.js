
document.querySelector('#timeleft').innerHTML = parseInt(songSeconds) - Math.ceil(timePlayed);

var score = 0;

// normalize notes first??
// calc score
// create gain node and make it work
// get new Ctx from input stream, auto correlate


var startGame = function() {
  document.querySelector('#startgame').classList.add('is-hidden');
  console.log('game is running');


  gameloop();

  // create audio buffer to live play from offline buffer
  // rewrite timing functions to work with time calc from this context
};

var loopId;
var gameloop = function() {
  loopId = window.requestAnimationFrame(gameloop);
  // drawViz();

  // console.log(liveNote);
}


window.addEventListener('noteChange', function (e) {

  console.log('New note: ' + e.detail);
  console.log('Note played: ' + liveNote);

  if (e.detail != undefined) {
    if (e.detail === liveNote) {
      score += 100;
      document.querySelector('#score').innerHTML = score;
    }
  }
  

}, false);