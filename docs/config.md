# `CONFIG` 設定一覧・説明資料

## 概要

`CONFIG` オブジェクトは、majicom ライブラリにおけるスライド生成の外観・動作を制御する中核的な設定システムです。

このオブジェクトは`createPresentation`関数の第2引数として渡すことで、デフォルト設定を上書きできます。

## 設定項目詳細

### 1. 基本設定 (SETTINGS)

| 項目 | 型 | デフォルト値 | 説明 |
|------|-----|-------------|------|
| `clear_all` | boolean | `true` | 既存スライドを全削除するかどうか |
| `presentation_id` | string/null | `null` | 対象プレゼンテーションID（nullの場合はアクティブなプレゼンテーション） |

### 2. フォント設定 (FONTS)

| 項目 | 型 | デフォルト値 | 説明 |
|------|-----|-------------|------|
| `family` | string | `"BIZ UDPGothic"` | 使用するフォントファミリー |

### 3. フォントサイズ設定 (FONT_SIZES)

各要素のフォントサイズを「ポイント」単位で設定します。

| 項目 | サイズ | 用途 |
|------|--------|------|
| `title` | 32pt | タイトルスライドのタイトル |
| `date` | 16pt | タイトルスライドの日付 |
| `sectionTitle` | 35pt | セクションスライドのタイトル |
| `ghostNum` | 120pt | セクション番号（ゴースト表示） |
| `header` | 23pt | コンテンツスライドのヘッダー |
| `subhead` | 18pt | サブヘッダー |
| `body` | 14pt | 本文 |
| `small` | 10pt | 小さなテキスト |
| `kpi` | 32pt | KPI値表示 |
| `compare` | 20pt | 比較表示 |
| `quoteText` | 24pt | 引用文 |
| `quoteAuthor` | 16pt | 引用者名 |

### 4. 色設定 (COLORS)

| 項目 | 色コード | 用途 |
|------|----------|------|
| `primary_color` | `#4285F4` | プライマリカラー（強調色） |
| `text_primary` | `#333333` | メインテキスト色 |
| `text_reverse` | `#FFFFFF` | 反転テキスト色（白文字） |
| `bg_gray` | `#f8f9fa` | グレー背景 |
| `bg_white` | `#ffffff` | 白背景 |
| `border` | `#dadce0` | 境界線色 |
| `faint_gray` | `#e8eaed` | 薄いグレー |
| `neutral_gray` | `#9e9e9e` | ニュートラルグレー |
| `ghost_gray` | `#efefed` | ゴースト表示用グレー |

### 5. クロージング設定 (CLOSING)

| 項目 | 値 | 説明 |
|------|-----|------|
| `message` | `"Thank You"` | クロージングスライドに表示するメッセージ |

### 6. アジェンダ設定 (AGENDA)

| 項目 | 値 | 説明 |
|------|-----|------|
| `regexp` | `/(agenda\|アジェンダ\|目次\|本日お伝えすること)/i` | アジェンダと判定する正規表現 |

### 7. スライドタイプ・レイアウト対応 (TYPE2LAYOUT)

各スライドタイプに対応するGoogleスライドのレイアウトを定義します。

| スライドタイプ | レイアウト | 説明 |
|---------------|------------|------|
| `title` | `TITLE` | タイトルスライド |
| `closing` | `TITLE` | クロージングスライド |
| `section` | `SECTION_HEADER` | セクションヘッダー |
| `_default` | `BLANK` | その他すべて（空白レイアウト） |

### 8. プリセット設定 (PRESET)

| 項目 | 値 | 説明 |
|------|-----|------|
| `ul` | `DISC_CIRCLE_SQUARE` | 箇条書き（●○■）のスタイル |
| `ol` | `DIGIT_NESTED` | 番号付きリストのスタイル |
| `line` | `BENT` | コネクタ線の曲がり方 |
| `arrow` | `FILL_ARROW` | 矢印のスタイル（塗りつぶし） |

### 9. スペーシング設定 (SPACING)

| 項目 | 設定値 | 説明 |
|------|--------|------|
| `faq` | `{space: 150}` | FAQ用のスペーシング |
| `_default` | `{space: 115, above: 0, below: 0.1, mode: "NEVER_COLLAPSE"}` | デフォルトのスペーシング |

## カスタマイズ方法

CONFIGの各設定は、`createPresentation`関数呼び出し時にカスタム設定オブジェクトを渡すことで上書きできます：

```javascript
// 例：プライマリカラーとクロージングメッセージをカスタマイズ
const customConfig = {
  COLORS: {
    primary_color: "#FF5722"
  },
  CLOSING: {
    message: "ありがとうございました"
  }
};

createPresentation(slideData, customConfig);
```

## Notes

- すべての設定項目は任意で、未指定の場合はデフォルト値が適用されます
- 色設定はHEXカラーコード形式で指定します
- フォントサイズはGoogle Apps Scriptのポイント単位で設定されます
- レイアウト設定により、Googleスライドのテーマ機能と連携したデザインカスタマイズが可能です