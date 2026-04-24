let grasses = [];
let bubbles = [];
let grassColors = ['#004b23', '#006400', '#007200', '#008000', '#38b000', '#70e000', '#9ef01a', '#ccff33'];
let popSound;
let soundEnabled = false;

function preload() {
  popSound = loadSound('pop.mp3');
}

function setup() {
  let iframe = createElement('iframe');
  iframe.attribute('src', 'https://www.et.tku.edu.tw');
  iframe.style('position', 'absolute');
  iframe.style('top', '0');
  iframe.style('left', '0');
  iframe.style('width', '100%');
  iframe.style('height', '100%');
  iframe.style('border', 'none');
  iframe.style('z-index', '-1');
  createCanvas(windowWidth, windowHeight);
  // 產生 80 條水草
  for (let i = 0; i < 80; i++) {
    let x = map(i, 0, 79, -50, width + 50); // 位置
    let h = random(height * 0.2, height * 0.3); // 高度
    let c = color(grassColors[i % grassColors.length]); // 顏色
    c.setAlpha(150);
    let w = random(40, 50); // 粗細
    let s = random(0.005, 0.02); // 搖晃頻率
    grasses.push(new Grass(x, h, c, w, s));
  }
}

function mousePressed() {
  userStartAudio();
  soundEnabled = !soundEnabled;
}

function draw() {
  clear();

  // 產生並管理氣泡
  if (frameCount % 20 === 0) { // 每 20 幀產生一個氣泡
    bubbles.push(new Bubble());
  }
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display();
    if (bubbles[i].isFinished()) {
      bubbles.splice(i, 1);
    }
  }

  for (let g of grasses) {
    g.display();
  }
}

class Grass {
  constructor(x, h, c, w, s) {
    this.x = x;
    this.h = h;
    this.color = c;
    this.weight = w;
    this.speed = s;
    // 每個水草有獨立的 noise 偏移
    this.noiseOffset = random(1000);
  }

  display() {
    stroke(this.color);
    strokeWeight(this.weight);
    noFill();

    beginShape();
    curveVertex(this.x, height); // 起始控制點
    curveVertex(this.x, height); // 起始點
    for (let y = height; y >= height - this.h; y -= 10) {
      let n = noise(frameCount * this.speed + this.noiseOffset, y * 0.01);
      let xOffset = map(n, 0, 1, -100, 100);
      let sway = xOffset * ((height - y) / this.h);
      curveVertex(this.x + sway, y);
    }
    endShape();
  }
}

class Bubble {
  constructor() {
    this.x = random(width);
    this.y = height + 10; // 從底部下方生成
    this.size = random(30, 50);
    this.speed = random(1, 3);
    // 設定泡泡破裂的高度 (在視窗高度的 10% 到 80% 之間隨機破裂)
    this.popY = random(height * 0.1, height * 0.8);
    this.popping = false;
    this.popTimer = 0;
  }

  update() {
    if (!this.popping) {
      this.y -= this.speed;
      // 到達指定高度或太高時破裂
      if (this.y < this.popY) {
        this.popping = true;
        if (soundEnabled) {
          popSound.play();
        }
      }
    } else {
      this.popTimer++;
    }
  }

  display() {
    if (!this.popping) {
      noStroke();
      fill(255, 127); // 白色，透明度 0.5 (127/255)
      circle(this.x, this.y, this.size);
    } else {
      // 破裂效果：空心圓圈變大並淡出
      noFill();
      stroke(255, map(this.popTimer, 0, 10, 127, 0));
      circle(this.x, this.y, this.size + this.popTimer * 2);
    }
  }

  isFinished() {
    return (this.popping && this.popTimer > 10) || (this.y < -50);
  }
}
