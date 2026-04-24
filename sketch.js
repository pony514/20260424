let seeds = [];
let totalWeeks = 7; // 假設有 8 週的作品
let iframe;

function setup() {
  // 將畫布放入 HTML 的指定容器中
  let canvas = createCanvas(300, windowHeight);
  canvas.parent('canvas-container');
  
  // 取得右側的 iframe 元素
  iframe = select('#portfolio-frame');

  // 初始化週次種子 (Class 物件)
  for (let i = 0; i < totalWeeks; i++) {
    // 計算高度：第 1 週在最下面 (root)，第 8 週在上面
    let y = map(i, 0, totalWeeks - 1, height - 100, 100);
    // 設定各週 HTML 的路徑 (例如：week1/index.html)
    let url = `week${i + 1}/index.html`; 
    seeds.push(new Seed(y, i + 1, url));
  }
}

function draw() {
  background("#2f3e46"); // 柔和的紙張背景色
  
  // 1. 技術點：Vertex & For 繪製動態藤蔓時間軸
  drawTimeVine();

  // 2. 技術點：Class 物件更新與顯示
  for (let s of seeds) {
    s.update(mouseX, mouseY);
    s.display();
  }
}

function drawTimeVine() {
  noFill();
  stroke("#2a9d8f"); // 藤蔓顏色
  strokeWeight(4);
  
  beginShape();
  // 利用 for 迴圈與 vertex 從底部向上繪製波浪曲線
  for (let y = height; y >= 0; y -= 10) {
    // 結合 sin 與 frameCount 讓藤蔓像在水裡漂浮般微動
    let xOffset = sin(y * 0.01 + frameCount * 0.02) * 30;
    curveVertex(width / 2 + xOffset, y);
  }
  endShape();
}

function mousePressed() {
  // 檢查哪一個種子被點擊
  for (let s of seeds) {
    if (s.isHovered) {
      s.onClicked();
    }
  }
}

class Seed {
  constructor(y, week, url) {
    this.y = y;
    this.week = week;
    this.url = url;
    this.x = width / 2;
    this.size = 25;
    this.isHovered = false;
    this.bloomScale = 0; // 控制開花動畫的進度 (0 到 1)
  }

  update(mx, my) {
    // 種子的 X 座標也要隨藤蔓波動同步更新
    this.x = width / 2 + sin(this.y * 0.01 + frameCount * 0.02) * 30;
    
    let d = dist(mx, my, this.x, this.y);
    if (d < this.size * 0.8) {
      this.isHovered = true;
      this.bloomScale = lerp(this.bloomScale, 1, 0.1); // 平滑開花
    } else {
      this.isHovered = false;
      this.bloomScale = lerp(this.bloomScale, 0, 0.1); // 平滑縮回
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    
    // 懸停時的開花/跳動效果
    if (this.bloomScale > 0.01) {
      fill(255, 180, 180, 180 * this.bloomScale);
      noStroke();
      for (let i = 0; i < 5; i++) {
        rotate(TWO_PI / 5);
        ellipse(15 * this.bloomScale, 0, 20 * this.bloomScale, 15 * this.bloomScale);
      }
    }

    // 繪製核心種子
    stroke(this.isHovered ? 255 : 80, 120, 80);
    strokeWeight(2);
    fill(this.isHovered ? '#FFD700' : '#8B4513'); // 懸停變金色
    ellipse(0, 0, this.size);
    
    // 週次文字
    noStroke();
    fill(this.isHovered ? 0 : 255);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(this.week, 0, 0);
    pop();
  }

  onClicked() {
    // Iframe 整合：切換 iframe 的 src
    if (iframe) {
      iframe.attribute('src', this.url);
    }
  }
}
