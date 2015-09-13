
document.querySelector('#timeleft').innerHTML = parseInt(songSeconds) - Math.floor(timePlayed);



// normalize notes first??
// calc score
// create gain node and make it work
// get new Ctx from input stream, auto correlate


var gameloop = function() {
  document.querySelector('#startgame').classList.add('is-hidden');
  console.log('game is running');


  // create audio buffer to live play from offline buffer
  // rewrite timing functions to work with time calc from this context
};