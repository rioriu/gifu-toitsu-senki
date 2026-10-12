// 岐阜統一戦記 住民投票の決戦（運動員の陣取り）
// 見込みが30〜70％の自陣営の住民投票で、月を終える前に開く。90秒のあいだ地区を運動員で取り合い、押さえた地区ほど賛成が高くなる。
// 画面だけの処理で、結果（賛成票・反対票・投票率）を返す。おまかせなら null を返し、いままでの計算（見込み±10％）で決まる。
// 使い方: Battle.start(opts, done)  opts は ui.js の battleOpts() を参照
(function (root) {
  'use strict';
  const TIME = 90, SPEED = 78;
  // 反対派の強さ（増える速さの倍率・一度に送る割合・考える間隔・集会の間隔と人数）。boost は見込みで変わる
  const TUNE = { boost: 1.5, send: 0.55, gapMin: 0.8, gapBase: 1.3, rallyGap: 12, rallyAmt: 10 };
  // 地区を押さえたときの賛成の動き（swing）と、始めの形：反対派の増え方（見込みで変わる）、味方と反対派が始めに持つ地区の数と人数
  // swing は見込み30〜70％のどこからでも、全部押さえれば勝ち・全部取られれば負けになる大きさにする
  const BAL = { swing: 25, boostBase: 1.2, boostSlope: 0.015, meTowns: 2, oppTowns: 2, meBase: 20, meShare: 30, oppBase: 10, oppShare: 40, neuBase: 3, neuShare: 70, aiDelay: 6 };
  const TUT_KEY = 'gifu-toitsu-v1-battle-tut';
  // 人材の技。いちばん高い能力で決まり、強さは能力値で変わる
  const SKILL_OF = {
    neg: { kind: 'persuade', label: '説得', cd: 14, target: 'other', amt: v => Math.round(v / 8), note: n => `相手の地区 −${n}` },
    pop: { kind: 'rally', label: '応援演説', cd: 12, target: 'mine', amt: v => Math.round(v / 7), note: n => `自分の地区 +${n}` },
    pol: { kind: 'shield', label: '公約', cd: 16, target: 'mine', amt: v => Math.round(v / 11), note: n => `${n}秒 守りが倍` },
    plan: { kind: 'meeting', label: '説明会', cd: 15, target: 'mine', amt: v => Math.round(v / 12), note: n => `隣の地区すべて −${n}` }
  };
  const SKILL_COLORS = ['#c0392b', '#8e44ad', '#2471a3'];
  const DIRS = [['北', 0], ['北東', 45], ['東', 90], ['南東', 135], ['南', 180], ['南西', 225], ['西', 270], ['北西', 315]];

  let el, cv, ctx, ro = null, W = 0, H = 0, DPR = 1, C = {}, st = null, opts = null, done = null, raf = 0, last = 0;
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = () => Math.random();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const $ = id => el.querySelector('#' + id);

  // ---------- 地区をつくる ----------
  // 地図の市町村の形の中に点を敷き、近いもの同士でまとめて地区にする。中心部（地図の名前の位置）と方角で名前をつける
  function makeDistricts(o) {
    const nums = o.d.match(/-?\d+(\.\d+)?/g).map(Number);
    let bx = Infinity, by = Infinity, ex = -Infinity, ey = -Infinity;
    for (let i = 0; i < nums.length; i += 2) { bx = Math.min(bx, nums[i]); ex = Math.max(ex, nums[i]); by = Math.min(by, nums[i + 1]); ey = Math.max(ey, nums[i + 1]); }
    const path = new Path2D(o.d), probe = document.createElement('canvas').getContext('2d');
    const N = 46, stepL = Math.max(ex - bx, ey - by) / N;
    const pts = [], grid = {};
    for (let gx = 0; gx * stepL <= ex - bx; gx++) for (let gy = 0; gy * stepL <= ey - by; gy++) {
      const x = bx + (gx + 0.5) * stepL, y = by + (gy + 0.5) * stepL;
      if (probe.isPointInPath(path, x, y, 'evenodd')) { const p = { x, y, gx, gy, k: 0 }; pts.push(p); grid[gx + ',' + gy] = p; }
    }
    const k = o.pop < 15 ? 4 : o.pop < 40 ? 5 : o.pop < 100 ? 6 : 7;
    // はじめの中心：名前の位置にいちばん近い点と、そこから遠い点を順に
    const near = (x, y) => pts.reduce((b, p) => (Math.hypot(p.x - x, p.y - y) < Math.hypot(b.x - x, b.y - y) ? p : b), pts[0]);
    const cs = [near(o.lx, o.ly)];
    while (cs.length < k) cs.push(pts.reduce((b, p) => { const d = Math.min(...cs.map(c => Math.hypot(c.x - p.x, c.y - p.y))); return d > b.d ? { p, d } : b; }, { p: pts[0], d: -1 }).p);
    let cen = cs.map(p => ({ x: p.x, y: p.y }));
    for (let it = 0; it < 10; it++) {
      for (const p of pts) { let bi = 0, bd = Infinity; cen.forEach((c, i) => { const d = Math.hypot(c.x - p.x, c.y - p.y); if (d < bd) { bd = d; bi = i; } }); p.k = bi; }
      cen = cen.map((c, i) => { const m = pts.filter(p => p.k === i); return m.length ? { x: m.reduce((s, p) => s + p.x, 0) / m.length, y: m.reduce((s, p) => s + p.y, 0) / m.length } : c; });
    }
    // 隣り合う地区（点が上下左右で接していれば道でつなぐ）
    const adj = cen.map(() => new Set());
    for (const p of pts) for (const [dx, dy] of [[1, 0], [0, 1]]) { const q = grid[(p.gx + dx) + ',' + (p.gy + dy)]; if (q && q.k !== p.k) { adj[p.k].add(q.k); adj[q.k].add(p.k); } }
    // 飛び地などでつながらない地区は、いちばん近い地区とつなぐ
    const seen = new Set([0]), stack = [0];
    while (stack.length) for (const j of adj[stack.pop()]) if (!seen.has(j)) { seen.add(j); stack.push(j); }
    for (let i = 0; i < k; i++) if (!seen.has(i)) {
      let bj = 0, bd = Infinity; for (const j of seen) { const d = Math.hypot(cen[i].x - cen[j].x, cen[i].y - cen[j].y); if (d < bd) { bd = d; bj = j; } }
      adj[i].add(bj); adj[bj].add(i); seen.add(i);
    }
    // 中心部はいちばん名前の位置に近い地区
    const center = cen.reduce((b, c, i) => (Math.hypot(c.x - o.lx, c.y - o.ly) < Math.hypot(cen[b].x - o.lx, cen[b].y - o.ly) ? i : b), 0);
    const cnt = cen.map((_, i) => pts.filter(p => p.k === i).length);
    const wt = cnt.map((n, i) => Math.pow(Math.max(1, n), 0.6) * (i === center ? 2.2 : 1));
    const wsum = wt.reduce((s, v) => s + v, 0);
    // 方角の名前（重なったら次に近い方角）
    const used = new Set(), names = [];
    const order = cen.map((c, i) => i).filter(i => i !== center).sort((a, b) => Math.hypot(cen[b].x - o.lx, cen[b].y - o.ly) - Math.hypot(cen[a].x - o.lx, cen[a].y - o.ly));
    for (const i of order) {
      const ang = (Math.atan2(cen[i].x - cen[center].x, -(cen[i].y - cen[center].y)) * 180 / Math.PI + 360) % 360;
      const pick = DIRS.slice().sort((a, b) => angDiff(a[1], ang) - angDiff(b[1], ang)).find(d => !used.has(d[0]));
      used.add(pick[0]); names[i] = pick[0] + '部';
    }
    names[center] = '中心部';
    // 点の位置は、地区の中の点のうち重心にいちばん近いもの（形の外に出ないように）
    const nodes = cen.map((c, i) => {
      const own = pts.filter(p => p.k === i);
      const p = own.length ? own.reduce((b, q) => (Math.hypot(q.x - c.x, q.y - c.y) < Math.hypot(b.x - c.x, b.y - c.y) ? q : b), own[0]) : c;
      return { id: i, name: names[i], mx: p.x, my: p.y, share: wt[i] / wsum, pop: o.pop * wt[i] / wsum, center: i === center };
    });
    return { nodes, adj: adj.map(s => [...s]), box: { x: bx, y: by, w: ex - bx, h: ey - by }, path };
  }
  function angDiff(a, b) { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }

  // 始めの状態：自陣営に近い地区を味方、遠い地区を反対派にし、全体の賛成がいまの見込みと同じになるようにそろえる
  function setup(o) {
    const g = makeDistricts(o);
    const R = Math.max(g.box.w, g.box.h) / 2 || 1;
    const proj = n => ((n.mx - o.lx) * o.dir.x + (n.my - o.ly) * o.dir.y) / R;
    // 中心部のほかの地区を、自陣営に近い順に味方、遠い順に反対派へ（4地区の町は1つずつ）
    const side = g.nodes.filter(n => !n.center).sort((a, b) => proj(b) - proj(a));
    const nm = side.length >= 4 ? BAL.meTowns : 1, no = side.length >= 4 ? BAL.oppTowns : 1;
    const mine = new Set(side.slice(0, nm)), theirs = new Set(side.slice(-no));
    for (const n of g.nodes) {
      n.owner = mine.has(n) ? 'me' : theirs.has(n) ? 'opp' : 'neu';
      n.lean = o.expect + clamp(proj(n), -1, 1) * 5 - (n.center ? 2 : 0);
      n.count = n.owner === 'me' ? Math.round(BAL.meBase + n.share * BAL.meShare) : n.owner === 'opp' ? Math.round(BAL.oppBase + n.share * BAL.oppShare) : Math.round(BAL.neuBase + n.share * BAL.neuShare);
    }
    const me = side[0];
    const eff = n => n.lean + (n.owner === 'me' ? BAL.swing : n.owner === 'opp' ? -BAL.swing : 0);
    const off = o.expect - g.nodes.reduce((s, n) => s + n.share * eff(n), 0);
    for (const n of g.nodes) n.lean = clamp(n.lean + off, 5, 95);
    // 手引きの最初の1手で取れるように、味方の隣でいちばん小さい中立の地区を減らしておく
    let tut = null;
    if (o.tutorial) {
      // 中心部は勝負どころなので、隣が中心部だけなら数は減らさず、なぞり方だけ見せる
      const cand = g.adj[me.id].map(i => g.nodes[i]).filter(n => n.owner === 'neu').sort((a, b) => (a.center - b.center) || (a.count - b.count));
      const t = cand[0];
      if (t) { if (!t.center) t.count = Math.max(1, Math.min(t.count, Math.floor(me.count / 2) - 1)); tut = { from: me.id, to: t.id, stage: 'drag' }; }
    }
    return { g, tut };
  }

  // ---------- 開く・閉じる ----------
  function start(o, onDone) {
    opts = o; done = onDone;
    TUNE.boost = clamp(BAL.boostBase + (50 - o.expect) * BAL.boostSlope, 0.8, 2);
    let seen = false; try { seen = localStorage.getItem(TUT_KEY) === '1'; } catch (e) { /* 覚えられなくても遊べる */ }
    o.tutorial = !seen;
    const { g, tut } = setup(o);
    st = {
      g, nodes: g.nodes, adj: g.adj, squads: [], parts: [], floats: [], t: 0, running: false, paused: true,
      drag: null, pick: null, armed: null, cds: {}, spent: {}, freezeUntil: 0, aiNext: BAL.aiDelay, aiRallyNext: 16,
      shake: 0, eventDone: false, over: false, flash: {}, tut, slowUntil: 0, msg: null, usedSkill: false,
      skills: makeSkills(o)
    };
    for (const s of st.skills) st.cds[s.id] = 0;
    build();
    readColors(); resize();
    intro();
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function close(result) {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    if (ro) { ro.disconnect(); ro = null; }
    el.remove(); el = null; st = null;
    const cb = done; done = null;
    if (cb) cb(result);
  }

  function makeSkills(o) {
    const list = o.staff.slice(0, 3).map((p, i) => {
      const def = SKILL_OF[p.best];
      const amt = def.amt(p.val);
      return { id: 's' + i, who: p.name, kind: def.kind, label: def.label, note: def.note(amt), amt, cd: def.cd, target: def.target, color: SKILL_COLORS[i] };
    });
    if (o.adv) list.push({ id: 'adv', who: o.adv.name, kind: 'freeze', label: `${advShort(o.adv.name)}の策`, note: '反対派を6秒止める', cd: 0, target: 'none', once: true, color: '#a8701a', say: o.adv.say });
    return list;
  }

  // 偉人の技の名前は短く（竹中半兵衛→竹中、千代（山内一豊の妻）→千代）
  function advShort(name) { const b = name.split('（')[0]; return b.length > 4 ? b.slice(0, 2) : b; }

  function build() {
    el = document.createElement('div');
    el.className = 'battle';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', '住民投票の決戦');
    el.innerHTML = `<div class="bt-app">
      <div class="bt-top">
        <div class="bt-row">
          <div class="bt-ttl"><small>${opts.name}の住民投票まで</small><b>住民投票の決戦</b></div>
          <div class="bt-timer num" id="btTimer">${TIME}</div>
          <button class="bt-ghost" id="btPause" type="button">止める</button>
        </div>
        <div class="bt-gauge"><span>賛成</span><div class="bt-bar"><div class="yes" id="btYes"></div><div class="mid"></div><span class="lab">賛成</span><span class="lab r">反対</span></div><b class="num" id="btPct"></b></div>
      </div>
      <div class="bt-board" id="btBoard"><canvas id="btCv" aria-label="${opts.name}の地区と道。自分の地区から隣の地区へなぞると運動員が向かう"></canvas>
        <div class="bt-banner" id="btBanner"></div><div class="bt-toast" id="btToast" hidden><span id="btToastText"></span></div></div>
      <div class="bt-tray"><div class="bt-hint" id="btHint">${'朱の地区から、隣の地区へ指でなぞる'}</div><div class="bt-skills" id="btSkills"></div></div>
    </div>
    <div class="bt-scrim" id="btScrim" hidden><div class="bt-sheet" id="btSheet"></div></div>`;
    document.body.appendChild(el);
    cv = $('btCv'); ctx = cv.getContext('2d');
    window.addEventListener('resize', resize);
    // 盤面の大きさが変わったら（開いた直後や画面の回転）置き直す
    if (window.ResizeObserver) { ro = new ResizeObserver(resize); ro.observe($('btBoard')); }
    bindInput();
    renderSkills();
  }

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    for (const k of ['me', 'b-opp', 'b-neutral', 'land', 'b-road', 'b-out', 'ink', 'ink-2', 'surface', 'line', 'warn']) C[k] = cs.getPropertyValue('--' + k).trim();
    C.fam = getComputedStyle(document.body).fontFamily;
  }
  function resize() {
    if (!el) return;
    const r = $('btBoard').getBoundingClientRect();
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    layout();
  }
  // 市町村の形を盤面いっぱいに置く。横長・縦長の町は1.8倍まで引き伸ばして、地区が詰まらないようにする
  function layout() {
    const b = st.g.box, mx = 40, myT = 36, myB = 46, aw = W - 2 * mx, ah = H - myT - myB;
    let sx = aw / (b.w || 1), sy = ah / (b.h || 1);
    if (sy > sx * 1.8) sy = sx * 1.8; else if (sx > sy * 1.8) sx = sy * 1.8;
    st.view = { sx, sy, ox: mx + (aw - b.w * sx) / 2 - b.x * sx, oy: myT + (ah - b.h * sy) / 2 - b.y * sy };
    for (const n of st.nodes) { n.px = st.view.ox + n.mx * sx; n.py = st.view.oy + n.my * sy; }
    let md = Infinity;
    for (const a of st.nodes) for (const c of st.nodes) if (a !== c) md = Math.min(md, Math.hypot(a.px - c.px, a.py - c.py));
    for (const n of st.nodes) n.r = Math.min(13 + Math.sqrt(n.share * 19.5) * 7.5, md * 0.38, 40);
    // すぐ下に別の地区があれば、名前は上に出す
    for (const n of st.nodes) n.labelUp = st.nodes.some(m => m !== n && Math.abs(m.px - n.px) < 70 && m.py > n.py && m.py - m.r < n.py + n.r + 24);
  }

  // ---------- 遊びの中身 ----------
  const node = id => st.nodes[id];
  const lenOf = (a, b) => Math.hypot(b.px - a.px, b.py - a.py) || 1;
  const rate = n => (0.5 + n.share * 3.1) * (n.owner === 'opp' ? TUNE.boost : 1);
  const cap = n => 20 + n.share * 156;
  const effLean = n => n.lean + (n.owner === 'me' ? BAL.swing : n.owner === 'opp' ? -BAL.swing : 0);
  const total = () => st.nodes.reduce((s, n) => s + n.share * effLean(n), 0);

  function send(from, to, owner, frac) {
    const n = Math.floor(from.count * (frac || 0.5));
    if (n < 1) return false;
    from.count -= n;
    st.squads.push({ from: from.id, to: to.id, owner, n, t: 0, seed: rand() * 6 });
    return true;
  }
  // 地区の人数を味方（+）か反対派（−）の側へ動かす。足りなくなると持ち主が変わる
  function push(n, v) {
    if (!v) return;
    const side = v > 0 ? 'me' : 'opp', amt = Math.abs(v);
    if (n.owner === side) { n.count += amt; return; }
    const hit = n.shieldUntil > st.t && n.owner === 'me' && side === 'opp' ? amt / 2 : amt;
    n.count -= hit;
    if (n.count < 0) capture(n, side, -n.count);
  }
  function capture(n, side, rest) {
    const prev = n.owner;
    n.owner = side; n.count = rest; n.shieldUntil = 0;
    st.flash[n.id] = 1;
    burst(n.px, n.py, side === 'me' ? C.me : C['b-opp'], 26, 3.2);
    st.shake = reduce() ? 0 : 7;
    st.floats.push({ x: n.px, y: n.py - n.r - 8, text: side === 'me' ? '制圧！' : '奪われた', color: side === 'me' ? C.me : C['b-opp'], life: 1.4, big: true });
    toast(side === 'me' ? `${n.name}を押さえた（賛成 ${effLean(n).toFixed(0)}％）` : `反対派が${n.name}を${prev === 'me' ? '奪い返した' : '押さえた'}`);
    if (st.tut && side === 'me' && !st.tut.capShown) { st.tut.capShown = true; say('押さえた地区は、時間とともに人が増えていく', { node: n.id }, 3000); }
  }
  function burst(x, y, color, k, sp) {
    if (reduce()) return;
    for (let i = 0; i < k; i++) { const a = rand() * Math.PI * 2, v = (0.4 + rand()) * sp * 40; st.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + rand() * 0.5, color }); }
  }

  // 反対派：取れる地区のうち人口が多くて手薄な地区を攻め、危ない地区は守る
  function aiThink() {
    let best = null;
    for (const a of st.nodes) {
      if (a.owner !== 'opp' || a.count < 7) continue;
      const out = Math.floor(a.count * TUNE.send);
      for (const bid of st.adj[a.id]) {
        const b = node(bid);
        let score;
        if (b.owner === 'opp') {
          const threat = st.adj[b.id].map(node).filter(c => c.owner === 'me').reduce((m, c) => Math.max(m, c.count), 0);
          if (threat > b.count && a.count > b.count + 6) score = 0.5 + b.share;
        } else {
          const coming = st.squads.filter(s => s.to === b.id && s.owner === 'opp').reduce((m, s) => m + s.n, 0);
          const need = b.count * (b.shieldUntil > st.t ? 2 : 1) - coming;
          if (out > need + 1) score = (b.share * 19.5 + 1.2) / (Math.max(need, 0) + 4) * (b.owner === 'me' ? 1.5 : 1);
        }
        if (score !== undefined) { score *= 0.8 + rand() * 0.4; if (!best || score > best.s) best = { a, b, s: score }; }
      }
    }
    if (best) send(best.a, best.b, 'opp', TUNE.send);
  }
  function aiRally() {
    const mine = st.nodes.filter(n => n.owner === 'opp');
    if (!mine.length) return;
    const n = mine.sort((p, q) => p.count - q.count)[0];
    n.count += TUNE.rallyAmt;
    st.floats.push({ x: n.px, y: n.py - n.r - 6, text: '反対集会 +' + TUNE.rallyAmt, color: C['b-opp'], life: 1.4 });
  }

  // 手引きの吹き出し。at は地区（node）か運動員の列（squad）か画面の位置（x, y）
  function say(text, at, ms) { st.msg = { text, at, until: performance.now() + ms }; }
  function tutTick() {
    const T = st.tut;
    if (!T || T.stage === 'drag') return;
    if (!T.oppShown) {
      const s = st.squads.find(q => q.owner === 'opp' && q.t > 0.12);
      if (s) { T.oppShown = true; st.slowUntil = performance.now() + 2800; say('反対派の列。道でぶつかると、同じ数ずつ減る', { squad: s }, 2800); }
    }
    if (!T.skillShown && st.t >= 22) {
      T.skillShown = true;
      try { localStorage.setItem(TUT_KEY, '1'); } catch (e) { /* 覚えられなくても遊べる */ }
      if (!st.usedSkill && st.skills.length) {
        $('btSkills').classList.add('pulse');
        say('下の人材の技も使える。技を押してから地区を押す', { x: W / 2, y: H - 4, down: true }, 4200);
        const me = st;
        setTimeout(() => { if (st === me) $('btSkills').classList.remove('pulse'); }, 4200);
      }
    }
  }

  function step(dt) {
    st.t += dt;
    tutTick();
    const frozen = st.freezeUntil > st.t;
    for (const k in st.cds) st.cds[k] = Math.max(0, st.cds[k] - dt);
    for (const n of st.nodes) {
      if (st.flash[n.id]) st.flash[n.id] = Math.max(0, st.flash[n.id] - dt * 1.6);
      if (n.owner === 'neu' || (frozen && n.owner === 'opp')) continue;
      if (n.count < cap(n)) n.count = Math.min(cap(n), n.count + rate(n) * dt);
    }
    for (const s of st.squads) if (!(frozen && s.owner === 'opp')) s.t += SPEED * dt / lenOf(node(s.from), node(s.to));
    // 道の上でぶつかる
    for (let i = 0; i < st.squads.length; i++) {
      const a = st.squads[i]; if (a.n <= 0) continue;
      for (let j = i + 1; j < st.squads.length; j++) {
        const b = st.squads[j]; if (b.n <= 0 || a.owner === b.owner) continue;
        if (a.from === b.to && a.to === b.from && a.t + b.t >= 1) {
          const m = Math.min(a.n, b.n); a.n -= m; b.n -= m;
          const A = node(a.from), B = node(a.to), tt = Math.min(1, a.t);
          const x = A.px + (B.px - A.px) * tt, y = A.py + (B.py - A.py) * tt;
          burst(x, y, C.warn, Math.min(30, 6 + m), 2.4);
          st.floats.push({ x, y: y - 10, text: `−${m}`, color: C.warn, life: 0.9 });
        }
      }
    }
    for (const s of st.squads) {
      if (s.n > 0 && s.t >= 1) {
        const n = node(s.to);
        push(n, s.owner === 'me' ? s.n : -s.n);
        burst(n.px, n.py, s.owner === 'me' ? C.me : C['b-opp'], Math.min(10, 2 + s.n / 3), 1.2);
        s.n = 0;
      }
    }
    st.squads = st.squads.filter(s => s.n > 0);
    if (!frozen) {
      st.aiNext -= dt;
      if (st.aiNext <= 0) { aiThink(); st.aiNext = Math.max(TUNE.gapMin, TUNE.gapBase - st.t / 120) + rand() * 0.4; }
      st.aiRallyNext -= dt;
      if (st.aiRallyNext <= 0) { aiRally(); st.aiRallyNext = TUNE.rallyGap + rand() * 3; }
    }
    for (const p of st.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.92; p.vy *= 0.92; p.life -= dt; }
    st.parts = st.parts.filter(p => p.life > 0);
    for (const f of st.floats) { f.y -= 22 * dt; f.life -= dt; }
    st.floats = st.floats.filter(f => f.life > 0);
    st.shake = Math.max(0, st.shake - dt * 30);
    if (!st.eventDone && st.t >= TIME / 2) { st.eventDone = true; showEvent(); }
    const meAlive = st.nodes.some(n => n.owner === 'me') || st.squads.some(s => s.owner === 'me');
    const oppAlive = st.nodes.some(n => n.owner === 'opp') || st.squads.some(s => s.owner === 'opp');
    if (st.t >= TIME || !meAlive || !oppAlive) finish(!oppAlive ? 'sweep' : !meAlive ? 'wiped' : 'time');
  }

  // ---------- 描く ----------
  function draw() {
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    if (st.shake) ctx.translate((rand() - .5) * st.shake, (rand() - .5) * st.shake);
    ctx.fillStyle = C['b-out']; ctx.fillRect(-10, -10, W + 20, H + 20);
    // 市町村の形
    ctx.save();
    ctx.translate(st.view.ox, st.view.oy); ctx.scale(st.view.sx, st.view.sy);
    ctx.fillStyle = C.land; ctx.fill(st.g.path, 'evenodd');
    ctx.strokeStyle = C.line; ctx.lineWidth = 2 / Math.min(st.view.sx, st.view.sy); ctx.stroke(st.g.path);
    ctx.restore();
    const fam = C.fam;
    // 道
    const dragFrom = st.drag && node(st.drag.from);
    for (let a = 0; a < st.adj.length; a++) for (const b of st.adj[a]) {
      if (b < a) continue;
      const A = node(a), B = node(b);
      const live = dragFrom && (a === dragFrom.id || b === dragFrom.id);
      ctx.strokeStyle = C['b-road']; ctx.lineWidth = live ? 9 : 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(A.px, A.py); ctx.lineTo(B.px, B.py); ctx.stroke();
      ctx.strokeStyle = live ? C.me : C['b-neutral']; ctx.lineWidth = 1.5; ctx.setLineDash([5, 6]);
      ctx.beginPath(); ctx.moveTo(A.px, A.py); ctx.lineTo(B.px, B.py); ctx.stroke(); ctx.setLineDash([]);
    }
    // 運動員の列
    for (const s of st.squads) {
      const A = node(s.from), B = node(s.to), L = lenOf(A, B);
      const ux = (B.px - A.px) / L, uy = (B.py - A.py) / L;
      const hx = A.px + ux * L * Math.min(1, s.t), hy = A.py + uy * L * Math.min(1, s.t);
      ctx.fillStyle = s.owner === 'me' ? C.me : C['b-opp'];
      for (let i = 0; i < Math.min(s.n, 12); i++) {
        const back = i * 6, wob = Math.sin(st.t * 9 + i * 1.7 + s.seed) * 3;
        const x = hx - ux * back - uy * wob, y = hy - uy * back + ux * wob;
        if ((x - A.px) * ux + (y - A.py) * uy < A.r * .6) break;
        ctx.beginPath(); ctx.arc(x, y, i === 0 ? 4.6 : 3.6, 0, Math.PI * 2); ctx.fill();
      }
      if (s.n >= 3) { ctx.font = '700 11px ' + fam; ctx.lineWidth = 3; ctx.strokeStyle = C.surface; ctx.strokeText(s.n, hx + 6, hy - 6); ctx.fillText(s.n, hx + 6, hy - 6); }
    }
    // 地区
    for (const n of st.nodes) {
      const col = n.owner === 'me' ? C.me : n.owner === 'opp' ? C['b-opp'] : C['b-neutral'];
      const fl = st.flash[n.id] || 0;
      if (dragFrom && st.adj[dragFrom.id].includes(n.id)) {
        ctx.strokeStyle = C.me; ctx.lineWidth = 2.5; ctx.globalAlpha = .5 + .5 * Math.sin(st.t * 8 + performance.now() / 200);
        ctx.beginPath(); ctx.arc(n.px, n.py, n.r + 8, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      }
      if (st.armed && validTarget(st.armed, n)) {
        ctx.strokeStyle = C.warn; ctx.lineWidth = 3; ctx.setLineDash([4, 4]); ctx.lineDashOffset = -performance.now() / 50;
        ctx.beginPath(); ctx.arc(n.px, n.py, n.r + 7, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.beginPath(); ctx.arc(n.px, n.py + 3, n.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(n.px, n.py, n.r * (1 + fl * .25), 0, Math.PI * 2); ctx.fill();
      if (n.owner !== 'neu') {
        ctx.strokeStyle = C.surface; ctx.globalAlpha = .55; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(n.px, n.py, Math.max(2, n.r - 4), -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, n.count / cap(n))); ctx.stroke(); ctx.globalAlpha = 1;
      }
      if (n.shieldUntil > st.t) {
        ctx.strokeStyle = '#2471a3'; ctx.lineWidth = 3.5; ctx.setLineDash([8, 5]); ctx.lineDashOffset = st.t * 30;
        ctx.beginPath(); ctx.arc(n.px, n.py, n.r + 4, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      }
      if ((st.drag && st.drag.from === n.id) || st.pick === n.id) { ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(n.px, n.py, n.r + 3, 0, Math.PI * 2); ctx.stroke(); }
      ctx.fillStyle = n.owner === 'neu' ? C.ink : '#fff';
      ctx.font = `${Math.round(11 + n.r * .3)}px 'Dela Gothic One', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(Math.floor(n.count), n.px, n.py + 1);
      ctx.font = '700 11px ' + fam; ctx.textBaseline = 'top';
      const label = `${n.name} ${(n.pop).toFixed(1)}千人`;
      const tw = ctx.measureText(label).width + 10;
      const ly = n.labelUp ? n.py - n.r - 21 : n.py + n.r + 4;
      ctx.fillStyle = C.surface; ctx.globalAlpha = .9; roundRect(n.px - tw / 2, ly, tw, 17, 8); ctx.fill(); ctx.globalAlpha = 1;
      ctx.fillStyle = C.ink; ctx.fillText(label, n.px, ly + 2.5);
      ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
    }
    // なぞっている矢印
    if (st.drag && st.drag.moved) {
      const A = dragFrom, tx = st.drag.x, ty = st.drag.y;
      const tgt = hitNode(tx, ty), ok = tgt && st.adj[A.id].includes(tgt.id);
      const ex = ok ? tgt.px : tx, ey = ok ? tgt.py : ty;
      ctx.strokeStyle = ok ? C.me : C['ink-2']; ctx.lineWidth = 4; ctx.globalAlpha = .85;
      ctx.beginPath(); ctx.moveTo(A.px, A.py); ctx.lineTo(ex, ey); ctx.stroke();
      const ang = Math.atan2(ey - A.py, ex - A.px), back = ok ? tgt.r + 4 : 0;
      const ax = ex - Math.cos(ang) * back, ay = ey - Math.sin(ang) * back;
      ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - Math.cos(ang - .45) * 14, ay - Math.sin(ang - .45) * 14); ctx.lineTo(ax - Math.cos(ang + .45) * 14, ay - Math.sin(ang + .45) * 14); ctx.fill();
      ctx.globalAlpha = 1;
      const msg = ok ? `${Math.floor(A.count / 2)}人を送る` : tgt && tgt !== A ? '道がつながっていない' : '';
      if (msg) { ctx.font = '700 12px ' + fam; ctx.lineWidth = 3.5; ctx.strokeStyle = C.surface; ctx.fillStyle = C.ink; ctx.strokeText(msg, tx + 12, ty - 14); ctx.fillText(msg, tx + 12, ty - 14); }
    }
    for (const p of st.parts) { ctx.globalAlpha = clamp(p.life * 2, 0, 1); ctx.fillStyle = p.color; ctx.fillRect(p.x - 1.6, p.y - 1.6, 3.2, 3.2); }
    ctx.globalAlpha = 1;
    for (const f of st.floats) {
      ctx.globalAlpha = Math.min(1, f.life * 1.5);
      ctx.font = f.big ? "18px 'Dela Gothic One', sans-serif" : '700 12px ' + fam; ctx.textAlign = 'center';
      ctx.lineWidth = 4; ctx.strokeStyle = C.surface; ctx.strokeText(f.text, f.x, f.y); ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y);
      ctx.textAlign = 'start';
    }
    ctx.globalAlpha = 1;
    if (st.freezeUntil > st.t) { ctx.fillStyle = C.warn; ctx.globalAlpha = .08 + .04 * Math.sin(st.t * 6); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    drawTut();
    ctx.restore();
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  // 手引き：最初の1手は、指がなぞる動きを見せる
  function drawTut() {
    const now = performance.now();
    if (st.tut && st.tut.stage === 'drag' && st.running && !st.paused) {
      const A = node(st.tut.from), B = node(st.tut.to);
      const ring = .5 + .5 * Math.sin(now / 160);
      ctx.strokeStyle = C.me; ctx.lineWidth = 3;
      for (const n of [A, B]) { ctx.globalAlpha = .35 + .5 * ring; ctx.beginPath(); ctx.arc(n.px, n.py, n.r + 9, 0, Math.PI * 2); ctx.stroke(); }
      ctx.globalAlpha = 1;
      const p = (now % 1900) / 1900;
      const k = p < .15 ? 0 : p > .75 ? 1 : (p - .15) / .6;
      const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const hx = A.px + (B.px - A.px) * e, hy = A.py + (B.py - A.py) * e;
      const fade = p > .85 ? (1 - p) / .15 : 1;
      if (k > 0) { ctx.strokeStyle = C.me; ctx.lineWidth = 4; ctx.globalAlpha = .9 * fade; ctx.beginPath(); ctx.moveTo(A.px, A.py); ctx.lineTo(hx, hy); ctx.stroke(); }
      ctx.globalAlpha = fade;
      ctx.fillStyle = C.surface; ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(hx, hy, p < .15 ? 13 - p * 20 : 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 1;
      const my = (A.py + B.py) / 2, below = my < H / 2;
      bubble(`${A.name}から${B.name}へ、指でなぞる`, (A.px + B.px) / 2, below ? Math.max(A.py + A.r, B.py + B.r) + 34 : Math.min(A.py - A.r, B.py - B.r) - 30, false);
      return;
    }
    if (!st.msg) return;
    if (now > st.msg.until) { st.msg = null; return; }
    const at = st.msg.at;
    let x, y, down = true;
    if (at.node !== undefined) { const n = node(at.node); x = n.px; y = n.py - n.r - 30; if (y < 30) { y = n.py + n.r + 44; down = false; } }
    else if (at.squad) {
      const s = at.squad, A = node(s.from), B = node(s.to), t = Math.min(1, s.t);
      x = A.px + (B.px - A.px) * t; y = A.py + (B.py - A.py) * t - 20;
      if (y < 30) { y += 50; down = false; }
    } else { x = at.x; y = at.y; down = !!at.down; }
    bubble(st.msg.text, x, y, down);
  }
  function bubble(text, x, y, down) {
    ctx.font = '700 12.5px ' + C.fam;
    const w = Math.min(W - 16, ctx.measureText(text).width + 22), h = 28;
    const bx = clamp(x - w / 2, 8, W - w - 8), by = down ? y - h : y - h / 2;
    ctx.fillStyle = C.ink; ctx.globalAlpha = .92;
    roundRect(bx, by, w, h, 14); ctx.fill();
    if (down) { const tx = clamp(x, bx + 14, bx + w - 14); ctx.beginPath(); ctx.moveTo(tx - 7, by + h - 1); ctx.lineTo(tx + 7, by + h - 1); ctx.lineTo(tx, by + h + 8); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.surface; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, bx + w / 2, by + h / 2 + 1);
    ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
  }

  // ---------- 画面の数字 ----------
  let lastHud = '', lastSk = '';
  function hud() {
    const left = Math.max(0, Math.ceil(TIME - st.t)), t = total();
    const key = left + '|' + t.toFixed(1) + '|' + st.running;
    if (key === lastHud) return; lastHud = key;
    $('btTimer').textContent = left;
    $('btTimer').classList.toggle('hurry', left <= 10 && st.running);
    $('btPct').textContent = t.toFixed(1) + '％';
    $('btPct').style.color = t > 50 ? 'var(--me)' : 'var(--ink)';
    $('btYes').style.width = clamp(t, 0, 100) + '%';
  }
  function renderSkills() {
    if (!st.skills.length) { $('btSkills').innerHTML = '<p class="bt-none">人材がいないので、技は使えません</p>'; return; }
    $('btSkills').innerHTML = st.skills.map(s => {
      const cd = st.cds[s.id], spent = s.once && st.spent[s.id];
      return `<button type="button" class="bt-sk ${st.armed === s.id ? 'armed' : ''} ${spent ? 'spent' : ''}" data-sk="${s.id}"><span class="ic" style="background:${s.color}">${s.label[0]}</span><b>${s.label}</b><small>${s.who}</small><small class="nt">${s.note}</small>${cd > 0 ? `<span class="cd num">${Math.ceil(cd)}</span>` : ''}</button>`;
    }).join('');
  }
  function skillsTick() {
    const key = st.skills.map(s => Math.ceil(st.cds[s.id]) + (st.armed === s.id ? 'a' : '') + (st.spent[s.id] ? 's' : '')).join(',');
    if (key !== lastSk) { lastSk = key; renderSkills(); }
  }
  let toastTimer = 0;
  function toast(text) { $('btToastText').textContent = text; $('btToast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { if (el) $('btToast').hidden = true; }, 1800); }
  function hint(t) { $('btHint').textContent = t; }
  const HINT = '朱の地区から、隣の地区へ指でなぞる';
  function banner(text) { const b = $('btBanner'); b.textContent = text; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); }

  // ---------- 操作 ----------
  function pt(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function hitNode(x, y) { let best = null, bd = Infinity; for (const n of st.nodes) { const d = Math.hypot(n.px - x, n.py - y); if (d < n.r + 16 && d < bd) { bd = d; best = n; } } return best; }
  function validTarget(id, n) { const s = st.skills.find(q => q.id === id); return s.target === 'mine' ? n.owner === 'me' : s.target === 'other' ? n.owner !== 'me' : false; }

  function bindInput() {
    cv.addEventListener('pointerdown', e => {
      if (!st.running || st.paused) return;
      const p = pt(e), n = hitNode(p.x, p.y);
      if (st.armed) { if (n && validTarget(st.armed, n)) useSkill(st.armed, n); else { st.armed = null; hint(HINT); renderSkills(); } return; }
      // 2回タップでも送れる：先に選んだ地区の隣を押すと送る
      if (st.pick !== null && n && st.pick !== n.id && st.adj[st.pick].includes(n.id) && node(st.pick).owner === 'me') { playerSend(node(st.pick), n); st.pick = null; return; }
      if (n && n.owner === 'me') { st.drag = { from: n.id, x: p.x, y: p.y, moved: false }; try { cv.setPointerCapture(e.pointerId); } catch (err) { /* 取れなくても動く */ } }
      else st.pick = null;
    });
    cv.addEventListener('pointermove', e => {
      if (!st || !st.drag) return;
      const p = pt(e); st.drag.x = p.x; st.drag.y = p.y;
      const A = node(st.drag.from);
      if (Math.hypot(p.x - A.px, p.y - A.py) > A.r) st.drag.moved = true;
    });
    cv.addEventListener('pointerup', () => {
      if (!st || !st.drag) return;
      const d = st.drag; st.drag = null;
      const A = node(d.from);
      if (!d.moved) { st.pick = d.from; hint(`${A.name}を選んだ。隣の地区を押すと半分を送る`); return; }
      const n = hitNode(d.x, d.y);
      if (n && st.adj[A.id].includes(n.id) && A.owner === 'me') playerSend(A, n);
      else if (n && n !== A) hint('道でつながった隣の地区にだけ送れる');
    });
    cv.addEventListener('pointercancel', () => { if (st) st.drag = null; });
    $('btSkills').addEventListener('click', e => {
      const b = e.target.closest('.bt-sk'); if (!b || !st.running || st.paused) return;
      const s = st.skills.find(q => q.id === b.dataset.sk);
      if (st.cds[s.id] > 0 || (s.once && st.spent[s.id])) return;
      if (s.target === 'none') { useSkill(s.id, null); return; }
      st.armed = st.armed === s.id ? null : s.id;
      hint(st.armed ? (s.target === 'mine' ? `${s.label}：自分の地区を押す` : `${s.label}：反対派か、まだどちらでもない地区を押す`) : HINT);
      renderSkills();
    });
    $('btPause').addEventListener('click', () => {
      if (!st.running || st.over) return;
      openSheet(`<div class="eyebrow">一時停止</div><h2>残り ${Math.ceil(TIME - st.t)}秒</h2><p>「おまかせ」にすると、決戦をやめていままでの計算で決めます（見込み ${opts.expect.toFixed(1)}％ に ±10％ の運）。</p>
        <div class="bt-btns"><button class="secondary" type="button" data-cmd="auto">おまかせで決める</button><button class="primary" type="button" data-cmd="resume">続ける</button></div>`);
    });
    $('btSheet').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const c = b.dataset.cmd;
      if (c === 'begin') { closeSheet(); st.running = true; banner('決戦開始'); if (st.tut) hint('まずは1手。時間は止まっています'); return; }
      if (c === 'resume') { closeSheet(); return; }
      if (c === 'auto') { close(null); return; }
      if (c === 'skip') { st.skipCount = true; return; }
      if (c === 'done') { close(st.result); return; }
      if (b.dataset.choice) chooseEvent(b.dataset.choice);
    });
  }
  function playerSend(A, n) {
    if (!send(A, n, 'me')) return;
    hint(n.owner === 'me' ? `${n.name}へ援軍` : `${n.name}へ向かった`);
    if (st.tut && st.tut.stage === 'drag') { st.tut.stage = 'play'; last = performance.now(); }
  }
  function useSkill(id, n) {
    const s = st.skills.find(q => q.id === id);
    st.armed = null; st.usedSkill = true;
    const fl = text => st.floats.push({ x: n.px, y: n.py - n.r - 6, text, color: s.color, life: 1.3 });
    if (s.kind === 'persuade') { push(n, s.amt); burst(n.px, n.py, s.color, 16, 2); fl(`説得 −${s.amt}`); }
    if (s.kind === 'rally') { n.count += s.amt; burst(n.px, n.py, s.color, 16, 2); fl(`応援演説 +${s.amt}`); }
    if (s.kind === 'shield') { n.shieldUntil = st.t + s.amt; fl('公約で守る'); }
    if (s.kind === 'meeting') {
      for (const j of st.adj[n.id]) { const m = node(j); if (m.owner !== 'me') { push(m, s.amt); burst(m.px, m.py, s.color, 8, 1.6); } }
      fl('説明会');
    }
    if (s.kind === 'freeze') { st.freezeUntil = st.t + 6; st.spent[s.id] = true; banner(s.label); toast(`${s.who}「${s.say}」`); }
    st.cds[id] = s.cd;
    hint(HINT);
    renderSkills();
  }

  // ---------- シート ----------
  function openSheet(html) { $('btSheet').innerHTML = html; $('btScrim').hidden = false; $('btSheet').scrollTop = 0; st.paused = true; }
  function closeSheet() { $('btScrim').hidden = true; st.paused = false; last = performance.now(); }

  function intro() {
    const side = st.nodes.find(n => n.owner === 'me'), center = st.nodes.find(n => n.center);
    openSheet(`<div class="eyebrow">住民投票の決戦</div><h2>90秒で、${opts.name}の地区を押さえる</h2>
      <p>${opts.name}との合併は、賛成の見込みが <b class="num">${opts.expect.toFixed(1)}％</b> です。地区を押さえるほど、その地区の賛成が上がります。人口の多い${center.name}を取れるかが勝負です。${side ? `いまは${opts.mine}寄りの${side.name}を押さえています。` : ''}</p>
      ${st.tut ? '<p>最初の1手は案内します。</p>' : `<ul class="bt-how">
        <li><span class="k" style="background:var(--me)">1</span><span><b>朱の地区から隣の地区へなぞる</b>と、運動員の半分が道を走っていく。相手より多く着けばその地区を押さえられる</span></li>
        <li><span class="k" style="background:var(--b-opp)">2</span><span>反対派も攻めてくる。道の途中でぶつかると、同じ数ずつ減る</span></li>
        <li><span class="k" style="background:var(--warn)">3</span><span>下の人材の技は、押してから地区を押す</span></li></ul>`}
      <div class="bt-btns"><button class="secondary" type="button" data-cmd="auto">おまかせ</button><button class="primary" type="button" data-cmd="begin">決戦開始</button></div>
      <p class="bt-note">おまかせは、いままでと同じ計算（見込み±10％の運）で決めます。メニューで決戦をしない設定にもできます。</p>`);
  }

  function showEvent() {
    const center = st.nodes.find(n => n.center), side = st.nodes.find(n => n.owner === 'me') || center;
    st.eventFx = { a: { [center.id]: 12, [side.id]: side === center ? 0 : -4 }, b: {}, c: { [center.id]: -10 } };
    const others = st.nodes.filter(n => !n.center).slice(0, 2);
    st.eventFx.b[center.id] = 6; for (const n of others) st.eventFx.b[n.id] = 3;
    openSheet(`<div class="eyebrow">論点が持ち上がった（時間は止まっています）</div><h2>新しい市の名前</h2><p>地元紙が「新市名は『${opts.mine}』で調整」と報じた。${opts.name}の人たちに動揺が広がっている。</p>
      <div class="bt-acts">
        <button class="bt-act" type="button" data-choice="a"><b>新市名は公募で決めると約束する</b><small>${center.name}に +12${side !== center ? `（${side.name}は −4）` : ''}</small></button>
        <button class="bt-act" type="button" data-choice="b"><b>新市名は合併後に住民と決めると答える</b><small>${center.name}に +6、${others.map(n => n.name).join('・')}に +3</small></button>
        <button class="bt-act" type="button" data-choice="c"><b>取り合わない</b><small>反対派が${center.name}に +10</small></button>
      </div>`);
  }
  function chooseEvent(k) {
    const fx = st.eventFx[k];
    for (const id in fx) {
      if (!fx[id]) continue;
      const n = node(+id);
      push(n, fx[id]);
      st.floats.push({ x: n.px, y: n.py - n.r - 6, text: (fx[id] > 0 ? '+' : '−') + Math.abs(fx[id]), color: fx[id] > 0 ? C.me : C['b-opp'], life: 1.4 });
    }
    closeSheet();
  }

  // ---------- 決着 ----------
  function finish(why) {
    if (st.over) return;
    st.over = true; st.running = false;
    banner(why === 'sweep' ? '完勝' : why === 'wiped' ? '総崩れ' : '投票日');
    const me = st;
    setTimeout(() => { if (st === me) countVotes(why); }, reduce() ? 200 : 1300);
  }
  function countVotes(why) {
    const turnout = 0.42 + rand() * 0.25;
    const rows = st.nodes.map(n => {
      const yes = clamp(effLean(n) + (rand() * 6 - 3), 3, 97);
      const cast = Math.round(n.pop * 1000 * 0.82 * turnout);
      const y = Math.round(cast * yes / 100);
      return { n, y, no: cast - y, own: n.owner };
    }).sort((a, b) => a.n.pop - b.n.pop);
    const Yt = rows.reduce((s, r) => s + r.y, 0), Nt = rows.reduce((s, r) => s + r.no, 0);
    st.result = { yes: Yt, no: Nt, turnout };
    st.skipCount = false;
    const me = st;
    const drawCount = k => {
      if (st !== me) return;
      let Y = 0, N = 0;
      const list = rows.map((r, i) => {
        const open = i < k; if (open) { Y += r.y; N += r.no; }
        const p = r.y / Math.max(1, r.y + r.no) * 100;
        const own = r.own === 'me' ? '<span class="own" style="background:var(--me)">味方</span>' : r.own === 'opp' ? '<span class="own" style="background:var(--b-opp)">反対</span>' : '<span class="own" style="background:var(--b-neutral);color:var(--ink)">中立</span>';
        return `<div class="bt-crow ${open ? 'open' : ''}"><span>${r.n.name}</span>${own}<span class="mini"><i style="width:${open ? p : 0}%"></i></span><span class="num" style="text-align:right">${open ? p.toFixed(1) + '％' : '…'}</span></div>`;
      }).join('');
      const fin = k >= rows.length, pass = Y > N, tp = Y + N ? Y / (Y + N) * 100 : 0;
      openSheet(`<div class="eyebrow">開票</div><h2>${opts.name} 住民投票（${opts.mine}との合併）</h2>
        <div class="bt-count">${list}</div>
        <div class="bt-total"><span>賛成 <b class="num">${Y.toLocaleString()}</b></span><span>反対 <b class="num">${N.toLocaleString()}</b></span></div>
        ${fin ? `<div class="bt-verdict ${pass ? 'pass' : 'fail'}">${pass ? '可決' : '否決'}</div>
          <p>賛成 ${tp.toFixed(1)}％・投票率 ${(turnout * 100).toFixed(1)}％。${why === 'sweep' ? '反対派の地区をすべて押さえた。' : why === 'wiped' ? '味方の地区をすべて失った。' : ''}${pass ? `${opts.name}はあなたの陣営に加わります。` : '関係度が下がり、2か月は再協議できません。'}</p>
          <div class="bt-btns"><button class="primary" type="button" data-cmd="done">次へ</button></div>`
        : `<div class="bt-btns"><button class="secondary" type="button" data-cmd="skip">すぐ結果を見る</button></div>`}`);
      if (!fin) setTimeout(() => { if (st === me) drawCount(st.skipCount || reduce() ? rows.length : k + 1); }, k === rows.length - 1 ? 1000 : 520);
    };
    drawCount(0);
  }

  // ---------- ループ ----------
  function frame(now) {
    if (!el) return;
    const dt = Math.min(0.05, (now - last) / 1000) * (st.slowUntil > now ? 0.25 : 1); last = now;
    const waiting = st.tut && st.tut.stage === 'drag';
    if (st.running && !st.paused && !waiting && !document.hidden) step(dt);
    if (!el) return;
    draw(); hud(); skillsTick();
    raf = requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', () => { last = performance.now(); });

  root.Battle = { start, TUNE, BAL, TIME, _debug: () => ({ st, step, send, useSkill, push, total, draw, makeDistricts, close }) };
})(window);
