// 岐阜統一戦記 画面の処理・描画
const L = window.GameLogic;
// 古い index.html が残っていて icons.js が読まれていなくても、アイコンなしで動くようにする
const TI = window.TownIcons || { icon: () => '', nameOf: () => '' };
const SAVE_KEY = 'gifu-toitsu-v1';
const NAMES = {}, ADJ = {}, AREA = {}, BYCODE = {};
for (const m of MAP.muni) { NAMES[m.code] = m.name; ADJ[m.code] = m.adj; AREA[m.code] = m.area; BYCODE[m.code] = m; }
// 市町村名の読み（ふりがな）。地図・見出し・市町村選び・決戦の幕開けに付ける。メニューで外せる
const KANA = {
  '21201': 'ぎふし', '21202': 'おおがきし', '21203': 'たかやまし', '21204': 'たじみし', '21205': 'せきし', '21206': 'なかつがわし',
  '21207': 'みのし', '21208': 'みずなみし', '21209': 'はしまし', '21210': 'えなし', '21211': 'みのかもし', '21212': 'ときし',
  '21213': 'かかみがはらし', '21214': 'かにし', '21215': 'やまがたし', '21216': 'みずほし', '21217': 'ひだし', '21218': 'もとすし',
  '21219': 'ぐじょうし', '21220': 'げろし', '21221': 'かいづし', '21302': 'ぎなんちょう', '21303': 'かさまつちょう', '21341': 'ようろうちょう',
  '21361': 'たるいちょう', '21362': 'せきがはらちょう', '21381': 'ごうどちょう', '21382': 'わのうちちょう', '21383': 'あんぱちちょう',
  '21401': 'いびがわちょう', '21403': 'おおのちょう', '21404': 'いけだちょう', '21421': 'きたがたちょう', '21501': 'さかほぎちょう',
  '21502': 'とみかちょう', '21503': 'かわべちょう', '21504': 'ひちそうちょう', '21505': 'やおつちょう', '21506': 'しらかわちょう',
  '21507': 'ひがししらかわむら', '21521': 'みたけちょう', '21604': 'しらかわむら'
};
const kanaOn = () => prefs.kana !== false;
// 市町村名を、ふりがな付きの HTML にする（ふりがなを外していれば名前だけ）
const rb = c => kanaOn() && KANA[c] ? `<ruby>${NAMES[c]}<rt>${KANA[c]}</rt></ruby>` : NAMES[c];
let S = null, sel = null, seenLog = 0;
const $ = id => document.getElementById(id);
const svg = $('map');

function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {} }
function loadSaved() { try { const t = localStorage.getItem(SAVE_KEY); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

const colorVar = f => `var(--${S.factions[f].color})`;
function ownerName(c) { const o = S.m[c].owner; return o < 0 ? '独立' : S.factions[o].name; }

// ---------- 地図 ----------
const NS = 'http://www.w3.org/2000/svg';
const pathEls = {}, labelEls = {}, kanaEls = {};
function buildMap() {
  const g = $('munis'), lg = $('labels');
  for (const m of MAP.muni) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', m.d); p.setAttribute('class', 'mu'); p.dataset.code = m.code;
    p.setAttribute('fill-rule', 'evenodd');
    g.appendChild(p); pathEls[m.code] = p;
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', m.lx); t.setAttribute('y', m.ly); t.textContent = m.name;
    lg.appendChild(t); labelEls[m.code] = t;
    const k = document.createElementNS(NS, 'text');
    k.setAttribute('x', m.lx); k.setAttribute('class', 'kana'); k.textContent = KANA[m.code] || '';
    lg.appendChild(k); kanaEls[m.code] = k;
  }
  const chips = $('chips');
  for (const r of ['自陣', '全県', ...L.REGIONS]) {
    const b = document.createElement('button'); b.textContent = r; b.dataset.r = r;
    b.setAttribute('aria-pressed', r === '自陣' ? 'true' : 'false');
    b.onclick = () => zoomRegion(r);
    chips.appendChild(b);
  }
}
let vb = { x: 0, y: 0, w: MAP.w, h: MAP.h };
function rect() { return svg.getBoundingClientRect(); }
function setVB(keep) { svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); if (keep !== false) lastBox = null; updateLabels(); }
function fitBox(b, pad) {
  const r = rect(); const sheetEl = $('sheet');
  const shH = sheetEl ? Math.min(sheetEl.offsetHeight, r.height * 0.6) : 0;
  // 上の圏域ボタンと凡例に隠れる分も避ける
  const lg = $('legend'), top = lg && lg.offsetHeight ? Math.min(r.height * 0.25, lg.offsetTop + lg.offsetHeight + 4) : 0;
  const visPx = Math.max(80, r.height - shH - top);
  let w = b.w + pad * 2, visH = b.h + pad * 2;
  const asp = r.width / visPx;
  if (w / visH > asp) visH = w / asp; else w = visH * asp;
  const h = w * r.height / Math.max(1, r.width);
  return { x: b.x + b.w / 2 - w / 2, y: b.y + b.h / 2 - visH / 2 - top * w / Math.max(1, r.width), w, h };
}
let anim = null;
function animateTo(t) {
  if (anim) cancelAnimationFrame(anim);
  const from = { ...vb }, t0 = performance.now(), dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280;
  const step = now => {
    const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3);
    for (const key of ['x', 'y', 'w', 'h']) vb[key] = from[key] + (t[key] - from[key]) * e;
    setVB(); if (k < 1) anim = requestAnimationFrame(step);
  };
  anim = requestAnimationFrame(step);
}
function bboxOf(codes) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const c of codes) { const b = pathEls[c].getBBox(); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
// 自陣：自陣営の市町村と、隣の市町村の名前の位置が入るところまで寄る（隣をそのままタップできる大きさ）
function homeBox() {
  const own = L.owned(S, 0);
  if (!own.length) return bboxOf(Object.keys(NAMES));
  const b = bboxOf(own);
  let x0 = b.x, y0 = b.y, x1 = b.x + b.w, y1 = b.y + b.h;
  for (const c of own) for (const n of ADJ[c]) {
    if (S.m[n].owner === 0) continue;
    const m = BYCODE[n]; x0 = Math.min(x0, m.lx); y0 = Math.min(y0, m.ly); x1 = Math.max(x1, m.lx); y1 = Math.max(y1, m.ly);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
function regionView(r) {
  if (r === '自陣') return { b: homeBox(), pad: 40, flash: [] };
  if (r === '全県') return { b: bboxOf(Object.keys(NAMES)), pad: 14, flash: [] };
  const codes = L.regionCodes(r);
  return { b: bboxOf(codes), pad: 8, flash: codes };
}
function pressChip(r) { for (const x of $('chips').children) x.setAttribute('aria-pressed', x.dataset.r === r ? 'true' : 'false'); }
function zoomRegion(r, now) {
  const { b, pad, flash } = regionView(r), box = { x: b.x - pad, y: b.y - pad, w: b.w + pad * 2, h: b.h + pad * 2 };
  pressChip(r);
  if (now) { vb = fitBox(b, pad); setVB(); lastBox = box; }
  else { animateTo(fitBox(b, pad)); setTimeout(() => { lastBox = box; }, 320); }
  flashArea(flash);
}
// どこからどこまでがその圏域かを、一瞬光らせて見せる
let flashTimer = null;
function flashArea(codes) {
  const g = $('flash'); g.textContent = ''; clearTimeout(flashTimer);
  if (!codes.length) return;
  // 太い縁取りの上に同じ形の塗りを重ねると、外周だけが縁取りとして残る
  const inner = document.createElementNS(NS, 'g'); inner.setAttribute('class', 'flash');
  for (const cls of ['fl-edge', 'fl-fill']) for (const c of codes) {
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', BYCODE[c].d); p.setAttribute('class', cls); p.setAttribute('fill-rule', 'evenodd'); inner.appendChild(p);
  }
  g.appendChild(inner);
  flashTimer = setTimeout(() => { g.textContent = ''; }, 1900);
}
function updateLabels() {
  const ppu = rect().width / vb.w;
  if (!isFinite(ppu) || ppu <= 0) return;
  const lg = $('labels');
  lg.setAttribute('font-size', (12 / ppu).toFixed(2));
  lg.setAttribute('stroke-width', (3 / ppu).toFixed(2));
  // ふりがなは名前の上に小さく。そのぶん重なりを見る枠も上へ広げる
  const fs = 12 / ppu, kfs = fs * 0.6, kana = kanaOn(), placed = [];
  const isCap = c => S && S.factions.some(f => f.alive && f.capital === c);
  const order = Object.keys(labelEls).sort((a, b) => (b === sel) - (a === sel) || isCap(b) - isCap(a) || AREA[b] - AREA[a]);
  for (const c of order) {
    const m = BYCODE[c], kw = kana ? (KANA[c] || '').length * kfs * 1.02 : 0, w = Math.max(NAMES[c].length * fs * 1.05, kw) + fs * 0.4, h = fs * 1.3;
    const box = { x0: m.lx - w / 2, x1: m.lx + w / 2, y0: m.ly - h / 2 - (kana ? kfs * 1.1 : 0), y1: m.ly + h / 2 };
    const must = c === sel || isCap(c) || (replay && replay.focus === c);
    const fits = Math.sqrt(AREA[c]) * ppu > 30 && !placed.some(q => q.x0 < box.x1 && box.x0 < q.x1 && q.y0 < box.y1 && box.y0 < q.y1);
    const show = must || fits;
    if (show) placed.push(box);
    labelEls[c].style.display = show ? '' : 'none';
    const k = kanaEls[c];
    k.style.display = show && kana ? '' : 'none';
    if (show && kana) { k.setAttribute('y', (m.ly - fs * 0.5 - kfs * 0.6).toFixed(2)); k.setAttribute('font-size', kfs.toFixed(2)); k.setAttribute('stroke-width', (2.4 / ppu).toFixed(2)); }
    labelEls[c].setAttribute('class', isCap(c) ? 'cap' : '');
  }
}
function zoomAt(cx, cy, f) {
  const r = rect();
  const px = vb.x + (cx - r.left) / r.width * vb.w, py = vb.y + (cy - r.top) / r.height * vb.h;
  const nw = Math.min(MAP.w * 1.6, Math.max(MAP.w / 10, vb.w * f));
  const k = nw / vb.w;
  vb = { x: px - (px - vb.x) * k, y: py - (py - vb.y) * k, w: vb.w * k, h: vb.h * k };
  clampVB(); setVB();
}
function clampVB() {
  const m = 0.35;
  vb.x = Math.min(MAP.w - vb.w * m, Math.max(-vb.w * (1 - m), vb.x));
  vb.y = Math.min(MAP.h - vb.h * m, Math.max(-vb.h * (1 - m), vb.y));
}
const ptrs = new Map(); let moved = 0, downTarget = null, lastPinch = null;
svg.addEventListener('pointerdown', e => {
  svg.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 1) { moved = 0; downTarget = e.target; } else lastPinch = null;
});
svg.addEventListener('pointermove', e => {
  if (!ptrs.has(e.pointerId)) return;
  const prev = ptrs.get(e.pointerId); const cur = { x: e.clientX, y: e.clientY };
  ptrs.set(e.pointerId, cur);
  if (ptrs.size === 1) {
    const dx = cur.x - prev.x, dy = cur.y - prev.y; moved += Math.abs(dx) + Math.abs(dy);
    const u = vb.w / rect().width; vb.x -= dx * u; vb.y -= dy * u; clampVB(); setVB();
  } else if (ptrs.size === 2) {
    const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (lastPinch) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, lastPinch / d);
    lastPinch = d; moved = 99;
  }
});
const endPtr = e => {
  if (!ptrs.has(e.pointerId)) return;
  ptrs.delete(e.pointerId);
  if (ptrs.size === 0 && moved < 8 && downTarget && S) select(downTarget.dataset && downTarget.dataset.code);
  if (ptrs.size < 2) lastPinch = null;
};
svg.addEventListener('pointerup', endPtr); svg.addEventListener('pointercancel', endPtr);
svg.addEventListener('wheel', e => { e.preventDefault(); zoomAt(e.clientX, e.clientY, Math.exp(e.deltaY * 0.0015)); }, { passive: false });
let lastBox = null;
new ResizeObserver(() => { const r = rect(); if (r.width < 10 || r.height < 10) return; vb = fitBox(lastBox || vb, 0); setVB(false); }).observe(svg);

function paintMap() {
  const frontier = new Set(Object.keys(S.m).filter(c => S.m[c].owner === -1 && L.adjacentTo(S, ADJ, c, 0)));
  // 圏域制覇では、目標の圏域の外を薄くする
  const goal = S.mode === 'region' ? new Set(L.goalOf(S).codes) : null;
  for (const c in pathEls) {
    const x = S.m[c], p = pathEls[c];
    p.classList.toggle('out', !!goal && !goal.has(c));
    const own = replay ? replay.owners[c] : x.owner;
    if (own >= 0) {
      const isCap = S.factions[own].capital === c;
      p.style.fill = `color-mix(in srgb, ${colorVar(own)} ${isCap ? 92 : 68}%, var(--land))`;
    } else if (x.pact.includes(0)) p.style.fill = `color-mix(in srgb, var(--me) 22%, var(--land))`;
    else p.style.fill = frontier.has(c) ? 'var(--land-hi)' : 'var(--land)';
  }
  const tg = $('talks'); tg.textContent = '';
  for (const c in S.m) {
    const t = S.m[c].talk; if (!t) continue;
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', BYCODE[c].d); p.setAttribute('class', 'talk');
    p.style.stroke = colorVar(t.f); tg.appendChild(p);
    if (t.rival !== undefined) {
      const q = document.createElementNS(NS, 'path'); q.setAttribute('d', BYCODE[c].d); q.setAttribute('class', 'talk talk2');
      q.style.stroke = colorVar(t.rival); tg.appendChild(q);
    }
  }
  // 首長選挙：候補を立てた陣営の色の点線
  for (const c in S.m) {
    const r = S.m[c].race; if (!r) continue;
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', BYCODE[c].d); p.setAttribute('class', 'race');
    p.style.stroke = colorVar(r.ch); tg.appendChild(p);
  }
  if (S.lure) for (const r of L.lureRows(S, ADJ)) {
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', BYCODE[r.site].d); p.setAttribute('class', 'lure');
    p.style.stroke = colorVar(r.f); tg.appendChild(p);
  }
  $('selPath').setAttribute('d', sel ? BYCODE[sel].d : '');
  const lg = $('legend'); lg.textContent = '';
  for (const f of S.factions) {
    if (!f.alive) continue;
    const s = document.createElement('span');
    s.innerHTML = `<i class="dot" style="background:${colorVar(f.id)}"></i>${f.name}`; lg.appendChild(s);
  }
  const s1 = document.createElement('span'); s1.innerHTML = `<i class="dot" style="background:color-mix(in srgb, var(--me) 22%, var(--land))"></i>協定先`; lg.appendChild(s1);
  updateLabels();
}

// ---------- 画面 ----------
function renderStatus() {
  const d = L.dateOf(S.turn), me = S.factions[0];
  $('date').innerHTML = `<small>令和${d.reiwa}年</small><b>${d.month}月</b>`;
  $('date').setAttribute('aria-label', d.label);
  const mo = $('money'); mo.innerHTML = `${me.money}億<span class="unit">円</span>`; mo.className = 'num' + (me.money < 0 ? ' neg' : '');
  // 丸が多いとバーに収まらないので、6以上は数字で出す
  const max = L.apMax(S, 0); $('pips').innerHTML = max > 5 ? `<b class="num">${S.ap}/${max}</b>` : Array.from({ length: max }, (_, i) => `<i class="${i < S.ap ? 'on' : ''}"></i>`).join('');
  $('pips').setAttribute('aria-label', `行動力 ${S.ap}/${max}`);
  const g = L.goalOf(S);
  $('countLbl').textContent = S.mode === 'region' ? g.region : '支配'; // 幅が足りないので圏域名だけ
  $('count').textContent = `${g.codes.filter(c => S.m[c].owner === 0).length}/${g.codes.length}`;
  const nd = L.dateOf(S.turn + 1); $('endSub').textContent = `${nd.month}月へ`;
  const unread = S.log.length - seenLog; const bd = $('newsBadge');
  bd.hidden = unread <= 0; bd.textContent = unread > 99 ? '99+' : unread;
}
function meter(label, v, cls, key) {
  v = Math.round(v);
  return `<div class="meter"${key ? ` data-stat="${key}"` : ''}><span>${label}</span><div class="bar ${cls || ''}${v < 30 && cls !== 'rel' ? ' low' : ''}"><i style="width:${v}%"></i></div><b class="num">${v}</b></div>`;
}
// 関係度のゲージ。次の段階（独立なら協定・協議、ほかの陣営なら擁立・切り崩し）の目盛りを添える
function relGauge(c) {
  const x = S.m[c], v = Math.round(S.rel[0][c]), indep = x.owner < 0;
  const marks = indep ? [[50, '協定'], [70, '協議']] : [[50, '擁立'], [60, '切り崩し']];
  const hint = !L.adjacentTo(S, ADJ, c, 0) ? '隣り合うと交流できます'
    : indep ? (v < 50 ? `連携協定まであと${50 - v}` : !x.pact.includes(0) ? '連携協定を結べます' : v < 70 ? `合併協議まであと${70 - v}` : '合併協議を申し入れられます')
    : (v < 50 ? `候補の擁立まであと${50 - v}` : v < 60 ? `切り崩しまであと${60 - v}` : '切り崩せる関係度です');
  return `<div class="relg" data-stat="rel"><div class="relg-top"><span>関係度</span><b class="num">${v}</b><small>${hint}</small></div>
    <div class="relg-bar"><i style="width:${v}%"></i>${marks.map(([at, lb]) => `<span class="mk${v >= at ? ' on' : ''}" style="left:${at}%" data-at="${at}"><em>${lb}</em></span>`).join('')}</div></div>`;
}
// コマンドで動いた数値を、地図の上の吹き出しと、ゲージが伸びる動きで見せる
const STAT_LABEL = { rel: '関係度', ind: '産業力', tour: '観光力', sat: '満足度', dis: '防災力' };
function statsOf(c) { const x = S.m[c]; return { rel: S.rel[0][c], ind: x.ind, tour: x.tour, sat: x.sat, dis: x.dis }; }
function showGain(c, before) {
  const after = statsOf(c), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const moved = Object.keys(after).filter(k => Math.round(after[k]) !== Math.round(before[k]));
  moved.forEach((k, i) => {
    const d = Math.round(after[k]) - Math.round(before[k]), txt = (d > 0 ? '+' : '−') + Math.abs(d);
    mapPop(c, `${STAT_LABEL[k]} ${txt}`, d < 0, i);
    for (const el of $('sheet').querySelectorAll(`[data-stat="${k}"]`)) growBar(el, before[k], after[k], txt, d < 0, still);
  });
  if (moved.length && !still) {
    const pg = $('pulse'); pg.textContent = '';
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', BYCODE[c].d); p.setAttribute('class', 'pulse');
    p.style.fill = p.style.stroke = 'var(--me)'; pg.appendChild(p);
    setTimeout(() => { if (pg.firstChild === p) pg.textContent = ''; }, 1400);
  }
}
function growBar(el, from, to, txt, down, still) {
  const bar = el.querySelector('i'), num = el.querySelector('b');
  const pop = document.createElement('span'); pop.className = 'gain' + (down ? ' down' : ''); pop.textContent = txt;
  if (el.classList.contains('relg')) num.after(pop); else el.appendChild(pop);
  if (still) return;
  const dur = 900;
  bar.style.transition = 'none'; bar.style.width = from + '%'; bar.getBoundingClientRect();
  bar.style.transition = `width ${dur}ms cubic-bezier(.2,.8,.2,1)`; bar.style.width = to + '%';
  // 目盛りを越えたら、届いた瞬間に光らせる
  for (const mk of el.querySelectorAll('.mk')) {
    const at = Number(mk.dataset.at);
    if (from < at && to >= at) { mk.classList.remove('on'); setTimeout(() => mk.classList.add('on', 'hit'), dur * Math.min(1, (at - from) / (to - from))); }
  }
  const a = Math.round(from), b = Math.round(to), t0 = performance.now();
  const step = now => { const k = Math.min(1, (now - t0) / dur); num.textContent = Math.round(a + (b - a) * (1 - Math.pow(1 - k, 3))); if (k < 1 && num.isConnected) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
// 市町村の名前の少し上に、上がった数値を浮かべる
function mapPop(c, text, down, i) {
  const ctm = svg.getScreenCTM(); if (!ctm) return;
  const pt = svg.createSVGPoint(); pt.x = BYCODE[c].lx; pt.y = BYCODE[c].ly;
  const q = pt.matrixTransform(ctm), w = $('mapwrap').getBoundingClientRect();
  const el = document.createElement('div'); el.className = 'mappop' + (down ? ' down' : ''); el.textContent = text;
  el.style.left = (q.x - w.left) + 'px'; el.style.top = (q.y - w.top - 18 - i * 26) + 'px';
  $('mapwrap').appendChild(el);
  setTimeout(() => el.remove(), 1700);
}
// 台帳は名前・要点・コマンドだけを出し、数値や説明は「詳細」を押したときだけ開く
let detailOpen = false;
function setDetailOpen(v) {
  detailOpen = v;
  const sh = $('sheet'); sh.dataset.open = v ? 'true' : 'false';
  const b = $('detailBtn'); if (b) { b.setAttribute('aria-expanded', v ? 'true' : 'false'); b.textContent = v ? '閉じる' : '詳細'; }
  if (sel) requestAnimationFrame(() => ensureVisible(sel));
}
function sheetFrame(head, line, main, full) {
  const sh = $('sheet');
  sh.dataset.open = detailOpen ? 'true' : 'false';
  const btn = full ? `<button class="morebtn" id="detailBtn" aria-expanded="${detailOpen}">${detailOpen ? '閉じる' : '詳細'}</button>` : '';
  sh.innerHTML = `<div class="body"><div class="head">${head}${btn}</div>${line ? `<p class="facts num">${line}</p>` : ''}${main}${full ? `<div class="full">${full}</div>` : ''}</div>`;
  if (full) $('detailBtn').onclick = () => setDetailOpen(!detailOpen);
}
function renderSheet() {
  const sh = $('sheet');
  if (!sel) {
    const me = S.factions[0];
    const first = L.owned(S, 0).length === 1 && S.turn < 3;
    const tips = first
      ? `<p class="empty">関係度50で<b>連携協定</b>、70で<b>合併協議</b>に進めます。協議の3か月後に住民投票です。</p>`
      : `<p class="empty">地図の市町村をタップすると、使えるコマンドが出ます。</p>`;
    const advs = L.advOf(S, 0);
    const advTag = advs.length ? `<span class="tag adv-tag">助言 ${advs.map(a => L.ADV_BY_ID[a.id].name).join('・')}</span>` : '';
    const advNote = advs.length ? `<div class="advs">${advs.map(a => advCard(a.id, a.left, true)).join('')}</div>` : advHint();
    const lureTag = S.lure ? `<span class="tag lure-tag">誘致合戦 あと${S.lure.left}か月</span>` : '';
    // 首長選挙：対立候補を立てられた自陣営の市町村と、候補を立てられる隣の市町村
    const races = Object.keys(S.m).filter(c => { const r = S.m[c].race; return r && (r.ch === 0 || r.inc === 0); });
    const open = Object.keys(S.m).filter(c => S.m[c].owner > 0 && !S.m[c].race && L.electLeft(S, c) < L.ELECT_WINDOW && L.adjacentTo(S, ADJ, c, 0));
    const electNote = (races.length ? `<p class="note talking">首長選挙：${races.map(c => `<b>${NAMES[c]}</b>（${S.m[c].race.inc === 0 ? '対立候補あり' : 'あなたの候補'}・見込み${Math.round(L.electMine(S, c))}％・あと${L.electLeft(S, c) + 1}か月）`).join('、')}。台帳の「演説会」で得票を伸ばせます</p>` : '')
      + (open.length ? `<p class="note">${open.map(c => NAMES[c]).join('・')}で首長選挙が近づいています。候補を立てて当選すれば、自陣営に移ります</p>` : '');
    sheetFrame(`${TI.icon(me.capital)}<h2>${rb(me.capital)}陣営</h2><span class="tag">${L.owned(S, 0).length}市町村</span>${goalTag()}${lureTag}${advTag}`,
      first ? '<b>隣の市町村をタップ</b>して、交流事業で関係度を上げましょう' : '',
      '',
      `<p class="facts num">人口 ${L.totalPop(S, 0).toFixed(1)}千人 · 平均満足度 ${Math.round(L.avgSat(S, 0))} · 収入 ${L.factionIncome(S, 0, L.dateOf(S.turn).month)}億円/月 · 維持費 ${L.upkeep(S, 0)}億円 · 魅力 ${Math.round(L.appeal(S, 0))} · 協議 同時${L.talksMax(S, 0)}件まで</p>` + lureHtml() + electNote + tips + advNote);
    for (const b of sh.querySelectorAll('[data-open-staff]')) b.onclick = () => showStaff('adv');
    bindLure(sh);
    return;
  }
  const c = sel, x = S.m[c], info = L.INFO[c], month = L.dateOf(S.turn).month;
  const mine = x.owner === 0;
  const ownerTag = x.owner >= 0 ? `<span class="tag owner" style="background:${colorVar(x.owner)}">${ownerName(c)}${S.factions[x.owner].capital === c ? '・本拠地' : ''}</span>` : `<span class="tag">独立</span>`;
  let notes = '', alert = '';
  if (info[2]) notes += `<p class="note">特産：${info[2]}${L.seasonX(c, month) > 1 ? '（いまが見ごろ）' : ''}</p>`;
  const fname = k => k === 0 ? 'あなたの陣営' : S.factions[k].name;
  if (x.talk && x.talk.rival !== undefined) {
    const t = x.talk;
    alert = `競り合い中・あと${t.left}か月`;
    notes += `<p class="note talking">条件の競り合い中：${fname(t.f)} 上乗せ${t.bids[t.f]}段／${fname(t.rival)} 上乗せ${t.bids[t.rival]}段。あと${t.left}か月で決着し、選ばれた側と住民投票</p>`;
  } else if (x.talk) { alert = `${fname(x.talk.f)}と協議中・あと${x.talk.left}か月`; notes += `<p class="note talking">${fname(x.talk.f)}と合併協議中。あと${x.talk.left}か月で住民投票</p>`; }
  if (x.talk && x.owner >= 0 && !L.inTalk(x.talk, x.owner)) {
    if (mine) alert = `狙われています・あと${x.talk.left}か月`;
    notes += `<p class="note${mine ? ' talking' : ''}" style="${mine ? 'color:var(--bad)' : ''}">${mine ? 'この市町村が狙われています。' : ''}引き留め ${x.talk.keep || 0}/${L.KEEP_MAX}段（賛成 −${(x.talk.keep || 0) * L.KEEP_STEP}ポイント）</p>`;
  }
  // 首長選挙：投票日と、候補が立っていれば両陣営の演説会と見込み
  const race = x.race, eLeft = L.electLeft(S, c);
  if (race && (race.ch === 0 || race.inc === 0)) {
    const e = Math.round(L.electMine(S, c)), other = race.ch === 0 ? race.inc : race.ch;
    if (race.inc === 0) alert = `対立候補・投票まで${eLeft + 1}か月`;
    notes += `<p class="note talking"${race.inc === 0 ? ' style="color:var(--bad)"' : ''}>首長選挙（${L.dateOf(x.elect).label}末に開票）：${race.inc === 0 ? `${fname(race.ch)}が対立候補を立てています。` : `あなたの陣営の候補が${fname(race.inc)}の現職に挑んでいます。`}演説会 あなた${race.rally[0]}回／相手${race.rally[other]}回。得票の見込み ${e}％</p>`;
  } else if (race) notes += `<p class="note">首長選挙（${L.dateOf(x.elect).label}末に開票）：${fname(race.ch)}が候補を立て、${fname(race.inc)}の現職に挑んでいます</p>`;
  else if (x.owner >= 0) notes += `<p class="note">次の首長選挙：${L.dateOf(x.elect).label}${eLeft < L.ELECT_WINDOW ? `（あと${eLeft + 1}か月。${mine ? 'ほかの陣営が対立候補を立てられる時期です' : '隣り合っていれば候補を立てられます'}）` : ''}</p>`;
  if (x.firms && x.firms.length) notes += `<p class="note">立地企業：${x.firms.map(k => k.name).join('、')}（税収 毎月+${L.firmInc(x)}億円。この市町村を持つ陣営に入ります）</p>`;
  if (S.lure && L.lureRows(S, ADJ).some(r => r.site === c)) notes += lureHtml(c);
  if (x.pact.length) notes += `<p class="note">連携協定：${x.pact.map(f => S.factions[f].name).join('、')}</p>`;
  const locals = (S.staff || []).filter(q => q.home === c && !q.ext);
  if (locals.length) notes += `<p class="note">ゆかりの人材：${locals.map(q => `${q.name}（${q.f < 0 ? '未登用' : (q.f === 0 ? 'あなたの陣営' : S.factions[q.f].name)}）`).join('、')}</p>`;
  const yukari = L.ADVISORS.filter(a => a.home === c);
  if (yukari.length) notes += `<p class="note">ゆかりの偉人：${yukari.map(a => `<b>${a.name}</b>（${L.advFx(a)}）`).join('、')}。${c === '21362' ? '毎年9月、この町を持つ陣営に助言に来ます' : mine ? '条件を満たすと人材の画面から招けます' : '自陣営にして条件を満たすと招けます'}</p>`;
  if (!mine && L.adjacentTo(S, ADJ, c, 0)) {
    const dr = L.appealRel(S, 0, c), dv = Math.round(L.appealVote(S, 0, c));
    notes += `<p class="note">魅力：あなたの陣営 ${Math.round(L.appeal(S, 0))}／${NAMES[c]} ${Math.round(L.appealOf(S, c))}。${dr > 0 ? `関係度が毎月 +${dr.toFixed(1)}` : '魅力の差が10未満なので関係度の自然な伸びはなし'}・住民投票の賛成 ${dv >= 0 ? '+' : '−'}${Math.abs(dv)}</p>`;
    const av = L.advVote(S, 0, c);
    if (av) notes += `<p class="note" style="color:var(--good)">偉人の助言で、住民投票の賛成 +${av}</p>`;
  }
  if (!mine && !L.adjacentTo(S, ADJ, c, 0)) notes += `<p class="note">あなたの陣営と隣り合っていないため、外交はまだできません。</p>`;
  const t = x.talk;
  const third = !t ? 'talk' : (t.rival !== undefined ? (L.inTalk(t, 0) ? 'raise' : 'talk') : (t.f !== 0 ? 'counter' : 'talk'));
  const attacked = mine && t && !L.inTalk(t, 0);
  const cmds = mine ? (attacked ? ['keep', 'care', 'ind', 'tour', 'dis', 'invite'] : ['ind', 'tour', 'care', 'dis', 'invite']) : ['visit', 'pact', third];
  if (mine && S.lure && L.lureSite(S, ADJ, 0) === c) cmds.unshift('lure');
  // 首長選挙：関わっていれば演説会。ほかの陣営の市町村は、選挙の時期なら候補を立てられる（協定の代わりに出す）
  if (race && (race.ch === 0 || race.inc === 0)) cmds.unshift('rally');
  else if (!mine && x.owner >= 0 && eLeft < L.ELECT_WINDOW) cmds.splice(cmds.indexOf('pact'), 1, 'run');
  if (S.budget === undefined) S.budget = 1;
  const EFF = { ind: '産業力', tour: '観光力', care: '満足度', dis: '防災力', visit: '関係度' };
  const btns = cmds.map(k => {
    const sc = L.SCALABLE.includes(k) ? S.budget : undefined;
    const def = L.CMDS[k], r = L.canDo(S, ADJ, 0, k, c, S.ap, sc), cost = L.cmdCost(S, k, c, sc, 0);
    const e = L.cmdEffect(S, 0, k, sc);
    // 産業力・観光力は陣営の魅力にも効くので、上がり幅を添える
    const ga = (k === 'ind' || k === 'tour') ? Math.min(e, 100 - x[k]) / 2 * x.pop / (L.totalPop(S, 0) || 1) : 0;
    const note = EFF[k] ? `${EFF[k]} +${e}${ga >= 0.05 ? `・陣営の魅力 +${ga.toFixed(1)}` : ''}`
      : k === 'run' ? `当選すれば自陣営に。得票の見込み ${Math.round(L.electExpect(S, 0, c))}％（${L.dateOf(x.elect).label}末に開票）`
      : k === 'rally' ? `得票 +${L.RALLY_STEP}（${race.rally[0]}/${L.RALLY_MAX}回）・いまの見込み ${Math.round(L.electMine(S, c))}％`
      : k === 'lure' ? lureNote()
      : k === 'invite' ? `成功率 ${Math.round(L.inviteChance(S, c) * 100)}％・成功で産業力 +12・人口増${x.inviteLead ? '（前回のつながりで上乗せ）' : ''}` : def.note;
    return `<button class="cmd${['talk', 'counter', 'raise', 'keep', 'lure', 'run', 'rally'].includes(k) ? ' primary' : ''}${k === 'lure' ? ' wide' : ''}" data-cmd="${k}" aria-disabled="${!r.ok}">
      <span class="ttl"><strong>${def.label}</strong><span class="cost num">${cost ? cost + '億・' : ''}行動${def.ap}</span></span><small>${r.ok ? note : r.reason}</small></button>`;
  }).join('');
  // 一行に収まる要点だけ。他陣営・独立なら関係度、自陣営なら満足度を先に出す
  const line = (mine ? `満足度 ${Math.round(x.sat)} · 魅力 ${Math.round(L.appealOf(S, c))} · 収入 ${L.incomeOf(S, c, month).toFixed(1)}億円`
    : `満足度 ${Math.round(x.sat)} · 人口 ${x.pop.toFixed(0)}千人`) + (alert ? ` <b class="alert">${alert}</b>` : '');
  sheetFrame(`${TI.icon(c)}<h2>${rb(c)}</h2>${ownerTag}<span class="tag">${info[0]}</span>`, line,
    `${mine ? '' : relGauge(c)}${cmds.some(k => L.SCALABLE.includes(k)) ? budgetHtml() : ''}<div class="cmds">${btns}</div>`,
    `<div class="meters">${meter('産業力', x.ind, '', 'ind')}${meter('観光力', x.tour, '', 'tour')}${meter('満足度', x.sat, '', 'sat')}${meter('防災力', x.dis, '', 'dis')}</div>
    <p class="facts num">人口 ${x.pop.toFixed(1)}千人 · 収入 ${L.incomeOf(S, c, month).toFixed(1)}億円/月</p>${notes}`);
  for (const b of sh.querySelectorAll('.cmd')) b.onclick = () => runCmd(b.dataset.cmd);
  for (const b of sh.querySelectorAll('[data-scale]')) b.onclick = () => { S.budget = Number(b.dataset.scale); save(); renderSheet(); };
  bindLure(sh);
}
// ---------- 誘致合戦 ----------
const facName = k => k === 0 ? 'あなたの陣営' : S.factions[k].name;
const firmGain = o => `税収 毎月+${o.inc}億円・産業力 +${o.ind}・人口 +${(o.pop * 100).toFixed(1)}％`;
// 点数の表：立地点＋補助金（1段6点）。win を渡すと決まった陣営に印を付ける
function lureList(rows, win) {
  return `<ul class="lrows">${rows.map(r => `<li class="${r.f === 0 ? 'me' : ''}${win !== undefined && r.f === win ? ' win' : ''}"><i class="dot" style="background:${colorVar(r.f)}"></i><span class="who">${facName(r.f)}<small>${NAMES[r.site]}・立地${r.pt}＋補助金${r.n}段</small></span><b class="num">${r.pt + r.n * L.LURE_PT}点</b></li>`).join('')}</ul>`;
}
// 候補地のボタンの説明：何の争いで、いま何位か、補助金を出すとどうなるか
function lureNote() {
  const lu = S.lure, rows = L.lureRows(S, ADJ), i = rows.findIndex(r => r.f === 0);
  if (i < 0) return '';
  const me = rows[i], other = rows[i === 0 ? 1 : 0];
  const gap = other ? (i === 0 ? `2位と${me.total - other.total}点差` : `1位まで${other.total - me.total}点`) : '';
  return `${lu.name}の進出先を${rows.length}陣営で争い中。いま${i + 1}位${gap ? `（${gap}）` : ''}・あと${lu.left}か月。補助金1段で+${L.LURE_PT}点（${me.n}/${L.LURE_MAX}段）・負けたら全額戻る`;
}
// 台帳に出す誘致合戦のカード。here は今見ている市町村（自分の候補地なら下のボタンを案内する）
function lureHtml(here) {
  const lu = S.lure;
  if (!lu) return '';
  const mySite = L.lureSite(S, ADJ, 0);
  const act = !mySite ? `<span class="why">${lu.region}圏域とその隣に自陣営の市町村がないので参加できません</span>`
    : here === mySite ? `<span class="why">あなたの候補地です。上の「誘致合戦に補助金」で1段${L.cmdCost(S, 'lure', mySite, undefined, 0)}億円・+${L.LURE_PT}点。負けたら全額戻ります</span>`
    : `<button class="linkbtn" data-lure-site="${mySite}">候補地の${NAMES[mySite]}で補助金を出す</button>`;
  return `<div class="lure"><div class="top"><b class="nm">誘致合戦</b><small>${lu.region}圏域・${lu.name}</small><span class="left num">あと${lu.left}か月</span></div>
    <span class="fx">選ばれると：${firmGain(lu)}</span>${lureList(L.lureRows(S, ADJ))}
    <span class="why">点数のいちばん高い候補地に決まります（差が小さいと入れ替わることも）</span>${act}</div>`;
}
function bindLure(root) {
  for (const b of root.querySelectorAll('[data-lure-site]')) b.onclick = () => { closeOverlay(); sel = null; select(b.dataset.lureSite); };
}
// 始まりと決着の知らせ（あなたの陣営が候補地を持つとき）
function showLure(s, onOk) {
  const start = s.phase === 'start', mine = s.rows.find(r => r.f === 0), go = onOk || next;
  let body;
  if (start) {
    body = `<p class="sub">${s.region}圏域に${s.name}の進出話が来ました。候補地を持つ陣営が補助金を出し合って奪い合います。</p>
      <div class="lure"><span class="fx">選ばれると：${firmGain(s)}</span>${lureList(s.rows)}</div>
      <p class="note">${mine ? `あなたの候補地は<b>${NAMES[mine.site]}</b>。候補地の「誘致合戦に補助金」で1段${s.stepAmt}億円・+${L.LURE_PT}点（行動1）。負けたら補助金は戻ります。` : ''}${L.LURE_MONTHS}か月目の月末に、点数のいちばん高い候補地に決まります。産業力を上げると立地点も上がります。</p>`;
  } else {
    const won = s.f === 0;
    body = `<p class="sub">${s.region}圏域・${s.name}の進出先</p>
      <div class="lure">${lureList(s.rows, s.f)}</div>
      <p style="margin:14px 0 0;font-weight:700;color:${won ? 'var(--good)' : 'var(--bad)'}">${won ? `${NAMES[s.code]}に${s.name}が立地します。${firmGain(s)}` : `${facName(s.f)}の${NAMES[s.code]}に決まりました。${mine && mine.paid ? `補助金${mine.paid}億円は戻りました。` : ''}`}</p>`;
  }
  openOverlay(`${art('img/event/firm.webp', 'art-top art-band')}<h3>${start ? '誘致合戦' : '誘致合戦 決着'}</h3>${body}
    <div class="row">${start && mine ? `<button class="btn main" id="lureGo">候補地を見る</button>` : ''}<button class="btn${start && mine ? '' : ' main'}" id="okBtn">次へ</button></div>`);
  $('okBtn').onclick = go;
  // 候補地を選んでおき、残りの知らせのあとに台帳で見られるようにする
  if ($('lureGo')) $('lureGo').onclick = () => { sel = mine.site; detailOpen = false; go(); if (!replay) render(); };
}
function goalTag() {
  if (S.mode !== 'region') return '';
  const g = L.goalOf(S);
  return `<span class="tag goal">目標 ${g.label} ${g.codes.filter(c => S.m[c].owner === 0).length}/${g.codes.length}</span>`;
}
// 選んだ市町村が台帳に隠れないように地図をずらす
function ensureVisible(c) {
  const r = rect(), shH = $('sheet').offsetHeight;
  const visH = vb.h * Math.max(0.2, (r.height - shH) / r.height);
  const b = pathEls[c].getBBox(), cy = b.y + b.height / 2, cx = b.x + b.width / 2;
  const top = vb.y + vb.h * 0.12, bottom = vb.y + visH - vb.h * 0.04;
  let dy = 0, dx = 0;
  if (cy > bottom) dy = cy - (vb.y + visH * 0.55);
  if (cy < top) dy = cy - (vb.y + visH * 0.45);
  if (cx < vb.x || cx > vb.x + vb.w) dx = cx - (vb.x + vb.w / 2);
  if (dx || dy) animateTo({ x: vb.x + dx, y: vb.y + dy, w: vb.w, h: vb.h });
}
function render() { renderStatus(); paintMap(); renderSheet(); }

// 地図をタップするたびに詳細はたたむ。海や県の外をタップしたら選択も外す
function select(c) { sel = c && sel !== c ? c : null; detailOpen = false; paintMap(); renderSheet(); if (sel) requestAnimationFrame(() => ensureVisible(sel)); }

let toastTimer = null;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

function budgetHtml() {
  const cur = L.SCALES[S.budget];
  return `<div class="budget"><span class="lbl">予算<small class="num">費用×${cur.cost}・効果×${cur.eff}</small></span><div class="seg" role="group" aria-label="予算規模">${L.SCALES.map((x, i) => `<button data-scale="${i}" aria-pressed="${S.budget === i}">${x.label}</button>`).join('')}</div></div>`;
}
function runCmd(k) {
  if (!S || S.over) return;
  const sc = L.SCALABLE.includes(k) ? S.budget : undefined;
  const r = L.canDo(S, ADJ, 0, k, sel, S.ap, sc);
  if (!r.ok) { toast(r.reason); return; }
  const c = sel, before = { ...statsOf(c), pop: S.m[c].pop }, chance = k === 'invite' ? L.inviteChance(S, c) : 0;
  const text = L.doCmd(S, NAMES, 0, k, c, sc);
  S.ap -= L.CMDS[k].ap;
  S.log.push({ t: S.turn, text, kind: 'good' }); seenLog = S.log.length;
  if (k === 'invite') { render(); save(); showInvite(c, before, chance); return; }
  toast(text); render(); save();
  showGain(c, before);
}
// 企業誘致：すぐに結果を出さず、打診している間を見せてから判を押す。不調でも残るものを伝える
function showInvite(c, before, chance) {
  const x = S.m[c], ok = !x.inviteLead, still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pop = x.pop - before.pop;
  const res = ok
    ? `<p class="inv-lead" style="color:var(--good)">進出が決まりました。</p><p class="sub">産業力 +${Math.round(x.ind - before.ind)}・人口 +${pop.toFixed(1)}千人</p>`
    : `<p class="inv-lead" style="color:var(--bad)">今回は見送られました。</p><p class="sub">それでも企業とのつながりは残りました。産業力 +${Math.round(x.ind - before.ind)}、次の企業誘致は成功率が上がります（いま ${Math.round(L.inviteChance(S, c) * 100)}％）。</p>`;
  openOverlay(`${art('img/event/firm.webp', 'art-top art-band')}<h3>企業誘致</h3>
    <p class="sub">${NAMES[c]}への進出を、企業に打診しています（成功率 ${Math.round(chance * 100)}％）</p>
    <div class="ballot invite${still ? ' now' : ''}">
      <div class="inv-wait"><span>交渉中</span><div class="inv-bar"><i></i></div></div>
      <div class="inv-res">${res}</div>
      <div class="stamp ${ok ? 'pass' : ''}">${ok ? '成功' : '不調'}</div>
    </div>
    <div class="row"><button class="btn main" id="okBtn">次へ</button></div>`);
  $('okBtn').onclick = () => { closeOverlay(); showGain(c, before); };
}

// ---------- 月を終える ----------
let queue = [], inBattle = false;
function endMonth() {
  if (!S || S.over) return;
  if (!$('overlay').hidden) return;
  if (replay || inBattle) return;
  // 見込み30〜70％の住民投票は、月を終える前に決戦で決める
  const due = prefs.battle === false ? [] : L.battlesDue(S);
  if (due.length) { runBattles(due); return; }
  finishMonth();
}
function runBattles(list) {
  const c = list.shift();
  if (!c) { inBattle = false; finishMonth(); return; }
  inBattle = true;
  Battle.start(battleOpts(c), r => { if (r) { L.setBattle(S, c, r); save(); } runBattles(list); });
}
// 決戦に渡すもの：市町村の形、いまの見込み、自陣営のある向き、技になる人材と偉人
function battleOpts(c) {
  const m = BYCODE[c], race = L.raceDue(S, c) ? S.m[c].race : null, defend = !!race && race.inc === 0;
  // 味方の地区は自陣営の側に置く。現職で守るときは、相手陣営の反対側
  const other = race ? (defend ? race.ch : race.inc) : null;
  const toward = defend && ADJ[c].some(k => S.m[k].owner === other) ? ADJ[c].filter(k => S.m[k].owner === other) : ADJ[c].filter(k => S.m[k].owner === 0);
  const mine = toward.map(k => BYCODE[k]), sign = defend && toward.some(k => S.m[k].owner === other) ? -1 : 1;
  let dx = 0, dy = 0;
  for (const k of mine) { dx += (k.lx - m.lx) * sign; dy += (k.ly - m.ly) * sign; }
  const len = Math.hypot(dx, dy) || 1;
  // 人材は役職に就いている人を先に3人まで。いちばん高い能力で技が決まる
  const staff = L.staffOf(S, 0).slice().sort((a, b) => (b.role ? 1 : 0) - (a.role ? 1 : 0)).map(p => {
    const best = Object.keys(L.ABIL).reduce((a, b) => (L.abil(S, 0, p, b) > L.abil(S, 0, p, a) ? b : a));
    return { name: p.name, best, val: L.abil(S, 0, p, best) };
  });
  const a = L.advOf(S, 0).map(x => L.ADV_BY_ID[x.id]).find(x => x);
  return {
    code: c, name: NAMES[c], d: m.d, lx: m.lx, ly: m.ly, pop: S.m[c].pop, expect: L.battleExpect(S, c),
    dir: { x: dx / len, y: dy / len }, mine: NAMES[S.factions[0].capital], mineFac: S.factions[0].name,
    nameHtml: rb(c), mineHtml: rb(S.factions[0].capital),
    staff, adv: a ? { name: a.name, say: a.say } : null,
    ...(race ? { kind: 'elect', defend, rival: S.factions[other].name } : {})
  };
}
function finishMonth() {
  detailOpen = false;
  const before = {}; for (const c in S.m) before[c] = S.m[c].owner;
  const res = L.endTurn(S, ADJ, NAMES);
  const d = L.dateOf(S.turn);
  save();
  const summary = [`${d.label}　収支 ${res.income >= 0 ? '+' : ''}${res.income}億円`, ...res.news].join('　');
  // 季節の行事があれば、先に挿絵つきで知らせる（月初の出来事のため）
  const fest = prefs.season !== false && seasonOf(S.turn);
  if (fest) { renderStatus(); showSeason(fest, () => { closeOverlay(); afterMonth(res, before, summary); }); }
  else afterMonth(res, before, summary);
}
function afterMonth(res, before, summary) {
  const steps = mergeSteps(res.steps);
  if (prefs.replay && steps.length) {
    sel = null; render();
    startReplay(steps, before, () => { toast(summary); queue = S.over ? [() => showOver()] : []; next(); });
  } else {
    render(); toast(summary);
    // 決戦で決めた住民投票は、決戦の開票で見せたので出さない
    queue = [...res.votes.filter(v => !v.battle).map(v => () => showVote(v, next)), ...res.elects.filter(v => !v.battle).map(v => () => showElect(v, next)), ...res.lures.map(s => () => showLure(s, next)), ...res.joins.map(s => () => showJoin(s, next))];
    if (S.over) queue.push(() => showOver());
    next();
  }
}

// ---------- 相手の動きを地図で見せる ----------
let replay = null, replayTimer = null;
const prefs = (() => { try { return JSON.parse(localStorage.getItem(SAVE_KEY + '-prefs')) || { replay: true }; } catch (e) { return { replay: true }; } })();
function savePrefs() { try { localStorage.setItem(SAVE_KEY + '-prefs', JSON.stringify(prefs)); } catch (e) {} }
function mergeSteps(steps) {
  const out = [];
  for (const s of steps) {
    const p = out[out.length - 1];
    if (p && s.kind === 'rival' && p.kind === 'rival' && p.f === s.f && p.code === s.code && p.cmd === s.cmd) { p.text = s.text; p.times = (p.times || 1) + 1; }
    else out.push({ ...s });
  }
  return out;
}
function stepCaption(s) {
  const n = NAMES[s.code];
  if (s.kind === 'contest') {
    const nm = k => k === 0 ? 'あなたの陣営' : S.factions[k].name;
    return { who: `条件の競り合い・${n}`, what: `${nm(s.winner)}の条件が選ばれました（上乗せ ${s.bids[s.winner]}段 対 ${s.bids[s.loser]}段）`, color: colorVar(s.winner), warn: s.loser === 0 };
  }
  if (s.kind === 'join') return { who: `合流・${s.gname}`, what: `${facName(s.f)}に合流（${s.towns.map(c => NAMES[c]).join('・')}）`, color: colorVar(s.f), warn: false };
  if (s.kind === 'lure') {
    if (s.phase === 'start') return { who: `誘致合戦・${s.region}圏域`, what: `${s.name}の進出先を${s.rows.length}陣営が争う（${L.LURE_MONTHS}か月）`, color: 'var(--warn)', warn: false };
    return { who: `誘致合戦・${n}`, what: `${s.name}は${facName(s.f)}に決定（補助金${s.rows.find(r => r.f === s.f).n}段）`, color: colorVar(s.f), warn: s.mine && s.f !== 0 };
  }
  if (s.kind === 'event') return { who: '出来事', what: s.text, color: s.tone === 'bad' ? 'var(--bad)' : 'var(--good)', warn: false };
  if (s.kind === 'elect') {
    const pct = Math.round((s.pass ? s.yes : s.no) / Math.max(1, s.yes + s.no) * 100);
    return { who: `首長選挙・${n}`, what: s.pass ? `${facName(s.ch)}の候補が当選（得票${pct}％）。${facName(s.ch)}に移る` : `現職（${facName(s.prev)}）が再選（得票${pct}％）`, color: colorVar(s.f), warn: s.prev === 0 && s.pass };
  }
  if (s.kind === 'vote') {
    const who = s.f === 0 ? 'あなたの陣営' : S.factions[s.f].name;
    const pct = Math.round(s.yes / Math.max(1, s.yes + s.no) * 100);
    return { who: `住民投票・${n}`, what: s.pass ? `${who}への編入を可決（賛成${pct}％）` : `${who}との合併を否決（賛成${pct}％）`, color: colorVar(s.f), warn: s.prev === 0 && s.pass };
  }
  const fac = S.factions[s.f];
  let what = s.text.replace(fac.name + 'が', '');
  if (s.times > 1) what = what.replace(/（/, `（${s.times}回・`);
  if (s.mine) what = 'あなたの' + what;
  return { who: fac.name, what, color: colorVar(s.f), warn: (s.mine && (s.cmd === 'talk' || s.cmd === 'visit')) || s.vsMe };
}
function startReplay(steps, before, done) {
  replay = { steps, i: 0, owners: before, done, home: { ...vb }, focus: null };
  $('chips').hidden = true; $('replay').hidden = false; $('endBtn').disabled = true;
  playStep();
}
function playStep() {
  clearTimeout(replayTimer);
  if (!replay) return;
  if (replay.i >= replay.steps.length) { endReplay(); return; }
  const s = replay.steps[replay.i];
  const cap = stepCaption(s);
  const box = $('replay');
  box.style.setProperty('--rp', cap.color); box.classList.toggle('warn', cap.warn);
  $('rpWho').textContent = cap.who; $('rpWhat').textContent = cap.what;
  $('rpCount').textContent = `${replay.i + 1}/${replay.steps.length}`;
  replay.focus = s.code;
  // 対象の市町村と、動いた陣営の隣り合う領地が入るように寄る
  const ctx = [s.code, ...ADJ[s.code].filter(c => s.f !== undefined && replay.owners[c] === s.f)].slice(0, 4);
  const b = bboxOf(ctx); const r = rect();
  const minW = MAP.w * 0.42;
  animateTo(fitBox({ x: b.x + b.w / 2 - Math.max(b.w, minW) / 2, y: b.y + b.h / 2 - Math.max(b.h, minW * r.height / r.width) / 2, w: Math.max(b.w, minW), h: Math.max(b.h, minW * r.height / r.width) }, 30));
  const pg = $('pulse'); pg.textContent = '';
  const p = document.createElementNS(NS, 'path'); p.setAttribute('d', BYCODE[s.code].d); p.setAttribute('class', 'pulse');
  p.style.fill = cap.color; p.style.stroke = cap.color; pg.appendChild(p);
  if ((s.kind === 'vote' || s.kind === 'elect') && s.pass) setTimeout(() => { if (replay) { replay.owners[s.code] = s.f; paintMap(); } }, 500);
  if (s.kind === 'join') setTimeout(() => { if (replay) { for (const c of s.towns) replay.owners[c] = s.f; paintMap(); } }, 500);
  paintMap();
  const mineVote = s.kind === 'vote' && !s.battle && (s.f === 0 || s.prev === 0 || (s.contest && s.contest.loser === 0));
  const mineElect = s.kind === 'elect' && !s.battle && (s.ch === 0 || s.prev === 0);
  if (mineVote) replayTimer = setTimeout(() => showVote(s, () => { closeOverlay(); advance(); }), 900);
  else if (mineElect) replayTimer = setTimeout(() => showElect(s, () => { closeOverlay(); advance(); }), 900);
  else if (s.kind === 'lure' && s.mine) replayTimer = setTimeout(() => showLure(s, () => { closeOverlay(); advance(); }), 900);
  else if (s.kind === 'join' && s.mine) replayTimer = setTimeout(() => showJoin(s, () => { closeOverlay(); advance(); }), 900);
  else replayTimer = setTimeout(advance, s.kind === 'rival' && ['visit', 'pact', 'talk'].includes(s.cmd) || s.kind !== 'rival' ? 1700 : 1100);
}
function advance() { if (!replay) return; replay.i++; playStep(); }
function endReplay() {
  clearTimeout(replayTimer);
  if (!replay) return;
  const { done, home } = replay;
  // 飛ばした分の自分に関わる住民投票は、結果だけ順に見せる
  const rest = replay.steps.slice(replay.i + 1).filter(s => (s.kind === 'vote' && !s.battle && (s.f === 0 || s.prev === 0)) || (s.kind === 'elect' && !s.battle && (s.ch === 0 || s.prev === 0)) || ((s.kind === 'lure' || s.kind === 'join') && s.mine));
  replay = null;
  $('pulse').textContent = ''; $('replay').hidden = true; $('chips').hidden = false; $('endBtn').disabled = false;
  animateTo(home); render();
  if (rest.length) { queue = rest.map(v => () => v.kind === 'lure' ? showLure(v, next) : v.kind === 'join' ? showJoin(v, next) : v.kind === 'elect' ? showElect(v, next) : showVote(v, next)); queue.push(done); next(); }
  else done();
}
$('replay').addEventListener('click', e => { if (e.target.id === 'rpSkip') return; advance(); });
$('rpSkip').onclick = () => { if (replay) { if (!$('overlay').hidden) return; endReplay(); } };
function next() { closeOverlay(); const f = queue.shift(); if (f) f(); }

// ---------- イラスト ----------
// 画像は docs/images.md の依頼で後から届く。読み込めたものだけ出し、ないものは何も出さない（今の見た目のまま）
const artSeen = {};
function art(src, cls) {
  if (artSeen[src] === false) return '';
  return `<img class="art ${cls}${artSeen[src] ? ' ok' : ''}" src="${src}" alt="" onload="artLoaded(this, true)" onerror="artLoaded(this, false)">`;
}
function artLoaded(img, ok) { artSeen[img.getAttribute('src')] = ok; if (ok) img.classList.add('ok'); else img.remove(); }
const advPic = id => art(`img/adv/${id}.webp`, 'pic');
const facePic = p => { const k = L.faceOf(p); return k ? art(`img/staff/${k}.webp`, 'face') : ''; };
// 出来事の挿絵。ニュースでは月ごとに上ほど優先して1枚。title のある季節の行事は、月を終えたときに挿絵つきで知らせる
const EVENTS = [
  { id: 'takayama', re: /高山祭/, title: '高山祭', towns: ['21203'] },
  { id: 'ukai', re: /鵜飼が開幕/, title: '長良川鵜飼', towns: ['21201', '21205'] },
  { id: 'gujo', re: /郡上おどり/, title: '郡上おどり', towns: ['21219'] },
  { id: 'seki', re: /関ケ原の戦いの月/, title: '関ケ原の戦いの月', towns: ['21362'] },
  { id: 'elect', re: /首長選挙/ }, { id: 'rain', re: /豪雨/ }, { id: 'snow', re: /豪雪/ }, { id: 'firm', re: /企業が進出|誘致合戦/ }
];
function eventArt(list) { const ev = EVENTS.find(x => list.some(e => x.re.test(e.text))); return ev ? art(`img/event/${ev.id}.webp`, 'art-news') : ''; }

function openOverlay(html, cls) {
  const p = $('panel'); p.className = 'panel' + (cls ? ' ' + cls : ''); p.innerHTML = html; $('overlay').hidden = false;
  p.scrollTop = 0;
  if (!cls) { const first = p.querySelector('#okBtn, #againBtn, #xBtn'); if (first) first.focus({ preventScroll: true }); }
}
function closeOverlay() { $('overlay').hidden = true; }

// その月の季節の行事（ログから拾う）
function seasonOf(t) {
  const list = S.log.filter(e => e.t === t);
  for (const ev of EVENTS) {
    const e = ev.title && list.find(x => ev.re.test(x.text));
    if (e) return { ev, text: e.text };
  }
  return null;
}
function showSeason(s, onOk) {
  const d = L.dateOf(S.turn), ev = s.ev;
  const title = ev.id === 'takayama' ? `${ev.title}（${d.month === 4 ? '春' : '秋'}）` : ev.title;
  const own = ev.towns.map(c => `${NAMES[c]}は${S.m[c].owner === 0 ? '<b style="color:var(--me)">あなたの陣営</b>' : ownerName(c)}`).join('・');
  openOverlay(`${art(`img/event/${ev.id}.webp`, 'art-top art-band')}<div class="kicker">${d.label}・季節の便り</div><h3>${title}</h3>
    <p style="font-size:15px;margin:6px 0 4px">${s.text}</p><p class="sub">${own}</p>
    <div class="row"><button class="btn main" id="okBtn">次へ</button></div>`);
  $('okBtn').onclick = onOk || next;
}
function showVote(v, onOk) {
  const mineWin = v.f === 0, total = v.yes + v.no, yp = total ? v.yes / total * 100 : 50;
  const who = v.f === 0 ? 'あなたの陣営' : S.factions[v.f].name;
  const good = (mineWin && v.pass) || (!mineWin && !v.pass);
  const lostContest = v.contest && v.contest.loser === 0;
  let lead = mineWin
    ? (v.pass ? `${NAMES[v.code]}があなたの陣営に加わりました。` : `今回は見送りです。2か月後から再び申し入れできます。`)
    : (v.pass ? `${NAMES[v.code]}は${who}へ編入されました。` : (lostContest ? `${NAMES[v.code]}の住民は${who}との合併も否決しました。` : `${NAMES[v.code]}の住民はあなたの陣営に残ることを選びました。`));
  const c = v.contest;
  const joinLine = v.joined && v.joined.length ? `<p class="sub">${NAMES[v.code]}ゆかりの人材：${v.joined.join('・')}が${v.f === 0 ? 'あなたの陣営' : S.factions[v.f].name}に加わりました</p>` : '';
  const keepLine = joinLine + (v.keep ? `<p class="sub">引き留め ${v.keep}段で、賛成を${v.keep * L.KEEP_STEP}ポイント押し下げました</p>` : '');
  const contestLine = keepLine + (c ? `<p class="sub">条件の競り合いは${who}に決まりました（上乗せ ${c.bids[c.winner]}段 対 ${c.bids[c.loser]}段）</p>` : '');
  openOverlay(`${art('img/event/vote.webp', 'art-top art-band')}<h3>住民投票 開票結果</h3>
    <p class="sub">${NAMES[v.code]}　${who}との合併の是非</p>${contestLine}
    <div class="ballot">
      <div class="vs"><div><small>賛成</small><b class="num">${v.yes.toLocaleString()}票</b></div><div style="text-align:right;margin-right:110px"><small>反対</small><b class="num">${v.no.toLocaleString()}票</b></div></div>
      <div class="split" style="margin-right:110px"><i class="yes" style="width:${yp}%"></i><i class="no" style="width:${100 - yp}%"></i></div>
      <small class="num">投票率 ${(v.turnout * 100).toFixed(1)}％</small>
      <div class="stamp ${v.pass ? 'pass' : ''}">${v.pass ? '可決' : '否決'}</div>
    </div>
    <p style="margin:14px 0 0;font-weight:700;color:${good ? 'var(--good)' : 'var(--bad)'}">${lead}</p>
    <div class="row"><button class="btn main" id="okBtn">次へ</button></div>`);
  $('okBtn').onclick = onOk || next;
}
// 小さくなったライバルが、あなたの陣営に合流してきたとき
function showJoin(s, onOk) {
  openOverlay(`<h3>合流</h3>
    <p class="sub">${s.gname}が、あなたの陣営への合流を申し出ました。</p>
    <div class="lure"><span class="fx">加わる市町村：${s.towns.map(c => NAMES[c]).join('・')}</span>
      <span class="why">財源 +${s.money}億円${s.joined.length ? `・人材 ${s.joined.join('・')}` : ''}</span></div>
    <p class="note">合流した市町村は、しばらく満足度が${L.JOIN_SAT}下がります。人材は役職なしで加わるので、人材の画面で役職に就けてください。</p>
    <div class="row"><button class="btn main" id="okBtn">次へ</button></div>`);
  $('okBtn').onclick = onOk || next;
}
// 首長選挙の開票結果（あなたの陣営が候補を立てたか、現職で守った選挙）
function showElect(v, onOk) {
  const mineCh = v.ch === 0, other = mineCh ? v.prev : v.ch, rival = facName(other), total = v.yes + v.no;
  const my = mineCh ? v.yes : v.no, their = mineCh ? v.no : v.yes, mp = total ? my / total * 100 : 50;
  const won = mineCh === v.pass, n = NAMES[v.code];
  const lead = mineCh ? (v.pass ? `${n}はあなたの陣営に移りました。` : 'あなたの陣営の候補は落選しました。関係度が下がりました。') : (v.pass ? `${n}は${rival}に移りました。` : `現職が再選し、${n}を守りました。`);
  const joinLine = v.joined && v.joined.length ? `<p class="sub">${n}ゆかりの人材：${v.joined.join('・')}が${facName(v.ch)}に加わりました</p>` : '';
  openOverlay(`${art('img/event/elect.webp', 'art-top art-band')}<h3>首長選挙 開票結果</h3>
    <p class="sub">${n}　あなたの陣営の${mineCh ? '候補' : '現職'} 対 ${rival}の${mineCh ? '現職' : '候補'}</p>${joinLine}
    <div class="ballot">
      <div class="vs"><div><small>あなたの陣営</small><b class="num">${my.toLocaleString()}票</b></div><div style="text-align:right;margin-right:110px"><small>${rival}</small><b class="num">${their.toLocaleString()}票</b></div></div>
      <div class="split" style="margin-right:110px"><i class="yes" style="width:${mp}%"></i><i class="no" style="width:${100 - mp}%"></i></div>
      <small class="num">投票率 ${(v.turnout * 100).toFixed(1)}％・演説会 あなた${v.rally[0] || 0}回／相手${v.rally[other] || 0}回</small>
      <div class="stamp ${won ? 'pass' : ''}">${won ? (mineCh ? '当選' : '再選') : '落選'}</div>
    </div>
    <p style="margin:14px 0 0;font-weight:700;color:${won ? 'var(--good)' : 'var(--bad)'}">${lead}</p>
    <div class="row"><button class="btn main" id="okBtn">次へ</button></div>`);
  $('okBtn').onclick = onOk || next;
}
function showOver() {
  const o = S.over, n = L.owned(S, 0).length;
  const title = !o.win ? '任期終了' : (o.region ? '圏域制覇' : '県内統一');
  const goOn = o.win && !!o.region;
  openOverlay(`${art(`img/end/${!o.win ? 'term' : o.region ? 'region' : 'unify'}.webp`, 'art-top art-end')}<h3>${title}</h3><p class="sub">${L.dateOf(S.turn).label}</p>
    <p style="font-size:15px">${o.text}</p><p class="sub">最終的な支配：${n}/42市町村、人口${L.totalPop(S, 0).toFixed(1)}千人</p>
    ${goOn ? '<p class="sub">このまま続けて、県内42市町村の統一を目指すこともできます。</p>' : ''}
    <div class="row">${goOn ? '<button class="btn main" id="goOnBtn">県内統一を目指して続ける</button>' : ''}<button class="btn${goOn ? '' : ' main'}" id="againBtn">新しく始める</button><button class="btn" id="viewBtn">地図を見る</button></div>`);
  if (goOn) $('goOnBtn').onclick = () => { L.continueToUnify(S); save(); closeOverlay(); render(); toast('県内42市町村の統一を目指します'); };
  $('againBtn').onclick = () => { clearSave(); showTitle(); };
  $('viewBtn').onclick = closeOverlay;
}

function roleEffect(r, v) {
  if (!v) return '';
  switch (r) {
    case 'deputy': return `税収 +${Math.round(v / 5)}％`;
    case 'planning': return `内政の効果 +${Math.floor(v / 25)}`;
    case 'nego': return `交流 +${Math.floor(v / 15)}・賛成 +${Math.round(v / 12)}`;
    case 'tourism': return `観光収入 +${Math.round(v / 2.5)}％`;
  }
  return '';
}
function abilHtml(p) {
  const keys = Object.keys(L.ABIL), best = keys.reduce((a, b) => p[b] > p[a] ? b : a);
  return `<div class="abil">${keys.map(k => `<span class="${k === best ? 'best' : ''}">${L.ABIL[k]}<b class="num">${L.abil(S, 0, p, k)}</b></span>`).join('')}</div>`;
}
// 新しく迎えた人を、空いている役職のうち一番得意なものに就ける
function fillEmpty(p) {
  const taken = new Set(L.staffOf(S, 0).filter(q => q.role).map(q => q.role));
  const free = Object.keys(L.ROLES).filter(r => !taken.has(r));
  if (!free.length) return '';
  const r = free.sort((a, b) => L.abil(S, 0, p, L.ROLES[b].key) - L.abil(S, 0, p, L.ROLES[a].key))[0];
  L.assignRole(S, 0, p.id, r);
  return `（${L.ROLES[r].label}に就任）`;
}
// ---------- 偉人アドバイザー ----------
// left があれば助言中。withTip で、いまの状況に合わせたひとことを添える
function advCard(id, left, withTip) {
  const a = L.ADV_BY_ID[id];
  const tip = withTip ? `<span class="tip">${L.advise(S, ADJ, NAMES, 0, id)}</span>` : '';
  return `<div class="adv">${advPic(id)}<div class="top"><b class="nm">${a.name}</b><small>${a.title}・${NAMES[a.home]}ゆかり</small>${left ? `<span class="left num">あと${left}か月</span>` : ''}</div>
    <span class="fx">${L.advFx(a)}</span><span class="say">「${a.say}」</span>${tip}</div>`;
}
// 助言がないとき、招ける偉人がいれば知らせる
function advHint() {
  const can = L.ADVISORS.filter(a => L.canInviteAdv(S, 0, a.id, S.ap).ok);
  if (!can.length) return '';
  return `<p class="note">${can.map(a => a.name).join('・')}を偉人アドバイザーに招けます。<button class="linkbtn" data-open-staff>人材の画面へ</button></p>`;
}
// 招く条件：ゆかりの地と、偉人ごとの条件。満たしたものに印を付ける
function condHtml(a, home) {
  if (a.seki) return `<ul class="conds"><li class="${home ? 'ok' : ''}">${NAMES[a.home]}を持って9月を迎える</li></ul>`;
  const c = L.advCond(S, 0, a.id);
  return `<ul class="conds"><li class="${home ? 'ok' : ''}">${NAMES[a.home]}を自陣営にする</li><li class="${c.ok ? 'ok' : ''}">${c.text}${c.ok ? '' : `<span class="num">（${c.now}/${c.need}）</span>`}</li></ul>`;
}
function advSection() {
  const act = L.advOf(S, 0), max = L.advMax(S, 0);
  const active = act.length ? act.map(a => advCard(a.id, a.left, true)).join('') : '<p class="empty">いま助言している偉人はいません。</p>';
  const rest = L.ADVISORS.filter(a => !act.some(x => x.id === a.id)).map(a => ({ a, r: L.canInviteAdv(S, 0, a.id, S.ap) }));
  rest.sort((p, q) => q.r.ok - p.r.ok || (S.m[q.a.home].owner === 0) - (S.m[p.a.home].owner === 0) || !!p.a.seki - !!q.a.seki);
  const card = ({ a, r }) => {
    const home = S.m[a.home].owner === 0;
    const why = r.ok || r.cond || r.reason === 'ゆかりの地を自陣営にすると招けます' ? '' : r.reason;
    return `<div class="adv${r.ok ? '' : ' locked'}">${advPic(a.id)}<div class="top"><b class="nm">${a.name}</b><small>${a.title}・${NAMES[a.home]}ゆかり</small></div>
      <span class="fx">${L.advFx(a)}</span>${condHtml(a, home)}
      ${r.ok ? `<button class="btn main hirebtn" data-adv="${a.id}">招く（${a.cost}億円・行動1）</button>` : why ? `<span class="why">${why}</span>` : ''}</div>`;
  };
  // 招ける偉人と、条件のどちらかを満たしている偉人は表に、ほかはたたんでおく
  const near = rest.filter(x => x.r.ok || S.m[x.a.home].owner === 0 || (x.a.cond && L.advCond(S, 0, x.a.id).ok)), far = rest.filter(x => !near.includes(x));
  const list = near.map(card).join('') + (far.length ? `<details class="advmore"><summary>ほかの偉人（${far.length}人）</summary><div class="advs">${far.map(card).join('')}</div></details>` : '');
  return `<div class="h4" id="advHead">偉人アドバイザー（${L.advUsed(S, 0)}/${max}人）</div>
    <p class="sub" style="margin-top:-2px">岐阜ゆかりの歴史人物が${L.ADV_MONTHS}か月だけ助言し、効果をくれます。ゆかりの地を自陣営に持ち、偉人ごとの条件を一度でも満たすと招けます。ゆかりの地を失うと去ります。去ったあと${L.ADV_COOL}か月は招けません。市町村が${L.ADV_SLOT2}つ以上で2人まで。毎年9月には関ケ原町を持つ陣営に関ケ原ゆかりの偉人が訪れます（人数に数えません）。</p>
    <div class="advs">${active}</div>
    <div class="advs" style="margin-top:8px">${list}</div>`;
}
function gradeTag(p) { const g = L.gradeOf(p); return `<span class="grade ${g}" title="ランク${g}">${g}</span>`; }
function showStaff(focus) {
  L.ensureStaff(S); L.ensureAdv(S);
  const mine = L.staffOf(S, 0), max = L.staffMax(S, 0);
  const roles = Object.entries(L.ROLES).map(([r, def]) => {
    const p = mine.find(q => q.role === r), v = L.roleVal(S, 0, r);
    return `<div class="role"><small>${def.label}・${L.ABIL[def.key]}が効く</small><b>${p ? gradeTag(p) + ' ' + p.name : '空席'}</b><span class="eff${p ? '' : ' none'}">${p ? roleEffect(r, v) : def.what}</span></div>`;
  }).join('');
  const opts = p => `<option value="">役職なし</option>` + Object.entries(L.ROLES).map(([r, def]) => `<option value="${r}" ${p.role === r ? 'selected' : ''}>${def.label}（${L.ABIL[def.key]} ${L.abil(S, 0, p, def.key)}）</option>`).join('');
  const people = mine.map(p => `<div class="person">${facePic(p)}<div class="top">${gradeTag(p)}<b>${p.name}</b><small>${p.ext ? (p.pref || '県外') + 'から招へい' : NAMES[p.home] + '出身'}・役職の給与 月${L.GRADE_PAY[L.gradeOf(p)]}億円</small></div>${abilHtml(p)}
    <select data-role="${p.id}" aria-label="${p.name}の役職">${opts(p)}</select></div>`).join('') || '<p class="empty">まだ人材がいません。</p>';
  const cands = L.hireCandidates(S, ADJ, 0).sort((a, b) => (b.pol + b.neg + b.plan + b.pop) - (a.pol + a.neg + a.plan + a.pop));
  const hires = cands.slice(0, 8).map(p => {
    const r = L.canHire(S, ADJ, 0, p.id, S.ap);
    return `<div class="person">${facePic(p)}<div class="top">${gradeTag(p)}<b>${p.name}</b><small>${NAMES[p.home]}出身・${S.m[p.home].owner === 0 ? '自陣営' : '隣の独立市町村'}</small></div>${abilHtml(p)}
      <button class="btn hirebtn${r.ok ? ' main' : ''}" data-hire="${p.id}" aria-disabled="${!r.ok}">登用する（${L.hireCost(p)}億円・行動1）</button>${r.ok ? '' : `<span class="why">${r.reason}</span>`}</div>`;
  }).join('') || '<p class="empty">いま登用できる人材はいません。市町村を広げると見つかります。</p>';
  openOverlay(`<button class="iconbtn close" id="xBtn" aria-label="閉じる">✕</button><h3>人材</h3>
    <p class="sub">${mine.length}/${max}人。役職に就けると効果が出ます。役職の給与はランクで変わります（月 C1・B2・A3・S5億円）。${S.m['21207'].owner === 0 ? '美濃和紙の美濃市があるので、企画が+8されています。' : ''}</p>
    <div class="roles">${roles}</div>
    <div class="row" style="margin-top:10px"><button class="btn" id="autoBtn">得意な役職におまかせで配置</button></div>
    ${advSection()}
    <div class="h4">あなたの陣営の人材</div><div class="people">${people}</div>
    <div class="h4">登用できる人材</div><div class="people">${hires}</div>
    <div class="h4">県外から招へい（行動1）</div>
    <p class="sub" style="margin-top:-2px">高いランクの人材を財源で迎えます。得意な能力がどれになるかは選べません。</p>
    <div class="scouts">${['B', 'A', 'S'].map(g => { const r = L.canScout(S, 0, g, S.ap); const d = L.SCOUT[g];
      return `<button data-scout="${g}" aria-disabled="${!r.ok}"><span class="grade ${g}">${g}</span><b class="num">${d.cost}億円</b><small>得意 ${d.best[0]}〜${d.best[1]}</small><small>${r.ok ? `給与 月${L.GRADE_PAY[g]}億円` : r.reason}</small></button>`; }).join('')}</div>`);
  $('xBtn').onclick = closeOverlay;
  if (focus === 'adv') $('advHead').scrollIntoView({ block: 'start' });
  for (const b of document.querySelectorAll('[data-adv]')) b.onclick = () => {
    const id = b.dataset.adv, r = L.canInviteAdv(S, 0, id, S.ap);
    if (!r.ok) { toast(r.reason); return; }
    const text = L.inviteAdv(S, 0, id); S.ap -= 1;
    S.log.push({ t: S.turn, text, kind: 'good' }); seenLog = S.log.length;
    toast(text); save(); render(); showStaff('adv');
  };
  $('autoBtn').onclick = () => { L.autoAssign(S, 0); save(); render(); showStaff(); toast('得意な役職に配置しました'); };
  for (const sl of document.querySelectorAll('[data-role]')) sl.onchange = () => { L.assignRole(S, 0, Number(sl.dataset.role), sl.value); save(); render(); showStaff(); };
  for (const b of document.querySelectorAll('[data-scout]')) b.onclick = () => {
    const g = b.dataset.scout, r = L.canScout(S, 0, g, S.ap);
    if (!r.ok) { toast(r.reason); return; }
    const p = L.scout(S, 0, g); S.ap -= 1;
    const text = `${p.pref}から${g}ランクの${p.name}を招へい${fillEmpty(p)}`;
    S.log.push({ t: S.turn, text, kind: 'good' }); seenLog = S.log.length;
    toast(text); save(); render(); showStaff();
  };
  for (const b of document.querySelectorAll('[data-hire]')) b.onclick = () => {
    const id = Number(b.dataset.hire), r = L.canHire(S, ADJ, 0, id, S.ap);
    if (!r.ok) { toast(r.reason); return; }
    const text = L.hire(S, NAMES, 0, id) + fillEmpty(S.staff.find(q => q.id === id)); S.ap -= 1;
    S.log.push({ t: S.turn, text, kind: 'good' }); seenLog = S.log.length;
    toast(text); save(); render(); showStaff();
  };
}
function showFactions() {
  const month = L.dateOf(S.turn).month;
  const rows = S.factions.map(f => `<div class="fac${f.alive ? '' : ' dead'}"><i class="dot" style="background:${colorVar(f.id)}"></i>
    <div class="nm">${f.name}${f.alive ? '' : '（消滅）'}</div>
    <div class="facts"><span>本拠 <b>${NAMES[f.capital]}</b></span><span>市町村 <b class="num">${L.owned(S, f.id).length}</b></span>
    <span>人口 <b class="num">${L.totalPop(S, f.id).toFixed(0)}千人</b></span><span>財源 <b class="num">${f.money}億円</b></span>
    <span>平均満足度 <b class="num">${Math.round(L.avgSat(S, f.id)) || 0}</b></span><span>魅力 <b class="num">${Math.round(L.appeal(S, f.id)) || 0}</b></span><span>月収入 <b class="num">${L.factionIncome(S, f.id, month)}億円</b></span>${L.advOf(S, f.id).length ? `<span>助言 <b>${L.advOf(S, f.id).map(a => L.ADV_BY_ID[a.id].name).join('・')}</b></span>` : ''}</div></div>`).join('');
  const talks = Object.keys(S.m).filter(c => S.m[c].talk && S.m[c].talk.f === 0).map(c => `${NAMES[c]}（あと${S.m[c].talk.left}か月）`);
  const regions = L.REGIONS.map(r => { const cs = L.regionCodes(r), t = `${r} ${cs.filter(c => S.m[c].owner === 0).length}/${cs.length}`; return S.mode === 'region' && S.goal === r ? `<b>${t}（目標）</b>` : t; }).join('　');
  openOverlay(`<button class="iconbtn close" id="xBtn" aria-label="閉じる">✕</button><h3>陣営</h3>
    <p class="sub">圏域ごとの支配：${regions}</p><div class="factions">${rows}</div>
    ${S.lure ? `<div class="h4">誘致合戦</div>${lureHtml()}` : ''}
    <p class="sub" style="margin-top:14px">進行中の合併協議：${talks.length ? talks.join('、') : 'なし'}（同時に${L.talksMax(S, 0)}件まで。陣営の魅力${L.APPEAL_TALKS.join('・')}でそれぞれ1件増える）</p>`);
  $('xBtn').onclick = closeOverlay;
  bindLure($('panel'));
}
function showNews() {
  seenLog = S.log.length; renderStatus();
  const months = [];
  for (const e of [...S.log].reverse().slice(0, 120)) {
    const g = months[months.length - 1];
    if (g && g.t === e.t) g.list.push(e); else months.push({ t: e.t, list: [e] });
  }
  const html = months.map(g => `<h5>${L.dateOf(g.t).label}</h5>${eventArt(g.list)}<ul class="log">${g.list.map(e => `<li class="${e.kind}">${e.text}</li>`).join('')}</ul>`).join('');
  openOverlay(`<button class="iconbtn close" id="xBtn" aria-label="閉じる">✕</button><h3>ニュース</h3><p class="sub">新しい順。ライバルの動きは灰色で表示</p>${html}`);
  $('xBtn').onclick = closeOverlay;
}
// 版の番号（js/version.js）。反映されたかを一目で見分けるため、タイトルとメニューに出す
const buildTag = () => `<span class="build num">ver. ${window.BUILD || '?'}</span>`;
function showMenu() {
  openOverlay(`<button class="iconbtn close" id="xBtn" aria-label="閉じる">✕</button><h3>メニュー</h3>
    <p class="sub">進み具合はこのブラウザに自動で保存されます。</p>
    <label class="toggle"><input type="checkbox" id="knToggle" ${kanaOn() ? 'checked' : ''}>市町村名にふりがなを付ける</label>
    <label class="toggle"><input type="checkbox" id="rpToggle" ${prefs.replay ? 'checked' : ''}>月を終えたあと、相手の動きを地図で見せる</label>
    <label class="toggle"><input type="checkbox" id="ssToggle" ${prefs.season !== false ? 'checked' : ''}>季節の行事（高山祭・鵜飼など）を、月を終えたときに知らせる</label>
    <label class="toggle"><input type="checkbox" id="btToggle" ${prefs.battle !== false ? 'checked' : ''}>見込み${L.BATTLE_MIN}〜${L.BATTLE_MAX}％の住民投票を決戦で決める（外すと今までの計算で決まる）</label>
    <div class="row"><button class="btn" id="guideBtn">ガイド（遊び方の説明）</button></div>
    ${S.over ? `<div class="row"><button class="btn main" id="overBtn">${S.over.win && S.over.region ? '圏域制覇の結果（続けて遊ぶ）' : '結果を見る'}</button></div>` : ''}
    <div class="row"><button class="btn danger" id="resetBtn">最初からやり直す</button></div><div id="confirmBox"></div>
    <p class="sub" style="margin-top:14px">${buildTag()}</p>`);
  $('xBtn').onclick = closeOverlay;
  $('guideBtn').onclick = showGuide;
  if ($('overBtn')) $('overBtn').onclick = showOver;
  $('knToggle').onchange = e => { prefs.kana = e.target.checked; savePrefs(); updateLabels(); renderSheet(); };
  $('rpToggle').onchange = e => { prefs.replay = e.target.checked; savePrefs(); };
  $('btToggle').onchange = e => { prefs.battle = e.target.checked; savePrefs(); };
  $('ssToggle').onchange = e => { prefs.season = e.target.checked; savePrefs(); };
  $('resetBtn').onclick = () => {
    $('confirmBox').innerHTML = `<p style="margin:12px 0 0">今の進み具合は消えます。やり直しますか？</p><div class="row"><button class="btn danger" id="yesReset">やり直す</button><button class="btn" id="noReset">やめる</button></div>`;
    $('yesReset').onclick = () => { clearSave(); showTitle(); };
    $('noReset').onclick = () => { $('confirmBox').innerHTML = ''; };
  };
}
// ガイド：項目ごとに畳み、ひとつ開くとほかは閉じる
const GUIDE = [
  ['合併の進め方', '交流 → 協定 → 協議 → 住民投票', [
    '<b>交流事業</b>で隣の市町村との関係度を上げる',
    '関係度50で<b>連携協定</b>（収入の一部が入る）、70で<b>合併協議</b>',
    '協議の3か月後に<b>住民投票</b>。満足度が高いほど賛成が増える',
    `同時に進められる協議は最初1件。陣営の魅力${L.APPEAL_TALKS.join('・')}で1件ずつ増える`,
    '内政と交流事業は<b>予算規模</b>を選べる。大きいほど効果が大きいが割高']],
  ['住民投票の決戦', `見込み${L.BATTLE_MIN}〜${L.BATTLE_MAX}％の投票は陣取りで決める`, [
    `賛成の見込みが${L.BATTLE_MIN}〜${L.BATTLE_MAX}％の住民投票は、月を終える前に90秒の陣取りで決める`,
    '地区から隣の地区へなぞって運動員を送り、押さえた地区ほど賛成が高くなる',
    '人材が技になる',
    '「おまかせ」で今までの計算にもできる。メニューで決戦そのものを切ることもできる']],
  ['ライバルとの取り合い', '切り崩し・対抗提案・引き留め・合流', [
    'ライバルの市町村は、相手の満足度が低いか、こちらの平均満足度が8以上高いと切り崩せる',
    '相手の本拠地は、その陣営の市町村が3つ以下になると切り崩せる',
    'ほかの陣営が協議中の市町村には<b>対抗提案</b>で割り込める。<b>条件を上乗せ</b>した段数が多いほど選ばれやすい',
    '自分の市町村が合併協議をかけられたら、<b>引き留め</b>で住民投票の賛成を下げられる（最大3段）',
    `<b>合流</b>：市町村を減らして${L.JOIN_TOWNS}つ以下になったライバルは、人口が${L.JOIN_RATIO}倍以上ある隣の陣営に合流を申し出ることがある。市町村・財源・人材がまとめて移る（ライバル同士でも起きる）`]],
  ['首長選挙', '4年ごと。候補を立てて市町村を取る', [
    '各市町村で4年ごとにある',
    'ほかの陣営の市町村は、投票日の3か月前から<b>候補を擁立</b>でき、当選すれば自陣営に移る。現職が少し有利',
    '<b>演説会</b>で得票を伸ばせる',
    '自陣営の市町村にも対立候補を立てられるので、演説会で守る']],
  ['人材', '役職に就けて効果を出す', [
    '<b>人材</b>を登用して役職（副市長・企画課長・交渉担当・観光大使）に就けると、税収や内政、住民投票に効く',
    '合併するとその市町村ゆかりの人材が加わる',
    '人材にはC〜Sのランクがあり、<b>県外から招へい</b>で高ランクを迎えられる']],
  ['偉人アドバイザー', `岐阜ゆかりの歴史人物が${L.ADV_MONTHS}か月力を貸す`, [
    '斎藤道三・織田信長・竹中半兵衛など岐阜ゆかりの歴史人物を、人材の画面から招ける',
    'ゆかりの地を持ち、偉人ごとの条件（合併を1回可決、財源100億円など）を満たすと招ける',
    `効果は${L.ADV_MONTHS}か月だけ`,
    '毎年9月は関ケ原町を持つ陣営に関ケ原の偉人が訪れる']],
  ['魅力・産業・観光', '魅力が高いと関係度と賛成が伸びる', [
    '<b>魅力</b>は産業力と観光力の平均',
    '陣営の魅力が相手より10以上高いと関係度が毎月自然に上がり、住民投票の賛成も増える',
    '産業力と観光力は何もしないと少しずつ下がる。<b>産業振興</b>と<b>観光PR</b>で保つ']],
  ['誘致合戦', '企業の進出先を補助金で競う', [
    'ときどき大型の企業が圏域に進出先を探しに来る',
    '圏域とその隣に市町村を持つ陣営が、候補地で<b>補助金</b>を出し合って競う',
    '立地点（産業力など）＋補助金の点数が高い候補地に決まり、毎月の税収と産業力・人口が伸びる',
    '負けた補助金は戻る。企業の税収は、その市町村を持つ陣営に入る']],
  ['負けになるとき', '財源と満足度に気をつける', [
    '財源のマイナスが3か月続くと負け',
    '満足度が20を下回ると負け']],
];
const guideHtml = () => `<div class="guide">${GUIDE.map(([t, sub, items]) => `<details name="guide"><summary><b>${t}</b><small>${sub}</small></summary><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul></details>`).join('')}</div>`;
function showGuide() {
  openOverlay(`<button class="iconbtn close" id="xBtn" aria-label="閉じる">✕</button><button class="btn" id="backBtn">← メニューに戻る</button>
    <h3 style="margin-top:16px">ガイド</h3><p class="sub">知りたい項目をタップすると説明が開きます。</p>${guideHtml()}`);
  $('xBtn').onclick = closeOverlay;
  $('backBtn').onclick = showMenu;
}

// ---------- タイトル ----------
const PICKS = [['やさしい', ['21201', '21202', '21213']], ['ふつう', ['21203', '21204', '21604']], ['むずかしい', ['21505', '21403']], ['超むずかしい', ['21507', '21521']]];
// 開始時の財源と、最初の月（4月）の収支を試算する
const PREVIEW = {};
// 圏域制覇ではライバルの置き方が変わるので、遊び方ごとに試算する
function startPreview(c, mode) {
  const k = c + ':' + (mode || 'unify');
  if (!PREVIEW[k]) {
    const st = L.newGame(MAP, c, 1, mode);
    PREVIEW[k] = { st, money: st.factions[0].money, net: L.factionIncome(st, 0, 4) - L.upkeep(st, 0) };
  }
  return PREVIEW[k];
}
const signed = n => (n >= 0 ? '+' : '−') + Math.abs(n);
const pickMode = () => prefs.mode === 'region' ? 'region' : 'unify';
function modeHtml() {
  return `<div><h4>遊び方</h4><div class="modes" role="group" aria-label="遊び方">${Object.entries(L.MODES).map(([k, m]) => `<button data-mode="${k}" aria-pressed="${pickMode() === k}"><b>${m.label}</b><small>${m.note}</small></button>`).join('')}</div></div>`;
}
// 圏域制覇での目標と、その圏域に本拠地を置くライバル
function goalHtml(st, c) {
  const r = L.INFO[c][0], cs = L.regionCodes(r);
  // 圏域の外で接するライバル（境目から入ってくる）
  const border = st.factions.slice(1).filter(f => ADJ[f.capital].some(k => L.INFO[k][0] === r));
  return `<div class="h4">目標：${r}圏域（${cs.length}市町村・${L.regionLength(r)}）の制覇</div><p class="note" style="margin:0">${cs.map(k => NAMES[k]).join('、')}</p>
    ${border.length ? `<p class="note" style="color:var(--bad)">圏域のすぐ外に${border.map(f => f.name).join('・')}がいて、境目から圏域の市町村を狙ってきます。</p>` : ''}`;
}
// 開始前に、その市町村の特産・人材・数値・ライバルを確かめる画面
let lastPick = null;
function showStartDetail(c) {
  lastPick = c;
  const pv = startPreview(c, pickMode()), st = pv.st, x = st.m[c], info = L.INFO[c];
  const tag = info[2];
  const meterP = (lb, v) => `<div class="meter"><span>${lb}</span><div class="bar"><i style="width:${Math.round(v)}%"></i></div><b class="num">${Math.round(v)}</b></div>`;
  const staff = st.staff.filter(p => p.f === 0).map(p => {
    const keys = Object.keys(L.ABIL), best = keys.reduce((a, b) => p[b] > p[a] ? b : a), g = L.gradeOf(p);
    const role = p.role ? L.ROLES[p.role] : null;
    const val = p.role ? L.abil(st, 0, p, role.key) : 0;
    return `<div class="person">${facePic(p)}<div class="top"><span class="grade ${g}">${g}</span><b>${p.name}</b><small>${role ? role.label + 'に就任' : '役職なし'}</small></div>
      <div class="abil">${keys.map(k => `<span class="${k === best ? 'best' : ''}">${L.ABIL[k]}<b class="num">${L.abil(st, 0, p, k)}</b></span>`).join('')}</div>
      ${role ? `<span class="why" style="color:var(--good)">${role.label}の効果：${roleEffect(p.role, val)}（給与 月${L.GRADE_PAY[g]}億円）</span>` : ''}</div>`;
  }).join('') || '<p class="empty">ゆかりの人材はいません。</p>';
  const rivals = st.factions.slice(1).map(f => `<span class="tag owner" style="background:var(--${f.color})">${f.name}</span>`).join(' ');
  const nb = ADJ[c].map(n => NAMES[n]).join('、');
  openOverlay(`<button class="btn" id="backBtn">← 市町村選びに戻る</button>
    <div class="kicker" style="margin-top:16px">${info[0]}圏域・${L.difficultyOf(c)}・${L.MODES[pickMode()].label}</div>
    <div class="townhead">${TI.icon(c, 'big')}<div><div class="logo" style="font-size:clamp(32px,10vw,48px)">${rb(c)}</div><small>${TI.nameOf(c)}</small></div></div>
    <div class="grid2">
      <div class="kv"><span>人口</span><b class="num">${info[1]}千人</b></div>
      <div class="kv"><span>開始時の財源</span><b class="num">${pv.money}億円</b></div>
      <div class="kv"><span>4月の収入</span><b class="num">${L.factionIncome(st, 0, 4)}億円</b></div>
      <div class="kv"><span>維持費と給与</span><b class="num">${L.upkeep(st, 0)}億円</b></div>
      <div class="kv"><span>月収支</span><b class="num" style="color:${pv.net >= 0 ? 'var(--good)' : 'var(--bad)'}">${signed(pv.net)}億円</b></div>
      <div class="kv"><span>うち地方交付税</span><b class="num">${L.grantOf(st, 0).toFixed(1)}億円</b></div>
      <div class="kv"><span>魅力</span><b class="num">${Math.round(L.appeal(st, 0))}</b></div>
      <div class="kv"><span>同時に進められる協議</span><b class="num">${L.talksMax(st, 0)}件</b></div>
    </div>
    <div class="h4">特産</div>
    ${tag ? `<p style="margin:0"><span class="tag">${tag}</span></p><p class="note" style="color:var(--ink)">${L.tagInfo(tag)}</p>` : '<p class="note">特産タグはありません。産業と観光を伸ばして個性をつくります。</p>'}
    <div class="h4">数値</div>
    <div class="meters">${meterP('産業力', x.ind)}${meterP('観光力', x.tour)}${meterP('満足度', x.sat)}${meterP('防災力', x.dis)}</div>
    <div class="h4">最初からいる人材</div><div class="people">${staff}</div>
    ${L.ADVISORS.some(a => a.home === c) ? `<div class="h4">ゆかりの偉人アドバイザー</div><div class="advs">${L.ADVISORS.filter(a => a.home === c).map(a => `<div class="adv">${advPic(a.id)}<div class="top"><b class="nm">${a.name}</b><small>${a.title}${a.seki ? '・毎年9月に訪れる' : `・${a.cost}億円`}</small></div><span class="fx">${L.advFx(a)}</span>${a.cond ? `<span class="why">招く条件：${a.cond[2]}</span>` : ''}</div>`).join('')}</div>` : ''}
    <div class="h4">隣の市町村（${ADJ[c].length}）</div><p class="note" style="margin:0">${nb}</p>
    <div class="h4">ライバル</div><p style="margin:0;display:flex;gap:6px;flex-wrap:wrap">${rivals}</p>
    ${pickMode() === 'region' ? goalHtml(st, c) : ''}
    <div class="stickygo"><button class="btn main" id="goBtn">${NAMES[c]}で始める（${L.MODES[pickMode()].label}）</button></div>`, 'title-panel');
  $('backBtn').onclick = showTitle;
  $('goBtn').onclick = () => startNew(c);
}
// 市町村のボタン。圏域で選ぶときは圏域の代わりに難易度を添える
// 畳んだ中のリストは数が多いので、2列に収まる短い書き方にする
function startBtn(c, by, compact) {
  const pv = startPreview(c), info = L.INFO[c], head = by === 'region' ? L.difficultyOf(c) : info[0];
  if (compact) return `<button data-start="${c}">${TI.icon(c)}<span>${rb(c)}<small>${head}・${info[1]}千人${info[2] ? '・' + info[2] : ''}</small><span class="money num">財源${pv.money}億・月${signed(pv.net)}億</span></span></button>`;
  return `<button data-start="${c}">${TI.icon(c)}<span>${rb(c)}<small>${head}・人口${info[1]}千人${info[2] ? '・' + info[2] : ''}</small><span class="money num">財源 ${pv.money}億円・月収支 ${signed(pv.net)}億円</span></span></button>`;
}
const pickBy = () => prefs.pickBy === 'region' ? 'region' : 'level';
// 難易度ごと：おすすめを並べ、残りは「その他の市町村」に畳む。圏域ごと：圏域ごとに畳む
function pickListHtml() {
  const byPop = cs => cs.sort((a, b) => L.INFO[b][1] - L.INFO[a][1]);
  if (pickBy() === 'region') return L.REGIONS.map(r => {
    const cs = byPop(L.regionCodes(r));
    return `<details class="more"><summary><b>${r}圏域</b>（${cs.length}市町村・圏域制覇は${L.regionLength(r)}）</summary><div class="opts compact">${cs.map(c => startBtn(c, 'region', true)).join('')}</div></details>`;
  }).join('');
  return PICKS.map(([lv, cs]) => {
    const rest = byPop(Object.keys(NAMES).filter(c => L.difficultyOf(c) === lv && !cs.includes(c)));
    return `<div><h4>${lv}</h4><div class="opts">${cs.map(c => startBtn(c)).join('')}</div>
      ${rest.length ? `<details class="more"><summary>その他の市町村（${rest.length}）</summary><div class="opts compact">${rest.map(c => startBtn(c, 'level', true)).join('')}</div></details>` : ''}</div>`;
  }).join('');
}
function bindPickList() {
  for (const b of document.querySelectorAll('[data-start]')) b.onclick = () => showStartDetail(b.dataset.start);
}
function showTitle() {
  const saved = loadSaved();
  // 圏域制覇を達成したセーブは、県内統一へ続けられるように残す
  const canCont = saved && (!saved.over || (saved.over.win && saved.over.region));
  const tabs = [['level', '難易度で選ぶ'], ['region', '圏域で選ぶ']].map(([k, lb]) => `<button data-by="${k}" aria-pressed="${pickBy() === k}">${lb}</button>`).join('');
  openOverlay(`${art('img/title.webp', 'art-top art-hero')}<div class="kicker"><span>令和8年4月　岐阜県・21市19町2村</span>${buildTag()}</div>
    <div class="logo">岐阜<em>統一</em>戦記</div>
    <p class="lead">あなたは岐阜県のある市町村の首長。交流と協定で信頼を集め、住民投票で合併を重ね、42市町村をひとつにまとめてください。</p>
    ${canCont ? `<div class="row" style="margin:0 0 18px"><button class="btn main" id="contBtn">つづきから（${L.dateOf(saved.turn).label}・${saved.factions[0] ? NAMES[saved.factions[0].capital] : ''}・${saved.over ? saved.goal + '圏域を制覇済み' : saved.mode === 'region' ? saved.goal + '圏域制覇' : '県内統一'}）</button></div>` : ''}
    <div class="pick">${modeHtml()}<div><h4>首長になる市町村を選ぶ</h4><p class="sub" style="margin:0 0 10px">タップすると特産や最初の人材などの詳細が見られます。月収支は最初の月（4月）の収入から維持費と給与を引いた額で、季節や内政で変わります。</p><div class="segs" role="group" aria-label="市町村の並べ方">${tabs}</div></div>
    <div class="pick" id="pickList">${pickListHtml()}</div></div>
    <div class="h4" style="margin-top:22px">ガイド</div>${guideHtml()}
    <p class="sub" style="margin-top:14px">人口は統計を丸めた概数、そのほかの数値はゲーム用です。登場する陣営・人材・出来事は架空です（偉人アドバイザーは岐阜ゆかりの歴史人物）。地図：国土数値情報（行政区域データ）を加工</p>`, 'title-panel');
  bindPickList();
  // 詳細から戻ったら、選んでいた市町村が見えるように畳みを開く
  if (lastPick) { const el = document.querySelector(`[data-start="${lastPick}"]`); if (el) { const d = el.closest('details'); if (d) d.open = true; el.scrollIntoView({ block: 'center' }); } }
  for (const b of document.querySelectorAll('[data-mode]')) b.onclick = () => {
    prefs.mode = b.dataset.mode; savePrefs();
    for (const x of document.querySelectorAll('[data-mode]')) x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
  };
  for (const b of document.querySelectorAll('[data-by]')) b.onclick = () => {
    prefs.pickBy = b.dataset.by; savePrefs();
    for (const x of document.querySelectorAll('[data-by]')) x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
    $('pickList').innerHTML = pickListHtml(); bindPickList();
  };
  if ($('contBtn')) $('contBtn').onclick = () => { S = saved; afterLoad(); if (S.over) showOver(); };
}
function startNew(code) {
  S = L.newGame(MAP, code, (Date.now() & 0x7fffffff), pickMode());
  afterLoad(); save();
  toast(`${NAMES[code]}の首長に就任しました`);
}
function afterLoad() {
  L.ensureStaff(S); L.ensureAdv(S); L.ensureElect(S);
  sel = null; seenLog = S.log.length; closeOverlay(); render();
  // 本拠地のまわりに大きく寄せて始める。隣の市町村をそのままタップできる
  zoomRegion('自陣', true);
}

$('endBtn').onclick = endMonth;
$('facBtn').onclick = () => S && showFactions();
$('staffBtn').onclick = () => S && !replay && showStaff();
$('newsBtn').onclick = () => S && showNews();
$('menuBtn').onclick = () => S && showMenu();
$('overlay').addEventListener('click', e => { if (e.target === $('overlay') && S && !$('panel').classList.contains('title-panel') && !queue.length && !$('okBtn') && !$('againBtn')) closeOverlay(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('overlay').hidden && $('xBtn')) closeOverlay(); });

function start() {
  buildMap();
  vb = fitBox({ x: 0, y: 0, w: MAP.w, h: MAP.h }, 14); setVB();
  showTitle();
}
start();
