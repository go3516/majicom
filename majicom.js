//---- 設定 ----
const CONFIG = {
  SETTINGS: {
    clear_all: true,
    presentation_id: null
  },

  FONTS: {
    family: "BIZ UDPGothic",
  },
  FONT_SIZES: {
    // 「ポイント」とのこと
    // https://developers.google.com/apps-script/reference/slides/text-style?hl=ja#setfontsizefontsize
    title: 32, date: 16,
    sectionTitle: 35, ghostNum: 120,
    header: 23, subhead: 18,
    body: 14, small: 10,
    kpi: 32, compare: 20, quoteText: 24, quoteAuthor: 16,
  },
  COLORS: {
    primary_color: "#4285F4", text_primary: "#333333", text_reverse: "#FFFFFF",
    // text_title:, text_section, text_closing も設定可能（基本は text_primary と同じ）
    bg_gray: "#f8f9fa", bg_white: "#ffffff", border: "#dadce0",
    faint_gray: "#e8eaed", neutral_gray: "#9e9e9e", ghost_gray: "#efefed",
  },
  CLOSING: {
    message: "Thank You",
  },
  AGENDA: {
    regexp: /(agenda|アジェンダ|目次|本日お伝えすること)/i,
  },

  // https://developers.google.com/apps-script/reference/slides/predefined-layout?hl=ja
  TYPE2LAYOUT: {
    title:    "TITLE",
    closing:  "TITLE",
    section:  "SECTION_HEADER",
    _default: "BLANK",
  },
  PRESET: {
    // https://developers.google.com/apps-script/reference/slides/list-preset?hl=ja
    ul:       "DISC_CIRCLE_SQUARE",   // 箇条書き「ディスク」、「円」、「正方形」
    ol:       "DIGIT_NESTED",         // 連番
    // https://developers.google.com/apps-script/reference/slides/line-category?hl=ja
    line:     "BENT",                 // コネクタの曲がり
    // https://developers.google.com/apps-script/reference/slides/arrow-style?hl=ja
    arrow:    "FILL_ARROW",           // 塗りつぶしの矢印
  },
  SPACING: {
    faq:      {space: 150},
//    content:  {},
//    compare:  {},
//    progress: {},
    _default: {space: 115, above: 0, below: 0.1, mode: "NEVER_COLLAPSE"},
  }

};

//---- 図形の位置とサイズ＋α ----
const  SHAPE = {
  // --- 基準となるページサイズと、ページを基準とするスライド・図形 ---
  BASE: {
    width:  960,
    height: 540,
    shape: { shapetype: "TEXT_BOX", align: "MIDDLE", ratio: {W:10, H:8} },
    text: { color: "text_primary", size: "body", bold: false, align: "START" },
  },

  // --- 基本スライド、パーツ(insertTextBox)
    titleSlide: {
      title:        { left: 50,  top: 200, width: 830, height: 90, centerH: true ,
                text: { color: "text_title", size: "title", bold: true } },
      date:         { left: 50,  top: 450, width: 250, height: 40 ,
                text: { color: "text_title", size: "date" } },
    },
    sectionSlide: {
      ghostNum:     { left: 35, top: 120, width: 400, height: 200 ,
                text: { color: "ghost_gray", size: "ghostNum", bold: true } },
      title:        { leftR: 1/4, top: 230, widthR: 2/3, height: 80 ,
                text: { color: "text_section", size: "sectionTitle", bold: true } },
    },
    closingSlide: {
      message:      { leftR: 1/2,  topR: 1/2, widthR: 2/3, height: 90 ,centerW: true, centerH: true,
                text: { color: "text_closing", size: "title", bold: true, align: "CENTER" } },
    },

    contentSlide: {   // FAQも contentSlide.boy 利用
      body:         { left: 25,  top: 140, width: 910, height: 350, align: "TOP" },
      twoColLeft:   { left: 25,  top: 140, width: 440, height: 350, align: "TOP" },
      twoColRight:  { left: 495, top: 140, width: 440, height: 350, align: "TOP" },
    },

    // ヘッダー
    header: {
      title:        { left: 25, top: 30, width: 900, height: 60,
                text: { size: "header", bold: true } },
      subhead:      { left: 25, top: 90, width: 900, height: 40, align: "TOP",
                text: { size: "subhead" } },
    },

    // --- 基準となる描画エリアと、描画エリアを基準とするスライド ---
    body: {
      area:         { left: 25, top: 130, width: 910, height: 360 },
      cards:        { left: 25, top: 190, width: 910, height: 300 },
    },
      // --- 個別スライド、パーツ(insertShapeRelative)
      // -- 2列固定のスライド（body.cards 基準）
      compareSlide: {
        head:         { left: 10, top: -40, width: 420, height: 40, color: "primary_color", border: "border",
                  text: { color: "text_reverse", bold: true, align: "CENTER" } },
          body:         { left: 0, top: 40, widthR: 10/10, height: 240, color: "bg_gray", border: "border" },
      },
      statsCompareSlide: {
        title:        { left: 10, top: -40, width: 420, height: 40, color: "primary_color",
                  text: { color: "text_reverse", bold: true, align: "CENTER" } },
          card:         { left: 0, top: 10, widthR: 10/10, height: 240, ratio: {W:1, H:4},
                    text: { size: "compare", bold: true, align: "CENTER" } },
            label:        { left: 0, topR: 1/10, widthR: 1/2, heightR: 2/10,
                      text: { color: "neutral_gray", bold: true } },
      },

      // -- 縦横可変なカード系（基本は body.area 基準、diagramだけ body.cards 基準）
      diagramSlide: {
        title:        { left: 10, top: -30, width: 420, height: 30, color: "bg_gray", border: "border",
                  text: { bold: true, align: "CENTER" } },
          card:         { leftR: 1/20, top: 10, widthR: 9/10, height: 60, shapetype: "ROUND_RECTANGLE", ratio: {W:1, H:4}, color: "bg_white", border: "border",
                    text: { align: "CENTER" } },
          line:         { weight: 2, color: "primary_color" },
      },

      cards: {
        card:         { left: 20, top: 20, width: 420, height: 240, shapetype: "ROUND_RECTANGLE", color: "bg_white",
                  text: { align: "CENTER" } },
      },
      headerCards: {
        card:         { left: 20, top: 20, width: 420, height: 280 },
          head:         { left: 0, top: 0, widthR: 10/10, height: 40, color: "primary_color", border: "primary_color",
                    text: { color: "text_reverse", bold: true, align: "CENTER" } },
            body:         { left: 0, topR: 10/10, widthR: 10/10, height: 240, border: "border",
                      text: { align: "CENTER" } },
      },
      kpiSlide: {
        kpi:          { left: 20, top: 20, width: 420, height: 240, border: "border",
                  text: { size: "kpi", bold: true, align: "CENTER" } },
          label:        { leftR: 1/20, topR: 1/20, widthR: 9/10, heightR: 4/20,
                    text: { color: "neutral_gray", align: "START" } },
          change:       { leftR: 1/20, topR: 15/20, widthR: 9/10, heightR: 4/20,
                    text: { align: "END" } }, 
      },

      // -- その他
      processSlide: {
        numBox:       { left: 40, top: 40, width: 28, height: 28, color: "primary_color",
                  text: { color: "text_reverse", bold: true, align: "CENTER" } },
        process:      { left: 80, top: 40, width: 800, height: 28 },
        line:         { weight: 2, color: "faint_gray" },
      },
      bulletCards: {
        card:         { left: 10, top: 10, width: 890, height: 90, ratio: {W:1, H:4}, color: "bg_gray", border: "border" },
      },

      quoteSlide: {
        quoteMark:    { left: 20,  top: 60, width: 100, height: 100, align: "TOP",
                  text: { color: "ghost_gray", size: "ghostNum", bold: true } },
        quoteText:    { left: 120, top: 80, width: 700, height: 150,
                  text: { size: "quoteText" } },
        author:       { left: 150, top: 240, width: 700, height: 30,
                  text: { color: "neutral_gray", size: "quoteAuthor", align: "END" } },
      },
      timelineSlide: {
        dot:          { left: 60, top: 160, width: 10, height: 10, shapetype: "ELLIPSE", color: "primary_color" },
          label:        { left: -50+5, top: -80, width: 100, height: 70, align: "BOTTOM",
                    text: { size: "small", bold: true, align: "CENTER" } },
          date:         { left: -50+5, top: 20, width: 100, height: 20, align: "TOP",
                    text: { size: "small", color: "neutral_gray", align: "CENTER" } },
          line:         { weight: 2, color: "neutral_gray" },
      },
      tableSlide: {
        table:        { left: 40, top: 160, width: 890, height: 330 },
          header:       { color: "bg_gray",
                    text: { bold: true, align: "CENTER" } },
          cells:       { align: "MIDDLE",
                    text: { align: "CENTER" } },
      }

};


//---- グローバル ----
const LF = String.fromCharCode(11); // 「改行（≠改段落）」コード（.asString() によると「改行」はCHAR(11) らしい、"\n"は「改段落」）
let SECTION_COUNTER = 0; // 章番号カウンタ（ゴースト数字用）
let SCALE = []; // ポイント(pt)vsピクセル(px)の比率（pt/px なので、pt=px*SCALE, px=pt/SCALE）


//---- スライド作成の分担 ----
const slideCreators = {
  // --- 基本スライド ---
  title:        createTitleSlide,
  section:      createSectionSlide,
  closing:      createClosingSlide,

  // --- 個別スライド ---
  content:      createContentSlide,
  faq:          createFaqSlide,

  // 2列固定
  compare:      createCompareSlide,
  statsCompare: createStatsCompareSlide,

  // 縦横可変なカード系
  diagram:      createDiagramSlide,
  cards:        createCardsSlide,
  headerCards:  createHeaderCardsSlide,
  kpi:          createKpiSlide,

  // その他
  process:      createProcessSlide,
  bulletCards:  createBulletCardsSlide,
  quote:        createQuoteSlide,
  timeline:     createTimelineSlide,
  table:        createTableSlide,

  progress:     createProgressSlide,

};


//---- スライド作成 ----
/**
 * スライドデータに基づいてプレゼンテーションを生成します。
 *
 * @param {Array<Object>} sd - 各スライドのコンテンツと設定を含むオブジェクトの配列。
 * @param {Object} [conf] - デフォルトのCONFIGを上書きするための設定オブジェクト（任意）。
 * @param {Object} [shape] - デフォルトのSHAPEを上書きするための図形定義オブジェクト（任意）。
 * @returns {void}
 * @throws {Error} - 対象のプレゼンテーションが見つからない場合にエラーをスローします。
 */
function createPresentation(sd, conf, shape) {
  // --- 準備 ---
  if (conf) { deepMerge(CONFIG, conf); }
  if (shape) { deepMerge(SHAPE, shape); }

  const presentation = CONFIG.SETTINGS.presentation_id
    ? SlidesApp.openById(CONFIG.SETTINGS.presentation_id)
    : SlidesApp.getActivePresentation();
  if (!presentation) throw new Error("対象のプレゼンテーションが見つかりません。");

  if (CONFIG.SETTINGS.clear_all) {
    const slides = presentation.getSlides();
    for (let i = slides.length - 1; i >= 0; i--) slides[i].remove();
  }

  SCALE = getScale(presentation);

  // --- ページごとのスライド作成 ---
//  Logger.log(`[DEBUG] slideData.length: ${sd.length}`);
  let page=0;
  for (const data of sd) {
    const creator = slideCreators[data.type];
    if (creator) {
      // type に応じたレイアウトで
      const pdl = CONFIG.TYPE2LAYOUT[data.type] || CONFIG.TYPE2LAYOUT["_default"];

      // スライド作成
      const slide = presentation.appendSlide(SlidesApp.PredefinedLayout[pdl]);
      creator(slide, data);

      // ノート作成
      if (data.notes) {
        const notesShape = slide.getNotesPage().getSpeakerNotesShape();
        if (notesShape) {
          // 長いと読みづらいので「。」で改行（改段落？）しておく
          notesShape.getText().setText(data.notes.replace(/。/g, "。\n"));
        }
      }
      ++page;
    }
  }
//  Logger.log(`[DEBUG] output page count: ${page}`);
}

// --- 基本スライド ---
// title
function createTitleSlide(slide, data) {
  let shape;
  // タイトル
  shape = "titleSlide.title";
  const titleShape = insertTextBox(slide, shape);
  setTextwSpec(titleShape, shape, data.title);

  // 日付
  shape = "titleSlide.date";
  const dateShape = insertTextBox(slide, shape);
  setTextwSpec(dateShape, shape, data.date || Utilities.formatDate(new Date(), "JST", "yyyy.MM.dd"));

}

// section
function createSectionSlide(slide, data) {
  let shape;
  // セクション番号
  SECTION_COUNTER++;
  shape = "sectionSlide.ghostNum";
  const numberShape = insertTextBox(slide, shape);
  setTextwSpec(numberShape, shape, String(SECTION_COUNTER).padStart(2, "0"));
 
  // タイトル
  shape = "sectionSlide.title";
  const sectionShape = insertTextBox(slide, shape);
  setTextwSpec(sectionShape, shape, data.title);

}

// closing
function createClosingSlide(slide, data) {
  // メッセージ
  let shape = "closingSlide.message";
  const closingShape = insertTextBox(slide, shape);
  setTextwSpec(closingShape, shape, CONFIG.CLOSING.message);

}

// --- 個別スライド ---
// content
function createContentSlide(slide, data) {
  // ヘッダー
  drawHeader(slide, data.title);
  drawSubHeader(slide, data.subhead);

  // 本文
  let contents = [];
  let columns = [];
  if ( data.columns ) {
    for ( let column of data.columns ) {
      // 2次元配列なので「改行」でペアにして、配列にしておく
      columns.push(column.join(LF));
    }
  }
  // 1次元配列になったcolumnsとdata.pointsを合わせて、2or1列に振り分け
  const points = data.points ? columns.concat(data.points) : columns;
  if ( data.twoColumn ) {
    const mid = Math.ceil(points.length / 2);

    contents.push(
      { shape: "contentSlide.twoColLeft", text: points.slice(0, mid) },
      { shape: "contentSlide.twoColRight", text: points.slice(mid) }
    );
  } else {
    contents.push(
      { shape: "contentSlide.body", text: points }
    );
  }

  // 2列かもだけど、それぞれの列内でやることは同じ
  const isAgenda = CONFIG.AGENDA.regexp.test(data.title);
  for ( let content of contents ) {
    const area = insertTextBox(slide, content.shape);
    const tr = setStyledText(area, content.shape, content.text.join("\n"));

    // 箇条書き
    tr.getListStyle().applyListPreset(SlidesApp.ListPreset[CONFIG.PRESET[isAgenda ? "ol" : "ul"]]);
    setSpacing(tr, data.type);

  }

}

// FAQ
function createFaqSlide(slide, data) {
  // ヘッダー
  drawHeader(slide, data.title || "よくあるご質問");
  drawSubHeader(slide, data.subhead);

  // 本文
  const shape = "contentSlide.body";
  const bodyArea = insertTextBox(slide, shape);
  let faq = [];
  for ( let item of data.items ) {
    // Q,Aを「改行」でペアに
    faq.push([
      `[[Q]]. ${item["q"]}`,
      `**A**. ${item["a"]}`
    ].join(LF));
  }
  // QAのペアを「改段落(\n)」でまとめて設定
  const tr = setStyledText(bodyArea, shape, faq.join("\n"));
  setSpacing(tr, data.type);

}

// --- 2列固定
// compare
function createCompareSlide(slide, data) {
  // ヘッダー
  drawHeader(slide, data.title);
  drawSubHeader(slide, data.subhead);

  // 描画エリア
  const bodyCard = insertTextBox(slide, "body.cards");  // 相対位置のために一旦作成「最後に消す」

  // --- タイトル ---
  // head(ers)（動的に）横に2つ
  let shapeHead = "compareSlide.head";
  let shapeBody = "compareSlide.body";

  const headers = insertCards(slide, bodyCard, shapeHead, 1, 2, 2);
  
  let c=0;
  for ( let d of ["left", "right"] ) {
    const head = headers[c++];
    setTextwSpec(head, shapeHead, data[`${d}Title`]);

    // 内容（head を起点に）
    const body = insertShapeRelative(slide, head, shapeBody);
    const tr = setStyledText(body, shapeBody, data[`${d}Items`].join("\n"))

    // 箇条書き
    tr.getListStyle().applyListPreset(SlidesApp.ListPreset[CONFIG.PRESET.ul]);
    setSpacing(tr, data.type);
  }

  bodyCard.remove();
}

// statsCompare
function createStatsCompareSlide(slide, data) {
  let shape;
  // ヘッダー
  drawHeader(slide, data.title);
  drawSubHeader(slide, data.subhead);

  // 描画エリア
  const bodyCard = insertTextBox(slide, "body.cards");  // 相対位置のために一旦作成「最後に消す」

  // --- タイトル ---
  // head(ers)（動的に）横に2つ
  shape = "statsCompareSlide.title";
  const headers = insertCards(slide, bodyCard, shape, 1, 2, 2);
  
  const length = data.stats.length;
  let c = 0;
  for ( let d of ["left", "right"] ) {
    setTextwSpec(headers[c++], shape, data[`${d}Title`]);
  }

  // --- 左右のカード ---
  const shapeCard = "statsCompareSlide.card";
  const shapeLabel = "statsCompareSlide.label";

  // --- 左側
  const cardL = insertCards(slide, bodyCard, shapeCard, length, 1, length, {parent: headers[0]});
  for ( let r=0 ; r<length ; r++ ) {
    // カード（headers を起点・参考に）
    const card = cardL[r];
    card.getBorder().setTransparent();
    setTextwSpec(card, shapeCard, data.stats[r].leftValue);

    // ラベル（card を起点に）
    const body = insertShapeRelative(slide, card, shapeLabel);
    setStyledText(body, shapeLabel, data.stats[r].label);

  }

  // --- 右側
  const trend = {
    "up"    : "↗",
    "down"  : "↘",
  }
  // cardR を作って、statsを順に ---
  const cardR = insertCards(slide, bodyCard, shapeCard, length, 1, length, {parent: headers[1]});
  for ( let r=0 ; r<length ; r++ ) {
    // カード（headers を起点・参考に）
    const card = cardR[r];
    card.getBorder().setTransparent();

    const text = data.stats[r].rightValue + (trend[data.stats[r]["trend"]] || "");
    setTextwSpec(card, shapeCard, text, {color: "primary_color"});

  }

  bodyCard.remove();
}

// --- 縦横可変なカード系
// diagram
function createDiagramSlide(slide, data) {
  let shape;
  // ヘッダー
  drawHeader(slide, data.title);
  drawSubHeader(slide, data.subhead);

  // 描画エリア
  const bodyCard = insertTextBox(slide, "body.cards");  // 相対位置のために一旦作成「最後に消す」

  // lane に応じて並べる（2～5列）6[列・lane]以降は表示されない
  const length = data.lanes.length;
  const cols = length < 5 ? Math.max(length, 2) : 5;

  // --- タイトル ---
  // head(ers)（動的に）横に2～5列
  shape = "diagramSlide.title";
  const headers = insertCards(slide, bodyCard, shape, 1, cols, cols);
  
  let c = 0;
  for ( let c=0 ; c<cols ; c++ ) {
    setTextwSpec(headers[c], shape, data.lanes[c].title || " ");
  }

  // --- laneを順に（横・列 方向） ---
  shape = "diagramSlide.card";
  let csl = [];
  for ( let l=0 ; l<cols ; l++ ) {

    // --- カード ---
    const rows = data.lanes[l].items.length;
    const cards = insertCards(slide, bodyCard, shape, rows, 1, rows, {parent: headers[l]});

    // --- itemsを順に（縦・行 方向） ---
    let cs = [];
    for ( let r=0 ; r<rows ; r++ ) {
      const card = cards[r];
      setStyledText(card, shape, data.lanes[l].items[r]);

      // カードを矢印でつなげる
      cs.push(card.getConnectionSites());
      // 左隣のlaneの同じ行に値があれば
      if ( l>0 && csl[l-1][r] ) {
        // 左回りで0,1,2, な模様
        // https://developers.google.com/apps-script/reference/slides/slide?hl=ja#insertlinelinecategory,-startconnectionsite,-endconnectionsite
        slide.insertLine(SlidesApp.LineCategory[CONFIG.PRESET.line], csl[l-1][r][3], cs[r][1])
          .setEndArrow(SlidesApp.ArrowStyle[CONFIG.PRESET.arrow])
          .setWeight(SHAPE.diagramSlide.line.weight || 2)
          .getLineFill().setSolidFill(CONFIG.COLORS[SHAPE.diagramSlide.line.color || "primary_color"]);

      }

    }
    csl.push(cs);
  }

  bodyCard.remove();
}

// cards
function createCardsSlide(slide, data) {
  // ヘッダー
  drawHeader(slide, data.title);
  drawSubHeader(slide, data.subhead);

  // 描画エリア
  const bodyArea = insertTextBox(slide, "body.area");  // 相対位置のために一旦作成「最後に消す」
  const length = data.items.length;
  // columns に応じて横、縦に並べる（2～3列）
  const cols = data.columns < 4 ? Math.max(data.columns, 2) : 3;
  const rows = Math.ceil(length/cols);

  // --- cards を作って、順に ---
  const shape = "cards.card";
  const cards = insertCards(slide, bodyArea, shape, rows, cols, length);

  for ( let r=0 ; r<rows ; r++ ) {
    for ( let c=0 ; c<cols ; c++ ) {
      const i = r*cols + c;
      if( i >= length ) { continue; }
      
      setStyledText(cards[i], shape, [
        `**${data.items[i].title}**`,
        data.items[i].desc
      ].join("\n\n"));

    }
  }

  bodyArea.remove();
}

// headerCards
function createHeaderCardsSlide(slide, data) {
  // ヘッダー
  drawHeader(slide, data.title);
  drawSubHeader(slide, data.subhead);

  // 描画エリア
  const bodyArea = insertTextBox(slide, "body.area");  // 相対位置のために一旦作成「最後に消す」
  const length = data.items.length;
  // columns に応じて横、縦に並べる（2～3列）
  const cols = data.columns < 3 ? 2: 3;
  const rows = Math.ceil(length/cols);


  // --- cardsを作って、順に ---
  const shape = "headerCards";
  const cards = insertCards(slide, bodyArea, `${shape}.card`, rows, cols, length);

  // カード内（ヘッダーと内容）の高さ
  SHAPE.headerCards.DYNAMIC_HEAD = {
    ...SHAPE.headerCards.head,
    height: Math.round(SHAPE.headerCards.head.height * (11-rows)/10),      // ヘッダーは10[%]ずつ縮める
  }
  SHAPE.headerCards.DYNAMIC_BODY = {
    ...SHAPE.headerCards.body,
    height: cards[0].getHeight()/SCALE.H - SHAPE.headerCards.DYNAMIC_HEAD.height,    // ボディは残り部分
  }

  // --- cardsを順に ---
  for ( let r=0 ; r<rows ; r++ ) {
    for ( let c=0 ; c<cols ; c++ ) {
      const i = r*cols + c;
      if( i >= length ) { continue; }

      // カード（親・プレースホルダ として）
      const card = cards[i];

      // ヘッダー（card を起点に）
      const head = insertShapeRelative(slide, card, `${shape}.DYNAMIC_HEAD`);
      setTextwSpec(head, `${shape}.head`, data.items[i].title);

      // 内容（head を起点に）
      const body = insertShapeRelative(slide, head, `${shape}.DYNAMIC_BODY`);
      setStyledText(body, `${shape}.body`, data.items[i].desc);

      card.remove();

    }
  }

  bodyArea.remove();
}

// KPI
function createKpiSlide(slide, data) {
  // ヘッダー
  drawHeader(slide, data.title || "KPI");
  drawSubHeader(slide, data.subhead);

  // 描画エリア
  const bodyArea = insertTextBox(slide, "body.area");  // 相対位置のために一旦作成「最後に消す」
  const length = data.items.length;
  // columns に応じて横、縦に並べる（2～4列）
  const cols = data.columns < 5 ? Math.max(data.columns, 2) : 4;
  const rows = Math.ceil(length/cols);

  // --- cards(KPI) を作って、順に ---
  const shape = "kpiSlide.kpi";
  const cards = insertCards(slide, bodyArea, shape, rows, cols, length);

  const shapeLabel = "kpiSlide.label";
  const shapeChange = "kpiSlide.change";

  // --- cardsを順に ---"

  for ( let r=0 ; r<rows ; r++ ) {
    for ( let c=0 ; c<cols ; c++ ) {
      const i = r*cols + c;
      if( i >= length ) { continue; }

      // KPI
      const kpi = cards[i];
      setTextwSpec(kpi, shape, data.items[i].value || "0");

      // label（kpi を起点に）
      const label = insertShapeRelative(slide, kpi, shapeLabel);
      setTextwSpec(label, shapeLabel, data.items[i].label || "KPI");

      // change（kpi を起点に）
      const change = insertShapeRelative(slide, kpi, shapeChange);
      setTextwSpec(change, shapeChange, data.items[i].change || " ", {
        bold: (data.items[i].status||"") == "good" ? true : false,
        color: (data.items[i].status||"").match(/(good|bad)/) ? "primary_color" : "text_primary"
      });

    }
  }

  bodyArea.remove();
}

// --- その他
// process
function createProcessSlide(slide, data) {
  // ヘッダー
  drawHeader(slide, data.title);
  drawSubHeader(slide, data.subhead);

  // 描画エリア
  const shapeNum = "processSlide.numBox";

  const bodyArea = insertTextBox(slide, "body.area");  // 相対位置のために一旦作成「最後に消す」
  const length = data.steps.length;
  const margin = getArea(bodyArea, shapeNum).H / length;

  // --- プロセスを順に ---
  const shapeProcess = "processSlide.process";
  let cs = [];
  for ( let i=0 ; i<length ; i++ ) {
    // 番号
    // パディングは調整できないらしい、ので諦める
    // https://qiita.com/k-akie/items/5a1aac7a53586bc6ec72
    const numBox = insertShapeRelative(slide, bodyArea, shapeNum, {offsetH: margin*i});
    setTextwSpec(numBox, shapeNum, i+1);

    // プロセス
    const process = insertShapeRelative(slide, bodyArea, shapeProcess, {offsetH: margin*i});
    setStyledText(process, shapeProcess, data.steps[i]);

    // プロセスを線でつなげる
    cs.push(numBox.getConnectionSites());
    if ( i > 0 ) {
      // 左回りで0,1,2, な模様
      // https://developers.google.com/apps-script/reference/slides/slide?hl=ja#insertlinelinecategory,-startconnectionsite,-endconnectionsite
      slide.insertLine(SlidesApp.LineCategory[CONFIG.PRESET.line], cs[i-1][2], cs[i][0])
        .setWeight(SHAPE.processSlide.line.weight || 2)
        .getLineFill().setSolidFill(CONFIG.COLORS[SHAPE.processSlide.line.color || "faint_gray"]);

    }

  }

  bodyArea.remove();
}

// bulletCards
function createBulletCardsSlide(slide, data) {
  // ヘッダー
  drawHeader(slide, data.title);
  drawSubHeader(slide, data.subhead);

  // 描画エリア
  const bodyArea = insertTextBox(slide, "body.area");  // 相対位置のために一旦作成「最後に消す」
  const length = data.items.length;

  // --- cardsを作って、順に ---
  const shape = "bulletCards.card";
  const cards = insertCards(slide, bodyArea, shape, length, 1, length);

  // --- Cardsを順に ---
  for ( let i=0 ; i<length ; i++ ) {
    // カード
    const card = cards[i];
    
    setStyledText(card, shape, [
      `**${data.items[i].title}**`,
      data.items[i].desc
    ].join(LF));

  }

  bodyArea.remove();
}

// quote
function createQuoteSlide(slide, data) {
  let shape;
  // ヘッダー
  drawHeader(slide, data.title || "引用");
  drawSubHeader(slide, data.subhead);

  // 描画エリア
  const bodyArea = insertTextBox(slide, "body.area");  // 相対位置のために一旦作成「最後に消す」

  // “（左ダブル引用符）
  shape = "quoteSlide.quoteMark";
  const markShpae = insertShapeRelative(slide, bodyArea, shape);
  setTextwSpec(markShpae, shape, "“");

  // テキスト
  shape = "quoteSlide.quoteText";
  const textShape = insertShapeRelative(slide, bodyArea, shape);
  setStyledText(textShape, shape, data.text);

  // 引用元
  shape = "quoteSlide.author";
  const authorShape = insertShapeRelative(slide, bodyArea, shape);
  setStyledText(authorShape, shape, (data.author ? `— ${data.author}` : " "));

  bodyArea.remove();
}

// timeline
function createTimelineSlide(slide, data) {
  // ヘッダー
  drawHeader(slide, data.title);
  drawSubHeader(slide, data.subhead);

  // 描画エリア
  const bodyArea = insertTextBox(slide, "body.area");  // 相対位置のために一旦作成「最後に消す」
  const length = data.milestones.length;
  const margin = getArea(bodyArea, "timelineSlide.dot").W / (length-1);

  // --- マイルストーンを順に ---
  const shapeLabel = "timelineSlide.label";
  const shapeDate = "timelineSlide.date";

  let cs = [];
  for ( let m=0 ; m<length ; m++ ) {
    // ドット
    const dot = insertShapeRelative(slide, bodyArea, "timelineSlide.dot", {offsetW: margin*m, alpha: (m+1)/length});

    // ラベル（dot を起点に）
    const label = insertShapeRelative(slide, dot, shapeLabel);
    setTextwSpec(label, shapeLabel, data.milestones[m]["label"]);

    // 日付（dot を起点に）
    const date = insertShapeRelative(slide, dot, shapeDate);
    setTextwSpec(date, shapeDate, data.milestones[m]["date"]);

    // マイルストーンを線でつなげる
    cs.push(dot.getConnectionSites());
    if ( m > 0 ) {
      // 左回りで0,1,2, な模様 ＆ "ELLIPSE" の場合は0-7の8点ある
      // https://developers.google.com/apps-script/reference/slides/slide?hl=ja#insertlinelinecategory,-startconnectionsite,-endconnectionsite
      slide.insertLine(SlidesApp.LineCategory[CONFIG.PRESET.line], cs[m-1][6], cs[m][2])
        .setWeight(SHAPE.timelineSlide.line.weight || 2)
        .getLineFill().setSolidFill(CONFIG.COLORS[SHAPE.timelineSlide.line.color || "neutral_gray"]);

    }

  }

  bodyArea.remove();
}

// table
function createTableSlide(slide, data) {
  // ヘッダー
  drawHeader(slide, data.title);
  drawSubHeader(slide, data.subhead);

  // テーブル
  let shape;
  const cols = data.headers.length;
  const rows = data.rows.length;
  shape = "tableSlide.table";
  const table = insertTable(slide, shape, {rows: rows+1, cols: cols});

  // ヘッダー
  shape = "tableSlide.header";
  const header = _spec(shape);

  for ( let c=0 ; c<cols ; c++ ) {
    const cell = table.getCell(0, c);
    cell.setContentAlignment(SlidesApp.ContentAlignment[header.align || SHAPE.BASE.align]);
    const headerColor = CONFIG.COLORS[header.color];
    if (headerColor) { cell.getFill().setSolidFill(headerColor); }

    setTextwSpec(cell, shape, data.headers[c]);
  }

  // データ
  shape = "tableSlide.cells";
  const cells = _spec(shape);

  for ( let r=0 ; r<rows ; r++ ) {
    for ( let c=0 ; c<cols ; c++ ) {
      const cell = table.getCell(r+1, c);
      cell.setContentAlignment(SlidesApp.ContentAlignment[cells.align || SHAPE.BASE.align]);
      setStyledText(cell, shape, data.rows[r][c]);
    }
  }

}

// progress
function createProgressSlide(slide, data) {
  // ヘッダー
  drawHeader(slide, data.title);
  drawSubHeader(slide, data.subhead);

  // 本文
  const shape = "contentSlide.body";
  const bodyArea = insertTextBox(slide, shape);
  const text = `現バージョンでは、このページ([[type=progress]])を出力できません🙇
データ(**const slideData**)の形式が不明なため、${LF}差し支えない内容をご提供いただけると実装される可能性があります`;

  const tr = setStyledText(bodyArea, shape, text);
  tr.getListStyle().applyListPreset(SlidesApp.ListPreset[CONFIG.PRESET.ul]);
  setSpacing(tr, data.type);

}

//---- スライドのパーツ ----
// ヘッダー
function drawHeader(slide, title) {
  const shape = "header.title";
  const headerShape = insertTextBox(slide, shape);
  setTextwSpec(headerShape, shape, title);
}

// サブヘッダー
function drawSubHeader(slide, subhead) {
  const shape = "header.subhead"
  const subheadShape = insertTextBox(slide, shape);
  setStyledText(subheadShape, shape, subhead);
}


//---- 裏方たち ----
// パラメータの設定（一応再帰しておく）
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      target[key] = target[key] || {};
      deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined) {
      target[key] = source[key];
    }
  }
  return target;
}

// --- オブジェクト設置 ---
/**
 * SHAPE定義に基づいて、スライドにテキストボックスを挿入します。
 *
 * @param {GoogleAppsScript.Slides.Slide} slide - テキストボックスを挿入するスライドオブジェクト。
 * @param {string} shape - SHAPEオブジェクト内の図形定義へのパス文字列（例: 'titleSlide.title'）。
 * @param {Object} [args] - 追加のオプション設定。
 * @param {string} [args.align="MIDDLE"] - テキストの垂直方向の配置（'TOP', 'MIDDLE', 'BOTTOM'）。
 * @returns {GoogleAppsScript.Slides.Shape} - 作成されたテキストボックスのShapeオブジェクト。
 */
function insertTextBox(slide, shape, args={}) {
  const base = _spec("BASE.shape");
  const spec = _spec(shape);
  const effective = { ...base, ...spec, ...args };

  const spec_width = spec.widthR ? spec.widthR * SHAPE.BASE.width : spec.width;
  const spec_height = spec.heightR ? spec.heightR * SHAPE.BASE.height : spec.height;

  const centerW = spec.centerW ? spec_width/2 : 0;
  const centerH = spec.centerH ? spec_height/2 : 0;

  // 図形の挿入(→Shape)
  // https://developers.google.com/apps-script/reference/slides/slide?hl=ja#insertShape(ShapeType,Number,Number,Number,Number)
  const box = slide.insertShape(
    SlidesApp.ShapeType[effective.shapetype],
    // 先に centerW, centerH があったら、を判断(?)
    SCALE.W * (spec.leftR ? spec.leftR * SHAPE.BASE.width  - centerW : spec.left),
    SCALE.H * (spec.topR  ? spec.topR  * SHAPE.BASE.height - centerH : spec.top),
    SCALE.W * spec_width,
    SCALE.H * spec_height
  );

  // アライメント設定（上下）
  // https://developers.google.com/apps-script/reference/slides/shape?hl=ja#setContentAlignment(ContentAlignment)
  // https://developers.google.com/apps-script/reference/slides/content-alignment?hl=ja
  box.setContentAlignment(SlidesApp.ContentAlignment[effective.align]);

  return box;
}

/**
 * 親オブジェクトからの相対位置に、SHAPE定義に基づいた図形を挿入します。
 *
 * @param {GoogleAppsScript.Slides.Slide} slide - 図形を挿入するスライドオブジェクト。
 * @param {GoogleAppsScript.Slides.Shape} parent - 相対位置の基準となる親図形オブジェクト。
 * @param {string} shape - SHAPEオブジェクト内の図形定義へのパス文字列。
 * @param {Object} [args] - 図形の追加設定を行うオプションオブジェクト。
 * @param {number} [args.offsetW=0] - 親オブジェクトからの水平オフセット(px)。
 * @param {number} [args.offsetH=0] - 親オブジェクトからの垂直オフセット(px)。
 * @param {string} [args.align="MIDDLE"] - テキストの垂直方向の配置 ('TOP', 'MIDDLE', 'BOTTOM')。
 * @param {string} [args.color] - 図形の塗りつぶし色。
 * @param {number} [args.alpha=1] - 塗りつぶしの透明度 (0.0-1.0)。
 * @param {string} [args.border] - 図形の境界線の色。
 * @param {string} [args.shapetype="TEXT_BOX"] - 挿入する図形の種類 (例: 'ROUND_RECTANGLE')。
 * @returns {GoogleAppsScript.Slides.Shape} 作成された図形のShapeオブジェクト。
 */
function insertShapeRelative(slide, parent, shape, args={}) {
  const base = _spec("BASE.shape");
  const spec = _spec(shape);
  const effective = { ...base, ...spec, ...args };

  const par = _object(parent);
  const offsetW = effective.offsetW || 0;
  const offsetH = effective.offsetH || 0;

  const box = slide.insertShape(
    SlidesApp.ShapeType[effective.shapetype],
    SCALE.W * ((spec.leftR   ? spec.leftR * par.width : spec.left) + offsetW + par.left),
    SCALE.H * ((spec.topR    ? spec.topR  * par.height : spec.top) + offsetH + par.top),
    SCALE.W * (spec.widthR   ? spec.widthR  * par.width  : spec.width),
    SCALE.H * (spec.heightR  ? spec.heightR * par.height : spec.height)
  );

  box.setContentAlignment(SlidesApp.ContentAlignment[effective.align]);

  // 色の適用（キー名）
  const fillColor = CONFIG.COLORS[effective.color];
  if (fillColor) {
    // alpha は 0 が有効な値なので || ではなく ?? (Null合体演算子) を使用
    box.getFill().setSolidFill(fillColor, effective.alpha ?? 1);
  }

  const borderColor = CONFIG.COLORS[effective.border];
  if (borderColor) {
    box.getBorder().getLineFill().setSolidFill(borderColor);
  }

  return box;
}

/**
 * 指定されたエリア内に、カード状の図形をグリッド状に配置します。
 *
 * この関数は、指定された行数と列数に基づいてカードのサイズと間隔を動的に計算し、
 * 合計`length`個のカードを配置します。
 * 参考: この関数は実行中にグローバルな `SHAPE` オブジェクトに `DYNAMIC_CARD` プロパティを追加・変更します。
 *
 * @param {GoogleAppsScript.Slides.Slide} slide - 図形を挿入するスライドオブジェクト。
 * @param {GoogleAppsScript.Slides.Shape} area - カード群を配置する基準となるエリア（図形オブジェクト）。
 * @param {string} shape - SHAPEオブジェクト内の、基準となるカード定義へのパス文字列。
 * @param {number} rows - グリッドの行数。
 * @param {number} cols - グリッドの列数。
 * @param {number} length - 挿入するカードの総数。
 * @param {Object} [args] - 図形の追加設定を行うオプションオブジェクト。
 * @returns {Array<GoogleAppsScript.Slides.Shape>} - 作成されたカードのShapeオブジェクトの配列。
 */
function insertCards(slide, area, shape, rows, cols, length, args={}) {
  // 幅と高さの「最小単位」
  const unit = getUnit(area, shape, rows, cols);

  // 同じタイプのスライドに影響しないよう、コピーして調整
  const [type, parts] = shape.split(".");
  // 幅、高さを計算して、定義と比べて小さい値を採用。時にはtopも詰める
  SHAPE[type].DYNAMIC_CARD = {
    ...SHAPE[type][parts],

    width:  Math.min(SHAPE[type][parts].width,   unit.W * unit.ratio.W),
    height: Math.min(SHAPE[type][parts].height,  unit.H * unit.ratio.H),
    top:    Math.min(SHAPE[type][parts].top,     unit.H),
  };

  // --- cardを動的に配置 ---
  const effective = { ...SHAPE[type].DYNAMIC_CARD, ...args };
  const parent = effective.parent || area;

  let cards = [];
  for ( let r=0 ; r<rows ; r++ ) {
    for ( let c=0 ; c<cols ; c++ ) {
      const i = r*cols + c;
      if( i >= length ) { continue; }

      // card
      effective.offsetW = unit.W*c*(unit.ratio.W+1);
      effective.offsetH = unit.H*r*(unit.ratio.H+1) + (effective.parent ? (_object(area).top - _object(parent).top) : 0);
      const card = insertShapeRelative(slide, parent, `${type}.DYNAMIC_CARD`, effective);

      cards.push(card);
    }
  }

  return cards;
}

// テーブル設置（スライドに対して）
function insertTable(slide, shape, args={ rows: 3, cols: 3 }) {

  // テーブルの挿入(→Table)
  const spec = _spec(shape);

  // https://developers.google.com/apps-script/reference/slides/slide?hl=ja#inserttablenumrows,-numcolumns,-left,-top,-width,-height
  const table = slide.insertTable(
    args.rows || 3,
    args.cols || 3,
    SCALE.W * spec.left,
    SCALE.H * spec.top,
    SCALE.W * spec.width,
    SCALE.H * spec.height
  );

  return table;
}

// --- テキスト処理（主に整形） ---
/**
 * 指定されたオブジェクトにテキストを設定し、SHAPE.*.textの定義と引数で渡されたスタイルを適用します。
 *
 * @param {GoogleAppsScript.Slides.Shape|GoogleAppsScript.Slides.TableCell} target - テキストを設定する対象オブジェクト（ShapeまたはTableCell）。
 * @param {string} shape - SHAPEオブジェクト内の図形（うちテキストのスタイル定義を利用）へのパス文字列。
 * @param {string} text - 設定するテキストコンテンツ。
 * @param {Object} [args] - スタイル設定を行うオプションオブジェクト。
 * @param {string} [args.color=CONFIG.COLORS.text_primary] - テキストの色。
 * @param {number} [args.size=CONFIG.FONT_SIZES.body] - フォントサイズ（ポイント）。
 * @param {boolean} [args.bold=false] - テキストを太字にするかどうか。
 * @param {string} [args.align="START"] - 段落の水平方向の配置 ('START', 'CENTER', 'END', 'JUSTIFY')。
 * @returns {GoogleAppsScript.Slides.TextRange} - スタイル適用後のTextRangeオブジェクト。
 */
function setTextwSpec(target, shape, text, args={}) {
  const base = _spec("BASE.text");
  const spec = _spec(shape);
  const effective = { ...base, ...spec.text, ...args };

  // テキストコンテンツ取得(→TextRange)
  // https://developers.google.com/apps-script/reference/slides/shape?hl=ja#getText()
  const textRange = target.getText();

  // 引数のテキストを設定(→TextRange 再度)
  // https://developers.google.com/apps-script/reference/slides/text-range?hl=ja#setText(String)
  textRange.setText(text || " ")
    // テキストスタイル取得(→TextStyle) TextStyle に対して装飾
    // https://developers.google.com/apps-script/reference/slides/text-range?hl=ja#getTextStyle()
    .getTextStyle()
      .setFontFamily(CONFIG.FONTS.family)
      .setForegroundColor(CONFIG.COLORS[effective.color] || CONFIG.COLORS["text_primary"])
      .setFontSize(CONFIG.FONT_SIZES[effective.size])
      .setBold(effective.bold);

  // アライメント設定（左右）
  // https://developers.google.com/apps-script/reference/slides/paragraph-style?hl=ja#setparagraphalignmentalignment
  // https://developers.google.com/apps-script/reference/slides/paragraph-alignment?hl=ja
  textRange.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment[effective.align]);

  return textRange;
}

/**
 * テキスト内のマークアップ（`**bold**` や `[[highlight]]`）を解釈してスタイルを適用します。
 *
 * @param {GoogleAppsScript.Slides.Shape|GoogleAppsScript.Slides.TableCell} target - テキストを設定する対象オブジェクト（ShapeまたはTableCell）。
 * @param {string} shape - SHAPEオブジェクト内の図形（うちテキストのスタイル定義を利用）へのパス文字列。
 * @param {string} text - スタイルマークアップを含むテキストコンテンツ。
 * @param {Object} [args] - 基本となるスタイル設定のオプションオブジェクト。
 * @param {string} [args.color="text_primary"] - デフォルトのテキストの色。
 * @param {number} [args.size="body"] - デフォルトのフォントサイズ（ポイント）。
 * @param {string} [args.align="START"] - 段落の水平方向の配置 ('START', 'CENTER', 'END', 'JUSTIFY')。
 * @returns {GoogleAppsScript.Slides.TextRange} - スタイル適用後のTextRangeオブジェクト。
 */
function setStyledText(target, shape, text, args={}) {
  const base = _spec("BASE.text");
  const spec = _spec(shape);
  const effective = { ...base, ...spec.text, ...args };

  const parsed = _parseTextStyle(text || " ");

  const textRange = target.getText();
  textRange.setText(parsed.output)
    .getTextStyle()
      .setFontFamily(CONFIG.FONTS.family)
      .setForegroundColor(CONFIG.COLORS[effective.color] || CONFIG.COLORS["text_primary"])
      .setFontSize(CONFIG.FONT_SIZES[effective.size]);

  _applyTextStyle(textRange, parsed.ranges);

  textRange.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment[effective.align]);

  return textRange;
}


// テキスト内の装飾を解釈
function _parseTextStyle(text) {
  const ranges = [];
  let output = text;
  let offset = 0;
  
  // 1. **～** パターンを先に処理
  const t1 = text.replace(/(\[{2}|\]{2})/g, "");
  // こちらの output は使われない [[]] が除いてあって位置がズレるため
  output = t1.replace(/\*{2}([^\*]+)\*{2}/g, (match, content, index) => {
    const start = index - offset;
    const end = start + content.length;
    ranges.push({ start, end, bold: true });
    offset += match.length - content.length;
    return content;
  });
  
  // 2. [[～]] パターンを次に処理
  offset = 0;
  const t2 = text.replace(/\*{2}/g, "");
  output = t2.replace(/\[{2}([^\]]+)\]{2}/g, (match, content, index) => {
    const start = index - offset;
    const end = start + content.length;
    ranges.push({ start, end, bold: true, color: CONFIG.COLORS.primary_color });
    offset += match.length - content.length;
    return content;
  });
  
  return { output: output, ranges };
}

// スタイルを適用
function _applyTextStyle(textRange, ranges) {
  for ( let r of ranges ) {
    const part = textRange.getRange(r.start, r.end);
    if (!part) return;
    part.getTextStyle()
      .setBold(!!r.bold)
      .setForegroundColor(r.color || CONFIG.COLORS.text_primary);
  }
}


// 行間、段落間のスペース
function setSpacing(textRange, type) {
  // デフォルト値ありきで、typeに応じた設定
  const spacing = {
    ...CONFIG.SPACING["_default"],
    ...CONFIG.SPACING[type]
  };

  // 行間
  textRange.getParagraphStyle().setLineSpacing(spacing.space);

  // 段落前後のスペース
  // https://developers.google.com/apps-script/reference/slides/spacing-mode?hl=ja
  // リストでも「段落間隔」が有効になるよう設定 ※先にリスト化されている必要がある=リスト化された後に、この関数を呼ぶ
  if (spacing.above > 0) {
    textRange.getParagraphStyle()
      .setSpaceAbove(spacing.space * spacing.above)
      .setSpacingMode(SlidesApp.SpacingMode[spacing.mode]);
  }
  if (spacing.below > 0) {
    textRange.getParagraphStyle()
      .setSpaceBelow(spacing.space * spacing.below)
      .setSpacingMode(SlidesApp.SpacingMode[spacing.mode]);
  }

}

// --- 座標、サイズ、ポイントvsピクセル 等 ---
// 座標・方向はW(idth),H(eight)に統一（X,Y や H(orizontal),V(ertical) はナシで）

/**
 * グリッド配置における図形とマージンの基準単位サイズを計算します。
 *
 * 指定された親エリア内に、定義された比率(`ratio`)を持つ図形を`rows` x `cols`のグリッドで
 * 配置する場合の、基準となる1単位の幅(W)と高さ(H)をピクセル単位で算出します。
 *
 * 計算された単位を基に、図形のサイズは `unit * ratio`、図形間のギャップは `unit * 1` として扱われます。
 *
 * @param {GoogleAppsScript.Slides.Shape} parent - 図形を配置する親エリアとなる図形オブジェクト。
 * @param {string} shape - サイズと比率の基準となる、SHAPEオブジェクト内の図形定義へのパス文字列。
 * @param {number} rows - グリッドの行数。
 * @param {number} cols - グリッドの列数。
 * @returns {{W: number, H: number, ratio: {W: number, H: number}}} 計算された単位サイズと使用された比率を含むオブジェクト。
 * @property {number} W - 幅の基準単位サイズ (px)。
 * @property {number} H - 高さの基準単位サイズ (px)。
 * @property {Object} ratio - 図形とギャップの比率。
 */
function getUnit(parent, shape, rows, cols) {
  const par = _object(parent);
  const spec = _spec(shape);
  const ratio = spec.ratio || SHAPE.BASE.shape.ratio;

  // 幅
  const unitW = Math.round(Math.min(
    (par.width - (spec.widthR   ? spec.widthR  * par.width  : spec.left)*2) / (cols*ratio.W + cols-1),   // 左右の隙間を考慮
    spec.width / ratio.W
  ));

  // 高さ
  const unitH = Math.round(Math.min(
    (par.height - (spec.heightR  ? spec.heightR * par.height : spec.top)) / (rows*ratio.H + rows-1),   // 上の隙間だけ考慮
    spec.height / ratio.H
  ));

  return {
    W: unitW,
    H: unitH,
    ratio: ratio,
  }
}

// ポイント(pt)vsピクセル(px)の比率（pt/px なので、pt=px*SCALE, px=pt/SCALE）
function getScale(presentation) {
  return {
    W: presentation.getPageWidth() / SHAPE.BASE.width,
    H: presentation.getPageHeight() / SHAPE.BASE.height,
  }
}

// 幅、高さ で有効なサイズ[px]
function getArea(area, shape) {
  const obj = _object(area);
  const spec = _spec(shape);

  return {
    W: obj.width  - spec.left*2,   // 左右の隙間を考慮
    H: obj.height - spec.top,      // 上の隙間だけ考慮
  }
}

// 実体 のサイズ[px]
function _object(obj) {
  return {
    left:     Math.round(obj.getLeft()  / SCALE.W),
    top:      Math.round(obj.getTop()   / SCALE.H),
    width:    Math.round(obj.getWidth() / SCALE.W),
    height:   Math.round(obj.getHeight()/ SCALE.H),
  }
}
// 定義 のサイズ[px]
function _spec(shape) {
  return shape.split(".").reduce((slide, parts) => slide[parts], SHAPE);
}
