// --- 5. カスタムメニュー設定関数 ---
function onOpen(e) {
  SlidesApp.getUi()
    .createMenu("GASメニュー")
    .addItem("🎨 スライドを生成", "create")
    .addToUi();
}
function create() {
  createPresentation(slideData, config, shape);

//  majicom としてライブラリ化した場合は↓を使う（この場合は↑は要らない）
//majicom.createPresentation(slideData, config, shape);
}

// スライド用の設定・カスタマイズ（※必要に応じて）
const config = {
  // この中身一式or一部は無くても大丈夫
  COLORS: {
    primary_color: "#990000",   // 強調(?)
    text_primary:  "#43494d",   // テキスト
  },
  CLOSING: {
    message: "ご清聴ありがとうございました"
  }

}
config.COLORS.text_closing = config.COLORS.primary_color;

const shape = {
  // この中身一式or一部は無くても大丈夫
}