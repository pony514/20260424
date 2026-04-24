function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

}

function draw() {
  background(85,60,70);
  for(let i=0; i<width; i+=100){ //
    var clr = color((frameCount/2+i/width*60)%360,100,100); //framecount隨時間變化

    //clr.setAlpha(i/width);
    fill(clr);
    ellipse(i, height/2,100,100)

  }
}
