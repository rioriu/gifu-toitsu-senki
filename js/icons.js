// 市町村ごとのアイコン（特産・名所・名物を1つずつ）。32×32 の SVG をコードで描く
// 特産タグを持つ市町村はその特産を、同じ特産が重なるところは別の形にして見分けられるようにする
window.TownIcons = (() => {
  const O = '#2b2622'; // 縁取り
  // 中心 (cx, cy) のまわりに n 個並べる
  const around = (n, f) => Array.from({ length: n }, (_, i) => f(i * 360 / n, i * 2 * Math.PI / n)).join('');
  const spikes = (cx, cy, r0, r1, n, col) => around(n, (d, a) => `<path d="M${(cx + r0 * Math.cos(a)).toFixed(1)} ${(cy + r0 * Math.sin(a)).toFixed(1)}L${(cx + r1 * Math.cos(a)).toFixed(1)} ${(cy + r1 * Math.sin(a)).toFixed(1)}" stroke="${col}"/>`);
  const ring = (cx, cy, r, n, rr, col) => around(n, (d, a) => `<circle cx="${(cx + r * Math.cos(a)).toFixed(1)}" cy="${(cy + r * Math.sin(a)).toFixed(1)}" r="${rr}" fill="${col}" stroke="none"/>`);

  // [名前, 中身]
  const ICONS = {
    // ---- 岐阜圏域 ----
    '21201': ['鵜飼', `<path d="M3 26c3 1.5 5 1.5 8 0s5-1.5 8 0 5 1.5 8 0" stroke="#4f86c6"/>
      <path d="M4 19h23l-3 4H7z" fill="#9a6a3e"/><path d="M22 19V10"/>
      <path d="M19 9h6l-1 3h-4z" fill="#6b4a2e"/><path d="M22 8.5c-2.2-1-2.4-4 .2-6.5 0 2 3 2.3 2 5-.4 1-1.2 1.5-2.2 1.5z" fill="#f2a03a"/>
      <circle cx="10" cy="13" r="2" fill="#3b4a5a"/><path d="M10 15v4" stroke-width="2"/><path d="M13 16.5l2.5-1.5c1 0 1.5.8 1.2 1.5l-1.7 2.5z" fill="#2b2622"/>`],
    '21209': ['竹鼻の藤', `<path d="M3 6c6-2.5 20-2.5 26 0" stroke="#6b4a2e" stroke-width="1.8"/>
      <path d="M9 6.5c3 0 4 3 3.2 7s-2.2 7.5-3.2 9.5c-1-2-2.4-5.5-3.2-9.5S6 6.5 9 6.5z" fill="#a98bd4"/>
      <path d="M16 6c3.3 0 4.3 3.5 3.5 8s-2.5 9-3.5 12c-1-3-2.7-7.5-3.5-12S12.7 6 16 6z" fill="#8e6bb3"/>
      <path d="M23 6.5c3 0 4 3 3.2 7s-2.2 7.5-3.2 9.5c-1-2-2.4-5.5-3.2-9.5S20 6.5 23 6.5z" fill="#a98bd4"/>
      <path d="M12 5.5c1-2 3-2.2 4-1-1 1.8-3 2-4 1zM19.5 5.8c1-1.8 3-2 4-.8-1 1.6-3 1.8-4 .8z" fill="#6a9a4b"/>`],
    '21213': ['航空宇宙', `<path d="M14 11L3 17v2.5l11-3zM18 11l11 6v2.5l-11-3z" fill="#4f86c6"/>
      <path d="M14 23l-4.5 3.5V28l4.5-1zM18 23l4.5 3.5V28L18 27z" fill="#4f86c6"/>
      <path d="M16 3c1.3 0 2 2 2 4v20l-2 2-2-2V7c0-2 .7-4 2-4z" fill="#e6ecf0"/><path d="M15 7.5h2" stroke="#4f86c6"/>`],
    '21215': ['水栓バルブ', `<path d="M3 9h12a6 6 0 0 1 6 6v3h-5v-3a1 1 0 0 0-1-1H3z" fill="#b8c2c8"/>
      <path d="M12 6v3"/><rect x="8" y="3.5" width="8" height="2.5" rx="1.2" fill="#d9573b"/>
      <path d="M18.5 21c-1.6 2.2-2.2 3.2-2.2 4.2a2.2 2.2 0 0 0 4.4 0c0-1-.6-2-2.2-4.2z" fill="#6fb0e0"/>`],
    '21216': ['富有柿', `<path d="M5 17.5c0-6 5-9 11-9s11 3 11 9-5 10-11 10S5 23.5 5 17.5z" fill="#ec7d2b"/>
      <path d="M10.5 10c2-.6 3.5-2.2 5.5-2.8 2 .6 3.5 2.2 5.5 2.8-1 1.8-3.3 2.4-5.5 2.4s-4.5-.6-5.5-2.4z" fill="#4f7a35"/>
      <path d="M16 7.2V4"/><path d="M9.5 16c0-2 1.3-3.6 3-4.3" stroke="#f8c08f" stroke-width="1.6"/>`],
    '21218': ['淡墨桜', around(5, d => `<path transform="rotate(${d} 16 16)" d="M16 15.5c-3.6-2-4.6-6.4-2.6-9.6 1 .3 1.9 1 2.6 1.9.7-.9 1.6-1.6 2.6-1.9 2 3.2 1 7.6-2.6 9.6z" fill="#f7e1e7"/>`)
      + `<circle cx="16" cy="16" r="2.4" fill="#e58aa3"/>` + ring(16, 16, 4.2, 5, .7, '#c7577a')],
    '21302': ['繊維のまち', `<rect x="8" y="5" width="16" height="3" rx="1" fill="#c99a52"/><rect x="8" y="24" width="16" height="3" rx="1" fill="#c99a52"/>
      <rect x="10" y="8" width="12" height="16" fill="#4f86c6"/><path d="M10 11.5h12M10 15h12M10 18.5h12M10 22h12" stroke="#8db5e6"/>
      <path d="M22 17c4 .5 5.5 4.5 3.5 9.5" stroke="#4f86c6" stroke-width="1.6"/>`],
    '21303': ['笠松競馬', `<path d="M8 5v10.5a8 8 0 0 0 16 0V5h-4.5v10.5a3.5 3.5 0 0 1-7 0V5z" fill="#a6adb3"/>
      <path d="M8 5h4.5M19.5 5H24"/>${[[10.2, 9], [10.2, 14], [21.8, 9], [21.8, 14], [12.2, 19.5], [19.8, 19.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="${O}" stroke="none"/>`).join('')}`],
    '21421': ['円鏡寺の楼門', `<path d="M2.5 12.5c5-1 9-4 13.5-7.5 4.5 3.5 8.5 6.5 13.5 7.5l-2 2h-23z" fill="#4a4a4a"/>
      <rect x="7" y="14.5" width="18" height="4" fill="#d9573b"/><path d="M5 21h22l-2-2.5H7z" fill="#4a4a4a"/>
      <path d="M7.5 21H10v7H7.5zM12.5 21H15v7h-2.5zM17 21h2.5v7H17zM22 21h2.5v7H22z" fill="#d9573b"/>`],
    // ---- 西濃圏域 ----
    '21202': ['大垣の枡', `<path d="M5 11l11-5.5L27 11l-11 5.5z" fill="#f4dca6"/><path d="M5 11v10l11 5.5V16.5z" fill="#e2bd7a"/>
      <path d="M27 11v10l-11 5.5V16.5z" fill="#c99a52"/><path d="M8.5 11L16 7.3l7.5 3.7-7.5 3.7z" fill="#c99a52"/>`],
    '21221': ['千本松原', `<path d="M3 28c4-1.5 7 1 11 0s8-1.5 15 0" stroke="#4f86c6"/>
      <path d="M15.5 28c.8-5 0-9-3-13l2-1.2c2.3 3 4 7 3.5 14.2z" fill="#6b4a2e"/>
      <ellipse cx="11.5" cy="12" rx="7.5" ry="3" fill="#3f6b3a"/><ellipse cx="20.5" cy="16" rx="7" ry="2.8" fill="#3f6b3a"/><ellipse cx="14.5" cy="6.5" rx="5" ry="2.5" fill="#4f7d45"/>`],
    '21341': ['養老の滝', `<path d="M3 4c3 0 6 1 9 2.5V25H3z" fill="#7d8a6a"/><path d="M29 4c-3 0-6 1-9 2.5V25h9z" fill="#7d8a6a"/>
      <rect x="12" y="6.5" width="8" height="18" fill="#cfeaf7"/><path d="M14 8v15M16.5 8v16M18.5 8v14" stroke="#6fb0e0"/>
      <path d="M3 26c3-2 5.5 0 8-1s3-2 5-2 2.5 1 5 2 5-1 8 1v3H3z" fill="#6fb0e0"/>`],
    '21361': ['南宮大社の鳥居', `<path d="M3.5 7c5 1.2 20 1.2 25 0l-1 3h-23z" fill="#d9573b"/>
      <path d="M8.5 10h3v18h-3zM20.5 10h3v18h-3z" fill="#d9573b"/><rect x="6.5" y="13" width="19" height="2.5" fill="#d9573b"/>
      <rect x="14.5" y="10" width="3" height="3" fill="${O}"/>`],
    '21362': ['古戦場', `<path d="M13 10C10 8 9 5 10 2c2 2 3.5 4.5 5 7.5M19 10c3-2 4-5 3-8-2 2-3.5 4.5-5 7.5" fill="#e8b84a"/>
      <path d="M7 18c0-7 4-11 9-11s9 4 9 11z" fill="#3b3f4a"/><path d="M5 18h22l-2.5 7h-17z" fill="#8b2f2a"/>
      <path d="M6 21.5h20" stroke="#5c1f1b"/><path d="M10 18c2 2 10 2 12 0" stroke="#e8b84a" stroke-width="1.6"/>`],
    '21381': ['日吉神社の三重塔', `<path d="M16 2v6"/><path d="M15 4h2M15 6h2"/>
      <path d="M9 10.5h14l-3-2.5h-8z" fill="#5a4636"/><rect x="12" y="10.5" width="8" height="3.5" fill="#d9573b"/>
      <path d="M7 17h18l-3.5-3h-11z" fill="#5a4636"/><rect x="11.5" y="17" width="9" height="3.5" fill="#d9573b"/>
      <path d="M5 23.5h22l-4-3H9z" fill="#5a4636"/><rect x="11" y="23.5" width="10" height="3.5" fill="#d9573b"/><rect x="8.5" y="27" width="15" height="2" fill="#a6adb3"/>`],
    '21382': ['輪中', `<circle cx="16" cy="16" r="13.5" fill="#9fd0ef"/><circle cx="16" cy="16" r="9.5" fill="#6a9a4b"/><circle cx="16" cy="16" r="7" fill="#e3ecb8"/>
      <path d="M10.5 19.5v-3.5l3-2.5 3 2.5v3.5z" fill="#f4e6c8"/><path d="M16.5 21v-3l2.5-2 2.5 2v3z" fill="#f4e6c8"/>
      <path d="M5 9.5c1-1 2 0 3-1M24 24.5c1-1 2 0 3-1" stroke="#4f86c6"/>`],
    '21383': ['安八の梨', `<path d="M16 8V4.5"/><path d="M16.5 6c1.5-2.5 5-3 7-1.5-2 2.5-5 2.5-7 1.5z" fill="#6a9a4b"/>
      <circle cx="16" cy="18" r="10" fill="#d9b864"/>${[[11, 15], [14, 12], [19, 13], [21, 18], [17, 17], [12, 20], [15, 23], [20, 22], [10, 18], [23, 15]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".6" fill="#a8873a" stroke="none"/>`).join('')}`],
    '21401': ['徳山ダム', `<path d="M2 28V13l6-7 5 6v16z" fill="#6a9a4b"/><path d="M30 28V13l-6-7-5 6v16z" fill="#5a8a40"/>
      <path d="M11 9h10v4H11z" fill="#6fb0e0"/><path d="M10 13h12l-1.5 15h-9z" fill="#c9cdd1"/>
      <path d="M14.5 13.5h3V28h-3z" fill="#cfeaf7"/><path d="M10 13h12"/><path d="M3 28h26" stroke="#4f86c6" stroke-width="1.6"/>`],
    '21403': ['野古墳群', `<g transform="rotate(35 16 16)"><path d="M16 4a7 7 0 0 1 4.6 12.3L25 28H7l4.4-11.7A7 7 0 0 1 16 4z" fill="none" stroke="#9fd0ef" stroke-width="5"/>
      <path d="M16 4a7 7 0 0 1 4.6 12.3L25 28H7l4.4-11.7A7 7 0 0 1 16 4z" fill="#6a9a4b"/>${[[15, 9], [18, 12], [13, 13], [14, 22], [18, 24], [11, 25], [21, 21]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#3f6b3a" stroke="none"/>`).join('')}</g>`],
    '21404': ['いび茶', `<path d="M16 28V14" stroke="#3f6b3a" stroke-width="1.6"/>
      <path d="M16 21c-6 0-10.5-4-10.5-9.5 6 0 10.5 4 10.5 9.5z" fill="#6a9a4b"/><path d="M16 17.5c5.5 0 9.5-3.5 9.5-8.5-5.5 0-9.5 3.5-9.5 8.5z" fill="#6a9a4b"/>
      <path d="M16 14.5c-2.2-2.2-2.2-6.5 0-10 2.2 3.5 2.2 7.8 0 10z" fill="#9cc65f"/><path d="M8 14c3 2 5.5 4 8 7M24 11c-2.5 1.5-5 3.5-8 6.5" stroke="#3f6b3a"/>`],
    // ---- 中濃圏域 ----
    '21205': ['関の刃物', `<g transform="rotate(-38 16 16)"><path d="M11.5 13.5h12c3 0 5 1.6 6 4h-18z" fill="#e6ecf0"/>
      <rect x="2.5" y="13" width="9" height="5" rx="1.5" fill="#6b4a2e"/><path d="M11.5 12.8v5.4" stroke-width="1.6"/><path d="M13.5 15.5h10" stroke="#a6b4bc"/></g>`],
    '21207': ['美濃和紙', `<rect x="10" y="4.5" width="16" height="21" fill="#efe7d3" transform="rotate(9 18 15)"/><path d="M6 6.5h15v20H6z" fill="#fcf8ee"/>
      <path d="M8.5 11.5c3-1 5.5 1 10 0M8.5 16.5c2.5 1 6.5-1 10 0M8.5 21.5c3-1 5.5 0 9-1" stroke="#d6c8a6"/>`],
    '21211': ['堂上蜂屋柿', `<path d="M3 4.5h26" stroke="#6b4a2e" stroke-width="2.4"/><path d="M9 4.5v24M16 4.5v24M23 4.5v24" stroke="#9a6a3e"/>
      ${[[9, 9], [9, 17], [9, 25], [16, 13], [16, 21], [23, 9], [23, 17], [23, 25]].map(([x, y]) => `<path d="M${x - 3.2} ${y - 2}c0-1.5 1.5-2.5 3.2-2.5s3.2 1 3.2 2.5c0 2.5-1.5 4.3-3.2 5.3-1.7-1-3.2-2.8-3.2-5.3z" fill="#c4602a"/><path d="M${x - 1.4} ${y - 2.6}h2.8" stroke="#4f3a1f" stroke-width="1.4"/>`).join('')}`],
    '21214': ['花フェスタのバラ', `<path d="M16 19v10" stroke="#3f6b3a" stroke-width="1.6"/><path d="M16 25.5c-3.5 0-5.5-2-5.5-4.5 3.5 0 5.5 1.5 5.5 4.5z" fill="#6a9a4b"/>
      <path d="M16 23c3 0 5-1.6 5-4-3 0-5 1.4-5 4z" fill="#6a9a4b"/><circle cx="16" cy="11.5" r="8" fill="#d9465f"/>
      <path d="M16 11.5c1.6-1 3.2 0 2.6 2s-4.2 2-5.2 0 1-5 4.2-5 5.2 3 4.2 6.2" stroke="#9c2840"/>`],
    '21219': ['郡上おどり', `<rect x="4" y="6" width="12" height="22" rx="4.5" fill="#d8ad6a" transform="rotate(-10 10 17)"/>
      <rect x="15" y="4" width="13" height="23" rx="5" fill="#c99a52"/><path d="M21.5 9l-4 7.5M21.5 9l4 7.5" stroke="#c0392b" stroke-width="2"/>
      <circle cx="21.5" cy="9" r="1.5" fill="#c0392b"/><path d="M17 22.5h9" stroke="#9a6a3e"/>`],
    '21501': ['日本ライン', `<path d="M5 20l4-10 5 3 3 7z" fill="#8a8f7a"/><path d="M17 20l4.5-9 4 3 2.5 6z" fill="#7d8a6a"/>
      <path d="M3 20c5-2.5 9 2.5 14 0s9-2.5 12 0v8H3z" fill="#6fb0e0"/><path d="M6 24.5c2-1 4 1 6 0M17 25.5c2-1 4 1 6 0" stroke="#fff"/>`],
    '21502': ['日本最古の戸籍', `<path d="M7 9h18v14H7z" fill="#f4e6c8"/><rect x="4" y="7" width="4" height="18" rx="2" fill="#9a6a3e"/>
      <rect x="24" y="7" width="4" height="18" rx="2" fill="#9a6a3e"/><path d="M11 12v8M14 12v8M17 12v6M20 12v8" stroke="#6b4a2e"/>`],
    '21503': ['漕艇のまち', `<path d="M6.5 25.5L23 7M25.5 25.5L9 7" stroke="#9a6a3e" stroke-width="2"/>
      <ellipse cx="24.5" cy="5.5" rx="4.2" ry="2" transform="rotate(-48 24.5 5.5)" fill="#d9573b"/><ellipse cx="7.5" cy="5.5" rx="4.2" ry="2" transform="rotate(48 7.5 5.5)" fill="#d9573b"/>
      <path d="M3 28c3-1.5 5 0 8-1M21 27c3-1.5 5 0 8-1" stroke="#4f86c6"/>`],
    '21504': ['日本最古の石', `<path d="M4 25l3.5-9 6-5.5 8 1.2 5 5.5 1.5 7.8z" fill="#8f8a80"/>
      <path d="M6.5 20c5-1 12.5 0 20 1M9.5 15c4.5-.5 9 0 13.5 1.2" stroke="#6e6a62"/><path d="M25 2.5l1.1 2.9 2.9 1.1-2.9 1.1-1.1 2.9-1.1-2.9-2.9-1.1 2.9-1.1z" fill="#f2c14e" stroke="#c9952a" stroke-width="1"/>`],
    '21505': ['命のビザ', `<path d="M8 4h12l5 5v19H8z" fill="#fcf8ee"/><path d="M20 4v5h5" fill="#e9e1cf"/>
      <path d="M11 12h8M11 15h11M11 18h7" stroke="#9aa0a6"/><path d="M11 23.5c1-1.5 2-1.5 2.5 0s1.5 1.5 2.5 0" stroke="#4b6fa8"/>
      <rect x="17.5" y="20" width="5.5" height="5.5" rx=".8" fill="#fbe3dc" stroke="#d9573b" stroke-width="1.4"/><path d="M19.2 21.8h2.1M19.2 23.7h2.1" stroke="#d9573b"/>`],
    '21506': ['東濃ひのき', [[10, 22], [22, 22], [16, 12.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#e8c88e" stroke="#7a5432" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="3" fill="none" stroke="#c39a5a"/><circle cx="${x}" cy="${y}" r=".8" fill="#c39a5a" stroke="none"/>`).join('')],
    '21507': ['つちのこ', `<path d="M4 18c0-3 3-4.5 6-4.5 2-2 6-3 10-2 3 .8 5 3 5 5l4 1.2-4 2c-1 3-5 5-10 5-4 0-7-1-9-3-2 0-2-2-2-3.7z" fill="#8a7a4a"/>
      <circle cx="8" cy="16.5" r="1.1" fill="${O}" stroke="none"/><path d="M4 18.5H1.5" stroke="#d9573b"/>
      <path d="M13 15l2 1.5M17 14.5l2 1.5M21 15.5l1.5 1.5M12 20l2 1M17 20l2 1" stroke="#5c4f2e"/>`],
    '21521': ['中山道の旅笠', `<path d="M24 8L9.5 29" stroke="#9a6a3e" stroke-width="1.8"/>
      <path d="M3 20c3-7 8-11 13-11s10 4 13 11c-4 1.5-9 2-13 2s-9-.5-13-2z" fill="#e2c27a"/>
      <path d="M16 9l-6.5 12M16 9v13M16 9l6.5 12" stroke="#b9954a"/><path d="M14 22v4.5M18 22v4.5" stroke="#c0392b" stroke-width="1.6"/>`],
    // ---- 東濃圏域 ----
    '21204': ['美濃焼の茶碗', `<path d="M5 13h22c0 7-5 11-11 11S5 20 5 13z" fill="#5f8f5a"/><path d="M12 24h8v2.5h-8z" fill="#5f8f5a"/>
      <ellipse cx="16" cy="13" rx="11" ry="2.6" fill="#ece4d2"/><path d="M8 18c2 1 3-1 5 0s3 1 5 0 3-1 5 0" stroke="#d8ccae" stroke-width="1.6"/>`],
    '21206': ['栗きんとん', `<ellipse cx="16" cy="25.5" rx="12" ry="2.8" fill="#ece4d2"/>
      <path d="M6.5 19.5c0-5 4-8 8-9.5L16 7l1.5 3c4 1.5 8 4.5 8 9.5 0 3.5-4.5 5-9.5 5s-9.5-1.5-9.5-5z" fill="#e3b866"/>
      <path d="M16 7.5l-2.6 4.2M16 7.5V12M16 7.5l2.6 4.2" stroke="#a9762c"/>${[[11, 17], [14, 20], [19, 16], [21, 20], [16, 15], [10, 21], [17, 22.5], [23, 17.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="#a9762c" stroke="none"/>`).join('')}`],
    '21208': ['美濃焼の徳利', `<path d="M21 22h8l-1.5 4.5h-5z" fill="#ece4d2"/>
      <path d="M12.5 5h5v3c0 2 5.5 5 5.5 11 0 5-3.5 7.5-8 7.5S7 24 7 19c0-6 5.5-9 5.5-11z" fill="#4b6fa8"/>
      <rect x="11.5" y="3" width="7" height="2.5" rx="1" fill="#4b6fa8"/><path d="M8.5 17.5h13" stroke="#ece4d2" stroke-width="1.6"/>`],
    '21210': ['恵那の栗', `<circle cx="16" cy="17" r="9" fill="#9cb648"/>${spikes(16, 17, 9, 12.5, 18, '#7f9a33')}
      <path d="M11 18.5c0-4 2-6 5-8 3 2 5 4 5 8 0 2-2 3-5 3s-5-1-5-3z" fill="#8a4b2a"/><path d="M11.5 19c3 1 6 1 9 0" stroke="#e8c79a" stroke-width="1.6"/>`],
    '21212': ['美濃焼の皿', `<circle cx="20" cy="13" r="9" fill="#e9e3d6"/><circle cx="14" cy="18" r="11" fill="#f6f2ea"/>
      <circle cx="14" cy="18" r="6.5" fill="#fff" stroke="#4b6fa8" stroke-width="1.6"/>${ring(14, 18, 8.8, 10, .9, '#4b6fa8')}
      <path d="M11 18c1.5-2 4.5-2 6 0-1.5 2-4.5 2-6 0z" fill="#4b6fa8" stroke="none"/>`],
    // ---- 飛騨圏域 ----
    '21203': ['高山祭の屋台', `<path d="M16 5V2"/><path d="M4.5 10.5c4-4 19-4 23 0z" fill="#8b2f2a"/>
      <rect x="9" y="10.5" width="14" height="6" fill="#e8b84a"/><rect x="8" y="16.5" width="16" height="5.5" fill="#c0392b"/>
      <rect x="7" y="22" width="18" height="3" fill="#6b4a2e"/><circle cx="11" cy="26.5" r="2.6" fill="${O}"/><circle cx="21" cy="26.5" r="2.6" fill="${O}"/>`],
    '21217': ['飛騨牛', `<path d="M10 11c-3 0-5-2-5-4.5 2 1 4 1 5 1zM22 11c3 0 5-2 5-4.5-2 1-4 1-5 1z" fill="#efe3c6"/>
      <path d="M10 13.5l-5.5 1 1 2.5h4.5zM22 13.5l5.5 1-1 2.5h-4.5z" fill="#3b2a22"/>
      <path d="M10 9.5h12v9.5c0 4-2 8-6 8s-6-4-6-8z" fill="#3b2a22"/><ellipse cx="16" cy="23" rx="4.5" ry="3" fill="#e2a691"/>
      <circle cx="14.3" cy="23" r=".8" fill="${O}" stroke="none"/><circle cx="17.7" cy="23" r=".8" fill="${O}" stroke="none"/>
      <circle cx="13" cy="15" r="1.1" fill="#fff" stroke="none"/><circle cx="19" cy="15" r="1.1" fill="#fff" stroke="none"/>`],
    '21220': ['下呂温泉', `<path d="M5 20h22c0 4-5 7-11 7S5 24 5 20z" fill="#6fb0e0"/><ellipse cx="16" cy="20" rx="11" ry="2.6" fill="#a9d6f0"/>
      <path d="M10 15.5c-2-2 2-4 0-6s2-4 0-6M16 15.5c-2-2 2-4 0-6s2-4 0-6M22 15.5c-2-2 2-4 0-6s2-4 0-6" stroke="#d9573b" stroke-width="2"/>`],
    '21604': ['合掌造り', `<path d="M16 3L3.5 23h25z" fill="#a58450"/><path d="M16 3l-4.5 7.2c1.5 1 7.5 1 9 0z" fill="#fff"/>
      <path d="M16 3L10 23M16 3l6 20" stroke="#7d6237"/><rect x="14" y="12" width="4" height="3" fill="#3b2a22"/><rect x="12.5" y="17" width="7" height="3" fill="#3b2a22"/>
      <rect x="6" y="23" width="20" height="5" fill="#ece0c4"/><path d="M11 23v5M16 23v5M21 23v5" stroke="#6b4a2e"/>`]
  };

  // cls はサイズなどを付け足すとき。名前は読み上げとホバーに使う
  function icon(code, cls) {
    const it = ICONS[code];
    if (!it) return '';
    return `<svg class="ticon${cls ? ' ' + cls : ''}" viewBox="0 0 32 32" role="img" aria-label="${it[0]}"><title>${it[0]}</title><g fill="none" stroke="${O}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">${it[1]}</g></svg>`;
  }
  const nameOf = code => ICONS[code] ? ICONS[code][0] : '';
  return { icon, nameOf, ICONS };
})();
