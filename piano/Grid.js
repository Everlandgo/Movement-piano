var monoSynth=new p5.MonoSynth();

class Grid {
  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];
    this.noteState = [];

    // initalise grid structure and state
    for (var x=0;x<_w;x+=this.noteSize){
      var posColumn = [];
      var stateColumn = [];
      for (var y=0;y<_h;y+=this.noteSize){
        posColumn.push(createVector(x+this.noteSize/2,y+this.noteSize/2));
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
    }
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img){
    // draw active notes
    fill(255);
    //noStroke();
    stroke(255);

    let r =0;

    for (var i=0;i<this.notePos.length;i++){
      for (var j=0;j<this.notePos[i].length;j++){
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        if (this.noteState[i][j]>0) {
          //for further development-1  changing opacity
          r = random(50, 500);
          var alpha = this.noteState[i][j] * r;

          //for further development-1  changing colors
          var c1 = color(68, 109, 246,alpha);
          var c2 = color(194, 231, 218,alpha);
          var mix = lerpColor(c1, c2, map(i, 0, this.notePos.length, 0, 1));

          fill(mix);
          var s = this.noteState[i][j];

          // using the noteState to change the stroke weight of the stroke to give more fading effect
          strokeWeight(s*5);

          ellipse(x, y, this.noteSize*s, this.noteSize*s); 

          //play sound when note is active
          playnotes(this.notePos[i][j].y);
        }
        //reduced the reduction to 0.03 from 0.05 to have like a fading effect
          this.noteState[i][j]-=0.03;
          this.noteState[i][j]=constrain(this.noteState[i][j],0,1);
      }
    }
  }
  /////////////////////////////////
  findActiveNotes(img){
    for (var x = 0; x < img.width; x += 1) {
        for (var y = 0; y < img.height; y += 1) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index + 0];
            if (state==0){ // if pixel is black (ie there is movement)
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.noteSize);
              var j = int(screenY/this.noteSize);
              this.noteState[i][j] = 1;
            }
        }
    }
  }
}
// play sounds when note is activated
function playnotes(y)
{
  print(y);
  let note ='A4';

  // the height of the canvas is 480
  //according to the y axis of the active notes different notes are played 
  if(y<=120){
    note='A4';
  }
  else if(y>120 && y<=240){
    note='B4';
  }
  else if(y>240 && y<=360){
    note='C5';
  }
  else if (y>360 && y<=480){
   note='E5';
  }
  

	userStartAudio();
	
	// let note = random(['Fb4', 'G4']);
  //volume set to random between 0.5 to 1
	let velocity = random(0.5,1);
	let time = 0;

  //note duration
	let duration = 1/6;
  
  print("note: "+note);
	monoSynth.play(note, velocity, time, duration);
}
