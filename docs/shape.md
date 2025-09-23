# `SHAPE` オブジェクト定義書

## 概要

`SHAPE` オブジェクトは、majicom ライブラリで使用される、各スライド要素（図形やテキストボックス）のサイズと位置を定義する設定オブジェクトです。

このオブジェクトは`createPresentation`関数の第3引数として渡すことで、デフォルト設定を上書きできます。

## 基本構造

`SHAPE` は、スライドの種類ごとにキーを持ち、その値として含まれる要素の定義を持つオブジェクトです。インデントは、要素間の親子関係（相対的な位置決めの基準）をおおよそ示しています。

### 基準単位

すべての座標とサイズは、`SHAPE.BASE` で定義された基準ページサイズ（`width: 960`, `height: 540`）に対するピクセル(px)単位で指定します。

### プロパティ一覧

各要素の定義オブジェクトは、以下のプロパティを持つことができます。

| プロパティ | 型 | 説明 |
| :--- | :--- | :--- |
| `left` | `Number` | 親要素の左上からのX座標 (px) |
| `top` | `Number` | 親要素の左上からのY座標 (px) |
| `width` | `Number` | 要素の幅 (px) |
| `height` | `Number` | 要素の高さ (px) |
| `leftR` | `Number` | 親要素の幅に対する相対的なX座標 (比率) |
| `topR` | `Number` | 親要素の高さに対する相対的なY座標 (比率) |
| `widthR` | `Number` | 親要素の幅に対する相対的な幅 (比率) |
| `heightR` | `Number` | 親要素の高さに対する相対的な高さ (比率) |
| `centerW` | `Boolean` | 水平方向中央揃えの基準点として扱うか |
| `centerH` | `Boolean` | 垂直方向中央揃えの基準点として扱うか |
| `shapetype` | `String` | 図形の種類 (`ELLIPSE`, `ROUND_RECTANGLE` など) |
| `ratio` | `Object` | カードレイアウトなどで使用される幅と高さの比率 (`{W: 10, H: 8}`) |

---

## 詳細定義

### `BASE`
プレゼンテーション全体の基準となる定義です。

| 要素 | プロパティ | 値 | 説明 |
| :--- | :--- | :--- | :--- |
| `BASE` | `width` | `960` | 基準となるページ幅 (px) |
| | `height` | `540` | 基準となるページ高さ (px) |
| | `ratio` | `{W:10, H:8}` | カード等のグリッドレイアウトにおけるデフォルトの幅・高さの比率 |

---

### `titleSlide`
**基準: ページ**

| 要素 | プロパティと値 |
| :--- | :--- |
| `title` | `{ left: 50, top: 200, width: 830, height: 90, centerH: true }` |
| `date` | `{ left: 50, top: 450, width: 250, height: 40 }` |

---

### `sectionSlide`
**基準: ページ**

| 要素 | プロパティと値 |
| :--- | :--- |
| `title` | `{ leftR: 1/4, top: 230, widthR: 2/3, height: 80 }` |
| `ghostNum` | `{ left: 35, top: 120, width: 400, height: 200 }` |

---

### `closingSlide`
**基準: ページ**

クロージングスライドの要素定義です。

| 要素 | プロパティと値 |
| :--- | :--- |
| `message` | `{ leftR: 1/2, topR: 1/2, widthR: 2/3, height: 90, centerW: true, centerH: true }` |

---

### `contentSlide`
**基準: ページ**

基本的なコンテンツスライドの要素定義です。`faq`スライドでも`contentSlide.body`が利用されます。

| 要素 | プロパティと値 |
| :--- | :--- |
| `body` | `{ left: 25, top: 140, width: 910, height: 350 }` |
| `twoColLeft` | `{ left: 25, top: 140, width: 440, height: 350 }` |
| `twoColRight` | `{ left: 495, top: 140, width: 440, height: 350 }` |

---

### `header`
**基準: ページ**

各スライドのヘッダー・サブヘッダーの要素定義です。

| 要素 | プロパティと値 |
| :--- | :--- |
| `title` | `{ left: 25, top: 30, width: 900, height: 60 }` |
| `subhead` | `{ left: 25, top: 90, width: 900, height: 40 }` |

---

### `body`
**基準: ページ**

多くのスライドでコンテンツ描画の基準エリアとして使われる要素定義です。

`body.cards` を基準とする3つのスライドはいずれもタイトル・ヘッダーがあるため、  
タイトル・ヘッダーを除いたエリアを定義してあり、
各スライド内の要素はそのエリア内に動的に配置されます。

| 要素 | プロパティと値 |
| :--- | :--- |
| `area` | `{ left: 25, top: 130, width: 910, height: 360 }` |
| `cards` | `{ left: 25, top: 190, width: 910, height: 300 }` |
| `table` | `{ left: 40, top: 160, width: 890, height: 330 }` |

---

### `compareSlide`
**基準: `body.cards`**

2つの項目を比較するスライドの要素定義です。

| 要素 | 基準 | プロパティと値 |
| :--- | :--- | :--- |
| `head` | `body.cards` | `{ left: 10, top: -40, width: 420, height: 40 }` |
| `body` | `compareSlide.head` | `{ left: 0, top: 40, widthR: 1, height: 240 }` |

---

### `statsCompareSlide`
**基準: `body.cards`**

統計情報を比較するスライドの要素定義です。

| 要素 | 基準 | プロパティと値 |
| :--- | :--- | :--- |
| `title` | `body.cards` | `{ left: 10, top: -40, width: 420, height: 40 }` |
| `card` | `statsCompareSlide.title` | `{ left: 0, top: 10, widthR: 1, height: 240, ratio: {W:1, H:4} }` |
| `label` | `statsCompareSlide.card` | `{ left: 0, topR: 1/10, widthR: 1/2, heightR: 2/10 }` |

---

### `diagramSlide`
**基準: `body.cards`**

ダイアグラム（図解）スライドの要素定義です。

| 要素 | 基準 | プロパティと値 |
| :--- | :--- | :--- |
| `title` | `body.cards` | `{ left: 10, top: -30, width: 420, height: 30 }` |
| `card` | `diagramSlide.title` | `{ leftR: 1/20, top: 10, widthR: 9/10, height: 60, shapetype: "ROUND_RECTANGLE", ratio: {W:1, H:4} }` |

---

### `cards`
**基準: `body.area`**

カード型レイアウトのスライド要素定義です。

| 要素 | 基準 | プロパティと値 |
| :--- | :--- | :--- |
| `card` | `body.area` | `{ left: 20, top: 20, width: 420, height: 240, shapetype: "ROUND_RECTANGLE" }` |

---

### `headerCards`
**基準: `body.area`**

ヘッダー付きカード型レイアウトのスライド要素定義です。

| 要素 | 基準 | プロパティと値 |
| :--- | :--- | :--- |
| `card` | `body.area` | `{ left: 20, top: 20, width: 420, height: 280 }` |
| `head` | `headerCards.card` | `{ left: 0, top: 0, widthR: 1, height: 40 }` |
| `body` | `headerCards.head` | `{ left: 0, topR: 1, widthR: 1, height: 240 }` |

---

### `kpiSlide`
**基準: `body.area`**

KPI表示用スライドの要素定義です。

| 要素 | 基準 | プロパティと値 |
| :--- | :--- | :--- |
| `kpi` | `body.area` | `{ left: 20, top: 20, width: 420, height: 240 }` |
| `label` | `kpiSlide.kpi` | `{ leftR: 1/20, topR: 1/20, widthR: 9/10, heightR: 4/20 }` |
| `change` | `kpiSlide.kpi` | `{ leftR: 1/20, topR: 15/20, widthR: 9/10, heightR: 4/20 }` |

---

### `processSlide`
**基準: `body.area`**

プロセス（工程）表示用スライドの要素定義です。

| 要素 | 基準 | プロパティと値 |
| :--- | :--- | :--- |
| `numBox` | `body.area` |`{ left: 40, top: 40, width: 28, height: 28 }` |
| `process` | `body.area` |`{ left: 80, top: 40, width: 800, height: 28 }` |

---

### `bulletCards`
**基準: `body.area`**

箇条書きカード形式のスライド要素定義です。

| 要素 | 基準 | プロパティと値 |
| :--- | :--- | :--- |
| `card` | `body.area` | `{ left: 10, top: 10, width: 890, height: 90, ratio: {W:1, H:4} }` |

---

### `quoteSlide`
**基準: `body.area`**

引用スライドの要素定義です。

| 要素 | 基準 | プロパティと値 |
| :--- | :--- | :--- |
| `quoteMark` | `body.area` | `{ left: 20, top: 60, width: 100, height: 100 }` |
| `quoteText` | `body.area` | `{ left: 120, top: 80, width: 700, height: 150 }` |
| `author` | `body.area` | `{ left: 150, top: 240, width: 700, height: 30 }` |

---

### `timelineSlide`
**基準: `body.area`**

タイムラインスライドの要素定義です。

| 要素 | 基準 | プロパティと値 |
| :--- | :--- | :--- |
| `dot` | `body.area` | `{ left: 60, top: 160, width: 10, height: 10, shapetype: "ELLIPSE" }` |
| `label` | `timelineSlide.dot` | `{ left: -45, top: -80, width: 100, height: 70 }` |
| `date` | `timelineSlide.dot` | `{ left: -45, top: 20, width: 100, height: 20 }` |


## Notes

- すべての設定項目は任意で、未指定の場合はデフォルト値が適用されます
- 位置、サイズはピクセル[px]単位で指定します
- Googleスライドの寸法の単位は **[ツール] > [設定]** で変更可能です
