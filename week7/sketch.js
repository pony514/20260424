let capture;
let hearts = []; // 存放愛心的陣列

function setup() {
  // 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML 影片元件，只在畫布上繪製
  capture.hide();
}

function draw() {
  background('#e7c6ff');
  
  // 計算顯示影像的寬高 (整個畫布寬高的 60%)
  let w = width * 0.6;
  let h = height * 0.6;
  
  let videoX = (width - w) / 2;
  let videoY = (height - h) / 2;

  // 擷取影像並顯示在畫布中間
  image(capture, videoX, videoY, w, h);

  // 每隔幾幀產生一個新愛心
  if (frameCount % 10 === 0) {
    hearts.push(new Heart(videoX, videoY, w, h));
  }

  // 更新並顯示所有愛心
  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].display();
    
    // 如果愛心飄出畫面頂部，就從陣列移除
    if (hearts[i].isDead()) {
      hearts.splice(i, 1);
    }
  }
}

// 愛心類別
class Heart {
  constructor(vx, vy, vw, vh) {
    this.size = random(15, 40);
    // 讓愛心從攝影機影像的底部隨機位置出現
    this.x = random(vx, vx + vw);
    this.y = vy + vh;
    this.speed = random(1, 3); // 向上漂浮的速度
    this.color = color(random(200, 255), random(100, 200), random(100, 200), random(100, 200));
    this.noiseOffset = random(1000); // 增加一點左右晃動感
  }

  update() {
    this.y -= this.speed; // 向上移動
    // 使用 noise 讓愛心左右輕微晃動
    this.x += map(noise(this.noiseOffset), 0, 1, -1, 1);
    this.noiseOffset += 0.01;
  }

  display() {
    fill(this.color);
    noStroke();
    this.drawHeart(this.x, this.y, this.size);
  }

  isDead() {
    return this.y < -this.size;
  }

  // 繪製愛心的自定義函式
  drawHeart(x, y, size) {
    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
  }
}
