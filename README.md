# 岐阜統一戦記

岐阜県の42市町村を、武力ではなく予算・産業・住民の支持で統一していく内政シミュレーションゲーム。
プレイヤーは県内ひとつの市町村の首長となり、連携協定と合併を重ねて県内統一を目指す。

- 遊ぶ：GitHub Pages で公開
- 仕様書：[docs/spec-v0.1.md](docs/spec-v0.1.md)

## 構成

| ファイル | 内容 |
| --- | --- |
| `index.html` | 画面のHTML。下の CSS・JS を読み込む |
| `css/style.css` | スタイル |
| `js/logic.js` | ゲームロジック（画面に依存しない部分）。`window.GameLogic` に公開し、Node からは `require` できる |
| `js/map-data.js` | 地図データ（`MAP`：市町村の形・隣接・面積） |
| `js/ui.js` | 画面の処理・描画・セーブ |
| `docs/spec-v0.1.md` | ゲーム仕様書 v0.1 |

JS は `logic.js` → `map-data.js` → `ui.js` の順に通常の `<script>` で読み込む（`file://` で開けるよう ES Modules や `fetch` は使わない）。

ビルド不要。ローカルでは `index.html` をブラウザで開けば遊べる。
セーブはブラウザの localStorage（キー `gifu-toitsu-v1`）に保存される。

## 出典

- 地図：国土数値情報（行政区域データ）を加工して作成
- 人口：岐阜県の統計を丸めた概数。そのほかの数値はゲーム用
- 登場する陣営・人物・出来事は架空
