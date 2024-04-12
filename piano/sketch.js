// ********************************
// BACKGROUND SUBTRACTION EXAMPLE *
// ********************************
//Further development Implemented:
// 1) customized the color, opacity appearance of the basic grids. 
// - changed the colors of ellipse 
// - changed the opacity of the ellipse to random 
// - added the stroke to change the appearance of the ellipse

// 2) Implemented the core p5.js, plays random notes when movement is detected 

var video;
//step 1
var prevImg;
var diffImg;
var currImg;
var thresholdSlider;
var threshold;
var grid;


function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();

    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);
    getAudioContext().suspend(); 

    //step3  
    grid = new Grid(640,480);

}

function draw() {
    background(0);
    image(video, 0, 0);

    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);

    //step4
    currImg.resize(currImg.width/4,currImg.width/4);
    currImg.filter(BLUR,3);

    diffImg = createImage(video.width, video.height);
    //step5
    diffImg.resize(diffImg.width/4,diffImg.width/4);
    diffImg.loadPixels();

    strokeWeight(2);
    threshold = thresholdSlider.value();

    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
                var index = (x + (y * currImg.width)) * 4;
                var redSource = currImg.pixels[index + 0];
                var greenSource = currImg.pixels[index + 1];
                var blueSource = currImg.pixels[index + 2];

                var redBack = prevImg.pixels[index + 0];
                var greenBack = prevImg.pixels[index + 1];
                var blueBack = prevImg.pixels[index + 2];

                var d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                if (d > threshold) {
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                } else {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }
    diffImg.updatePixels();
    image(diffImg, 640, 0);

    noFill();
    stroke(255);
    text(threshold, 160, 35);
    text(getAudioContext().state, width/2, height/2);


    //step2
    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);

    //step3  
    grid.run(diffImg);

}

// function keyPressed() {
//    prevImg = createImage(currImg.width, currImg.height);
//     prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);
//     console.log("saved new background");
// }

function distSquared(x1, y1, z1, x2, y2, z2){
  var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
  return d;
}
