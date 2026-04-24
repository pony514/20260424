// 用來儲存畫面上所有多邊形物件的陣列。
let shapes = [];
// 用來儲存泡泡物件的陣列。
let bubbles = [];
// 儲存載入的音樂檔案。
let song;
// p5.Amplitude 物件，用來解析音樂的音量振幅。
let amplitude;

// 外部定義的二維陣列，做為多邊形頂點的基礎座標。
const points =  [[-3, 5], [3, 7], [1, 5],[2,4],[4,3],[5,2],[6,2],[8,4],[8,-1],[6,0],[0,-3],[2,-6],[-2,-3],[-4,-2],[-5,-1],[-6,1],[-6,2]];

/**
 * 在程式開始前預載入外部音樂資源。
 */
function preload() {
  // 請將 'midnight-quirk-255361.mp3' 替換成您的音訊檔案路徑
  song = loadSound('midnight-quirk-255361.mp3');
}

/**
 * 初始化畫布、音樂播放狀態與生成多邊形物件。
 */
function setup() {
  createCanvas(windowWidth, windowHeight);

  // 初始化 amplitude 物件
  amplitude = new p5.Amplitude();

  // 產生 10 個形狀物件
  for (let i = 0; i < 10; i++) {
    const shapeMultiplier = random(10, 30);
    shapes.push({
      x: random(width),
      y: random(height),
      dx: random(-3, 3),
      dy: random(-3, 3),
      color: color(random(255), random(255), random(255)),
      points: points.map(p => [p[0] * shapeMultiplier, p[1] * shapeMultiplier])
    });
  }
}

/**
 * 瀏覽器需要使用者互動才能播放音訊。
 * 點擊滑鼠來播放或暫停音樂。
 */
function mousePressed() {
  if (song.isPlaying()) {
    song.stop();
  } else {
    song.loop();
  }
}

/**
 * 每幀重複執行，處理背景更新、抓取音量與繪製動態圖形。
 */
function draw() {
  background('#b2f0ff');

  // 產生泡泡：每隔一段時間產生一個新的泡泡
  if (frameCount % 15 === 0) {
    bubbles.push({
      x: random(width),
      y: height + 50,
      size: random(10, 40),
      speed: random(1, 3),
      popY: random(0, height * 0.8), // 設定泡泡破掉的高度
      popped: false,
      popTimer: 0
    });
  }

  // 更新並繪製所有泡泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    if (!b.popped) {
      // 泡泡上升
      b.y -= b.speed;
      b.x += random(-1, 1); // 輕微左右擺動
      noStroke();
      fill(255, 100); // 白色偏透明
      circle(b.x, b.y, b.size);
      // 繪製高光
      fill(255, 200);
      circle(b.x + b.size * 0.25, b.y - b.size * 0.25, b.size * 0.2);
      
      // 檢查是否到達破掉的位置
      if (b.y < b.popY) {
        b.popped = true;
      }
    } else {
      // 破掉的效果：圓圈放大並消失
      b.popTimer++;
      noFill();
      stroke(255, map(b.popTimer, 0, 15, 255, 0));
      strokeWeight(2);
      circle(b.x, b.y, b.size + b.popTimer * 4);
      // 動畫結束後移除泡泡
      if (b.popTimer > 15) {
        bubbles.splice(i, 1);
      }
    }
  }

  strokeWeight(2);

  // 取得當前音量大小
  const level = amplitude.getLevel();
  // 將音量大小映射到縮放倍率
  const sizeFactor = map(level, 0, 1, 0.5, 2);

  // 走訪、更新並繪製所有形狀
  for (const shape of shapes) {
    // 更新位置
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > width) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > height) {
      shape.dy *= -1;
    }

    push();
    translate(shape.x, shape.y);
    if (shape.dx > 0) {
      scale(-sizeFactor, sizeFactor);
    } else {
      scale(sizeFactor);
    }
    fill(shape.color);
    stroke(shape.color);
    beginShape();
    for (const p of shape.points) {
      vertex(p[0], p[1]);
    }
    endShape(CLOSE);
    pop();
  }
}

/**
 * 當視窗大小改變時，自動調整畫布大小。
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
