let input;
let slider;
let waveButton;
let isWaving = false;
let webDiv;
let sel;
let iframe;

function setup() {
  // 建立一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);

  // 建立文字輸入框
  input = createInput();
  // 設定輸入框的位置
  input.position(20, 20);
  input.size(200,25); //


  // 建立滑桿，範圍 15 到 80，預設值為 32
  slider = createSlider(15, 80, 32);
  // 設定滑桿位置：輸入框 X 座標 + 輸入框寬度 + 50px 間距
  slider.position(input.x + input.width + 50, 20);

  // 建立按鈕
  waveButton = createButton('波動');
  // 設定按鈕位置：滑桿 X 座標 + 滑桿寬度 + 50px 間距
  waveButton.position(slider.x + slider.width + 50, 20);
  waveButton.size(150, 50);
  waveButton.style('font-size', '20px');
  waveButton.mousePressed(toggleWave);

  // 建立下拉式選單
  sel = createSelect();
  // 設定下拉式選單位置：按鈕 X 座標 + 按鈕寬度 + 50px 間距
  sel.position(waveButton.x + waveButton.width + 50, 20);
  // 加入選項
  sel.option('淡江大學');
  sel.option('教科系');
  // 設定預設選項
  sel.selected('教科系');
  // 綁定 changed 事件
  sel.changed(changeURL);

  // 建立一個 div 來容納 iframe
  webDiv = createDiv('');
  webDiv.position(200, 200);
  webDiv.size(windowWidth - 400, windowHeight - 400);
  // 加上白色背景與邊框，使其更明顯
  webDiv.style('background-color', 'white');
  webDiv.style('border', '1px solid black');
  webDiv.style('overflow', 'hidden'); // 隱藏 iframe 可能的捲軸

  // 建立 iframe 並設定其屬性
  iframe = createElement('iframe', '');
  iframe.attribute('src', 'https://www.et.tku.edu.tw');
  iframe.style('width', '100%');
  iframe.style('height', '100%');
  iframe.style('border', 'none');
  iframe.parent(webDiv);

  // 設定文字框預設內容
  input.value('教科系');

  // 設定文字大小與對齊方式
  textAlign(LEFT, CENTER);
}

function draw() {
  background(220);
  
  // 依據滑桿的值動態改變文字大小
  textSize(slider.value());

  // 從輸入框取得使用者輸入的文字
  let str = input.value();

  // 確保字串長度大於 0 才進行繪製
  if (str.length > 0) {
    // 計算單一字串的寬度
    let strWidth = textWidth(str);

    // 避免 strWidth 為 0 造成無限迴圈或除以零的錯誤
    if (strWidth > 0) {
      let spacing = 30; // 設定間距為 30px
      let textH = textAscent() + textDescent(); // 取得文字高度

      // 計算水平和垂直方向需要的重複次數，以填滿整個螢幕
      let cols = ceil(width / (strWidth + spacing));
      let rows = ceil(height / (textH + spacing));

      // 定義色票陣列
      let colors = ["#012a4a", "#013a63", "#01497c", "#014f86", "#2a6f97", "#2c7da0", "#468faf", "#61a5c2", "#89c2d9", "#a9d6e5"];

      // 使用雙重迴圈將文字鋪滿整個畫面
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          let offsetX = 0;
          let offsetY = 0;

          // 如果波動模式開啟，依據 sin 函數產生位移
          if (isWaving) {
            let waveSpeed = 0.1;
            let waveFrequency = 0.4;
            let waveAmplitude = 15;
            // 讓 Y 軸位移與文字的水平位置 (i) 和時間 (frameCount) 相關
            offsetY = sin(i * waveFrequency + frameCount * waveSpeed) * waveAmplitude;
          }
          // 依據水平位置 i 循環使用色票中的顏色
          fill(colors[i % colors.length]);

          // 計算 X 和 Y 座標 (Y 軸需加上 textH/2 因為對齊方式為 CENTER)
          text(str, i * (strWidth + spacing) + offsetX, j * (textH + spacing) + textH / 2 + offsetY);
        }
      }
    }
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
// 並重新定位 DOM 元件
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  input.position(20, 20);
  slider.position(input.x + input.width + 50, 20);
  waveButton.position(slider.x + slider.width + 50, 20);
  sel.position(waveButton.x + waveButton.width + 50, 20);
  // 同步調整 div 的位置與大小
  if (webDiv) {
    webDiv.position(200, 200);
    webDiv.size(windowWidth - 400, windowHeight - 400);
  }
}

// 切換波動狀態的函式
function toggleWave() {
  isWaving = !isWaving;
}

// 當下拉選單改變時，更新 iframe 內容與輸入框文字
function changeURL() {
  const selectedValue = sel.value();
  let url = '';
  if (selectedValue === '淡江大學') {
    url = 'https://www.tku.edu.tw';
  } else if (selectedValue === '教科系') {
    url = 'https://www.et.tku.edu.tw';
  }
  iframe.attribute('src', url);
  input.value(selectedValue);
}
