

var Visual = function() {
  this.init();
}

Visual.prototype = {

  canvas: document.querySelector('#playalong'),
  ctx: null,
  width: Math.floor(window.innerWidth / 100 * 90),
  height: 300,

  graphStroke: 5,
  graphBase: null,

  barMargin: 5,
  numOfBars: null,
  barWidth: null,
  actualUsedWidth: null,

  lastCalledTime: null,
  delta: null,
  indicatorPosition: 0,

  init: function() {
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.graphBase = this.height - (this.graphStroke * 10);
    this.numOfBars = (offline.offlineFFTArray.length * (game.songDuration * 2 / offline.offlineFFTArray.length));
    this.barWidth = Math.floor(this.width / this.numOfBars);
    this.actualUsedWidth = this.numOfBars * this.barWidth;
  },

  draw: function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawIndicator();
    this.drawGraph();
    this.drawNotes();
  },

  drawIndicator: function() {
    this.ctx.fillStyle = "#fff400";
    var indicatorMaxLength = this.actualUsedWidth;
    var indicatorStart = (this.width - this.actualUsedWidth) / 2;
    var timeoffset = game.timeIn / game.songDuration;
    this.indicatorPosition = this.actualUsedWidth * timeoffset;
    if (this.indicatorPosition < indicatorMaxLength) {
      this.ctx.fillRect(indicatorStart, this.height - (this.graphStroke * 5), this.indicatorPosition, this.graphStroke);
    }
  },

  drawNotes: function() {
    this.ctx.font = "22px League Spartan";
    var prevNote = '';
    var sampleWidths = this.actualUsedWidth / offline.offlineFFTArray.length;

    for (var j = 0; j < offline.offlineNotesArray.length; j++) {
      if (offline.offlineNotesArray[j] !== undefined) {
        if (prevNote !== offline.offlineNotesArray[j]) {
          prevNote = offline.offlineNotesArray[j];
          if (offline.offlineNotesArray[j + 1] !== offline.offlineNotesArray[j - 1]) { // if only one sample is different

            if (((j - 3) * sampleWidths) + ((this.width - this.actualUsedWidth) / 2) > this.indicatorPosition) {
              this.ctx.fillStyle = "#C5D8DF";
            } else {
              this.ctx.fillStyle = "#025275";
            }
            this.ctx.fillText(offline.offlineNotesArray[j], (j * sampleWidths) + ((this.width - this.actualUsedWidth) / 2), 22);

          }
        } else if (prevNote === '') {
          prevNote = offline.offlineNotesArray[j];
        }
      }
    };
  },

  drawGraph: function() {
    this.ctx.fillStyle = "#025275";
    this.ctx.fillRect(0, this.graphBase, this.width, this.graphStroke);

    var gradient1 = this.ctx.createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(1, "#025275");
    gradient1.addColorStop(0, "#ffffff");

    var gradient2 = this.ctx.createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(1, "#025275");
    gradient2.addColorStop(0, "#509abb");

    for (var i = 0; i < this.numOfBars; i++) {
      var barHeight = (Math.max.apply(Math, offline.offlineFFTArray[i]) * 0.8);
      if (((i - 3) * this.barWidth) + ((this.width - this.actualUsedWidth) / 2) > this.indicatorPosition) {
        this.ctx.fillStyle = gradient1;
      } else {
        this.ctx.fillStyle = gradient2;
      }

      this.ctx.fillRect((i * this.barWidth) + ((this.width - this.actualUsedWidth) / 2), this.graphBase - barHeight, this.barWidth, barHeight);
    };
  }

}

