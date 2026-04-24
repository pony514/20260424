let topPoints = [];
let bottomPoints = [];
let gameState = "START"; // START, PLAYING, FAIL, SUCCESS

function setup() {
  createCanvas(windowWidth, windowHeight);
  generatePath();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generatePath();
}

function generatePath() {
  topPoints = [];
  bottomPoints = [];
  let xStart = width * 0.02; // 起點佔寬度 15%
  let xEnd = width * 1;   // 終點佔寬度 85%
  let step = (xEnd - xStart) / 19; // 修正為 20 個點的間距
  
  // 產生 20 個點連成一條線
  for (let i = 0; i < 20; i++) {
    let x = xStart + i * step;
    let y = random(height * 0.5, height * 0.65);
    topPoints.push({ x: x, y: y });
    // 下方點距離 15 到 45 間
    let gap = random(80, 100);
    bottomPoints.push({ x: x, y: y + gap });
  }
}

function draw() {
  background("#7161ef");
  
  if (gameState === "START") {
    drawStartScreen();
  } else if (gameState === "PLAYING") {
    drawGame();
    checkCollision();
    checkWin();
  } else if (gameState === "FAIL") {
    showEndScreen("FAILED!", color(255, 0, 0));
  } else if (gameState === "SUCCESS") {
    showEndScreen("SUCCESS!", color(0, 150, 0));
  }
}

function drawStartScreen() {
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  // 繪製遊戲標題
  fill(255); // 白色文字
  textSize(min(width * 0.07, 60)); 
  text("電流急急棒遊戲", width / 2, height * 0.3);

  let startX = width * 0.08;
  fill("#e0d9ff");
  rect(startX, height / 2, 80, 50);
  fill(0);
  noStroke();
  textSize(16);
  text("START", startX, height / 2);
  if (mouseIsPressed && dist(mouseX, mouseY, startX, height / 2) < 40) {
    gameState = "PLAYING";
  }
}

function drawGame() {
  stroke("#17bebb");
  strokeWeight(3);
  noFill();

  // 使用 curveVertex 繪製上方與下方曲線
  beginShape();
  if (topPoints.length > 0) {
    curveVertex(topPoints[0].x, topPoints[0].y); // 起始控制點
    for (let p of topPoints) curveVertex(p.x, p.y);
    curveVertex(topPoints[topPoints.length - 1].x, topPoints[topPoints.length - 1].y); // 結束控制點
  }
  endShape();

  beginShape();
  if (bottomPoints.length > 0) {
    curveVertex(bottomPoints[0].x, bottomPoints[0].y);
    for (let p of bottomPoints) curveVertex(p.x, p.y);
    curveVertex(bottomPoints[bottomPoints.length - 1].x, bottomPoints[bottomPoints.length - 1].y);
  }
  endShape();

  // 繪製滑鼠位置的小紅點
  fill(255, 0, 0);
  noStroke();
  ellipse(mouseX, mouseY, 10, 10);

  // 繪製結束鈕
  noStroke();
  fill("#b79ced");
  let endX = width - 25;
  rect(endX, height / 2, 50, height * 0.4);
  fill(0);
  textSize(16);
  text("END", endX, height / 2);
}

function checkCollision() {
  for (let i = 0; i < topPoints.length - 1; i++) {
    if (isNear(topPoints[i], topPoints[i+1]) || isNear(bottomPoints[i], bottomPoints[i+1])) {
      gameState = "FAIL";
    }
  }
}

function isNear(p1, p2) {
  // 使用投影法計算點到線段的最短距離，以精準偵測紅點碰撞
  let lineDist = dist(p1.x, p1.y, p2.x, p2.y);
  if (lineDist === 0) return dist(mouseX, mouseY, p1.x, p1.y) < 8;
  let t = ((mouseX - p1.x) * (p2.x - p1.x) + (mouseY - p1.y) * (p2.y - p1.y)) / (lineDist * lineDist);
  t = constrain(t, 0, 1);
  let d = dist(mouseX, mouseY, p1.x + t * (p2.x - p1.x), p1.y + t * (p2.y - p1.y));
  return d < 8; // 紅點半徑 5 + 線條寬度緩衝
}

function checkWin() {
  if (mouseX > width - 50) gameState = "SUCCESS";
}

function showEndScreen(msg, clr) {
  textAlign(CENTER, CENTER);
  textSize(width * 0.08); // 文字大小隨螢幕寬度縮放
  fill(clr);
  text(msg, width / 2, height / 2);
  textSize(width * 0.02);
  fill(0);
  text("Click anywhere to restart", width / 2, height / 2 + height * 0.1);
  if (mouseIsPressed && frameCount % 60 > 30) {
    generatePath();
    gameState = "START";
  }
}
