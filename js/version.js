// 岐阜統一戦記 版の番号。修正を出すたびに BUILD を1つ増やす（タイトルとメニューに出して、反映されたかを見分ける）
window.BUILD = 10;
// 表示は 0.0.7 の形。BUILD の各桁を並べるので、9 の次は桁が上がる（10 → 0.1.0、100 → 1.0.0）
window.VERSION = String(window.BUILD).padStart(3, '0').split('').join('.');
